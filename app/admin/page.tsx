import AdminDashboard from "./admin-dashboard";
import { isPublishableKey } from "@/lib/supabase-key";

export default function AdminPage() {
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

  return (
    <AdminDashboard
      supabaseUrl={process.env.SUPABASE_URL ?? ""}
      // A key that is not a publishable one never reaches the browser. The
      // dashboard treats an empty key as "not configured" and says so, which
      // is the right failure for a misconfiguration that would otherwise leak.
      publishableKey={isPublishableKey(publishableKey) ? publishableKey : ""}
    />
  );
}
