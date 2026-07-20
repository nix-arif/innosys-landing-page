"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { uploadToStorage, deleteFromStorage } from "@/lib/storage";
import {
  createCanvasSection,
  deleteSection,
  reorderSections,
  setSectionVisibility,
  updateSectionContent,
  type Section,
  type SectionContent,
} from "@/lib/content";
import { addMediaAsset, deleteMediaAsset, getMediaLibrary, type MediaAsset } from "@/lib/media";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    throw new Error("Unauthorized");
  }
}

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/media");
}

export async function saveSectionContentAction(
  id: string,
  content: SectionContent
): Promise<void> {
  await requireAdmin();
  await updateSectionContent(id, content);
  refreshPages();
}

export async function reorderSectionsAction(orderedIds: string[]): Promise<void> {
  await requireAdmin();
  await reorderSections(orderedIds);
  refreshPages();
}

export async function setSectionVisibilityAction(
  id: string,
  visible: boolean
): Promise<void> {
  await requireAdmin();
  await setSectionVisibility(id, visible);
  refreshPages();
}

export async function addCanvasSectionAction(): Promise<Section> {
  await requireAdmin();
  const section = await createCanvasSection();
  refreshPages();
  return section;
}

export async function removeSectionAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteSection(id);
  refreshPages();
}

export async function uploadImageAction(formData: FormData): Promise<string> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file provided.");
  }
  const extension = ALLOWED_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Only PNG, JPEG, WebP, GIF, or SVG images are allowed.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large (max 5MB).");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${randomUUID()}${extension}`;
  const url = await uploadToStorage(key, bytes, file.type);

  // Every upload becomes a reusable asset in the media library, regardless of
  // which field it was uploaded from. Best-effort: if the DB isn't
  // configured yet, the file still uploads fine, it just won't show up in
  // the library list.
  if (isDatabaseConfigured()) {
    await addMediaAsset({ url, filename: file.name, size: file.size }).catch(() => {});
  }

  return url;
}

export async function listMediaAction(): Promise<MediaAsset[]> {
  await requireAdmin();
  return getMediaLibrary();
}

export async function deleteMediaAssetAction(id: string): Promise<void> {
  await requireAdmin();
  const url = await deleteMediaAsset(id);
  if (url) {
    await deleteFromStorage(url);
  }
  revalidatePath("/admin/media");
}
