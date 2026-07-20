"use client";

import { useState } from "react";
import Link from "next/link";
import { uploadImageAction, deleteMediaAssetAction } from "@/app/admin/actions";
import { randomUUID } from "@/components/admin/randomId";
import type { MediaAsset } from "@/lib/media";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryPage({
  initialAssets,
  dbConfigured,
}: {
  initialAssets: MediaAsset[];
  dbConfigured: boolean;
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImageAction(formData);
      setAssets((prev) => [
        {
          id: randomUUID(),
          url,
          filename: file.name,
          size: file.size,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Delete this image? Any section still referencing it will show a broken image."
      )
    ) {
      return;
    }
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    if (dbConfigured) {
      await deleteMediaAssetAction(id);
    }
  }

  return (
    <div className="min-h-screen bg-sky-blue-light/10 p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-xs font-semibold text-sky-blue hover:underline">
          ← Back to sections
        </Link>
        <h1 className="mb-6 mt-1 text-lg font-bold text-deep-blue">Media Library</h1>

        {!dbConfigured && (
          <p className="mb-6 rounded-lg bg-coral/10 p-3 text-xs text-coral">
            DATABASE_URL is not set, so uploads here won&rsquo;t be remembered as a library
            (they still upload to disk and can be used once). Add your Neon connection
            string to persist this list.
          </p>
        )}

        <div
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("media-upload-input")?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              document.getElementById("media-upload-input")?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`mb-8 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging ? "border-sky-blue bg-sky-blue/10" : "border-deep-blue/20 hover:border-sky-blue"
          }`}
        >
          <p className="text-sm font-semibold text-deep-blue">
            {uploading ? "Uploading…" : "Drag & drop images here, or click to upload"}
          </p>
          <p className="text-xs text-deep-blue/50">PNG, JPEG, WebP, GIF, or SVG — up to 5MB</p>
          <input
            id="media-upload-input"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            hidden
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
        {error && <p className="mb-4 text-xs text-coral">{error}</p>}

        {assets.length === 0 ? (
          <p className="text-sm text-deep-blue/50">
            No assets uploaded yet. Anything you upload here — or from an image field
            anywhere in the CMS — shows up in this library, ready to reuse.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative overflow-hidden rounded-xl border border-deep-blue/10 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-deep-blue" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <p className="text-[10px] text-deep-blue/40">{formatSize(asset.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-coral opacity-0 shadow transition-opacity group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
