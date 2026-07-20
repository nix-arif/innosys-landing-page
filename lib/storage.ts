import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Uploaded images are stored in Cloudflare R2 (S3-compatible), not on local
 * disk. Serverless hosts (Vercel, Lambda, etc.) run the app from a read-only
 * filesystem, so writing to public/uploads works in local dev but fails in
 * production with ENOENT on mkdir.
 */

function getConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/$/, "") };
}

export function isStorageConfigured(): boolean {
  return getConfig() !== null;
}

let client: S3Client | null = null;
let clientAccountId: string | null = null;

function getClient(accountId: string, accessKeyId: string, secretAccessKey: string): S3Client {
  if (!client || clientAccountId !== accountId) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    clientAccountId = accountId;
  }
  return client;
}

export async function uploadToStorage(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const config = getConfig();
  if (!config) {
    throw new Error(
      "Image storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in .env.local."
    );
  }
  const s3 = getClient(config.accountId, config.accessKeyId, config.secretAccessKey);
  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return `${config.publicUrl}/${key}`;
}

/** Best-effort delete; silently no-ops if storage isn't configured or the URL isn't ours. */
export async function deleteFromStorage(url: string): Promise<void> {
  const config = getConfig();
  if (!config || !url.startsWith(config.publicUrl)) return;
  const key = url.slice(config.publicUrl.length + 1);
  const s3 = getClient(config.accountId, config.accessKeyId, config.secretAccessKey);
  await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key })).catch(() => {});
}
