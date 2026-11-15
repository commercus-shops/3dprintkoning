// Uploads dist/ to the shop's Garage website bucket ($S3_BUCKET) through the S3 API
// ($AWS_ENDPOINT_URL, path-style, region garage), and removes what the build no longer has.
// index.html is never cached, so a new release shows at once; the fingerprinted assets are kept a
// year. Run by .forgejo/workflows/deploy.yml after `npm run build`.
import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const bucket = process.env.S3_BUCKET;
if (!bucket) throw new Error("S3_BUCKET is not set");
const s3 = new S3Client({ endpoint: process.env.AWS_ENDPOINT_URL, region: process.env.AWS_DEFAULT_REGION ?? "garage", forcePathStyle: true });

const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".json": "application/json", ".woff2": "font/woff2", ".txt": "text/plain",
};

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

const dist = new URL("../dist/", import.meta.url).pathname;
const uploaded = new Set();
for await (const path of files(dist)) {
  const key = relative(dist, path);
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: await readFile(path),
    ContentType: types[extname(key)] ?? "application/octet-stream",
    CacheControl: key.startsWith("_astro/") ? "public, max-age=31536000, immutable" : "no-cache",
  }));
  uploaded.add(key);
}

const stale = [];
let token;
do {
  const page = await s3.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }));
  for (const object of page.Contents ?? []) if (!uploaded.has(object.Key)) stale.push({ Key: object.Key });
  token = page.NextContinuationToken;
} while (token);
if (stale.length) await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: stale } }));
console.log(`Uploaded ${uploaded.size} files to ${bucket}, removed ${stale.length}`);
