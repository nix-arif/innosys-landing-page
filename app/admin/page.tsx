import { AdminBoard } from "@/components/admin/AdminBoard";
import { isDatabaseConfigured } from "@/lib/db";
import { getAllSections } from "@/lib/content";

export default async function AdminPage() {
  const sections = await getAllSections();
  const dbConfigured = isDatabaseConfigured();

  return <AdminBoard initialSections={sections} dbConfigured={dbConfigured} />;
}
