"use client";

import { useEffect, useState } from "react";
import { listMediaAction } from "@/app/admin/actions";
import type { MediaAsset } from "@/lib/media";

export function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listMediaAction()
      .then((result) => {
        if (!cancelled) setAssets(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load media.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-deep-blue">Choose from media library</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-deep-blue/50 hover:text-coral"
          >
            Close
          </button>
        </div>

        {error && <p className="text-xs text-coral">{error}</p>}
        {!assets && !error && <p className="text-xs text-deep-blue/50">Loading…</p>}
        {assets && assets.length === 0 && (
          <p className="text-xs text-deep-blue/50">
            No uploads yet. Upload an image from any image field first — it&rsquo;ll show
            up here to reuse.
          </p>
        )}
        {assets && assets.length > 0 && (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelect(asset.url)}
                title={asset.filename}
                className="group aspect-square overflow-hidden rounded-lg border border-deep-blue/10 hover:border-sky-blue"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
