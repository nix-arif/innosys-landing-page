import { MediaLibraryPage } from "@/components/admin/media/MediaLibraryPage";
import { isDatabaseConfigured } from "@/lib/db";
import { getMediaLibrary } from "@/lib/media";

export default async function AdminMediaPage() {
  const [assets, dbConfigured] = await Promise.all([
    getMediaLibrary(),
    Promise.resolve(isDatabaseConfigured()),
  ]);

  return <MediaLibraryPage initialAssets={assets} dbConfigured={dbConfigured} />;
}
