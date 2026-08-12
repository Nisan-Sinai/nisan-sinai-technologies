import AdminDashboard from "./admin-dashboard";

export default function AdminPage() {
  return (
    <AdminDashboard
      supabaseUrl={process.env.SUPABASE_URL ?? ""}
      publishableKey={process.env.SUPABASE_PUBLISHABLE_KEY ?? ""}
    />
  );
}
