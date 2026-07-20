import { isAdminPasswordConfigured } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const passwordConfigured = isAdminPasswordConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-blue px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-xl font-bold text-deep-blue">Smart Innosys Admin</h1>
        <p className="mt-1 text-sm text-deep-blue/60">
          Sign in to edit the landing page.
        </p>

        {!passwordConfigured && (
          <p className="mt-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">
            ADMIN_PASSWORD is not set. Add it to <code>.env.local</code> before
            you can log in.
          </p>
        )}

        <LoginForm next={next ?? "/admin"} disabled={!passwordConfigured} />
      </div>
    </div>
  );
}
