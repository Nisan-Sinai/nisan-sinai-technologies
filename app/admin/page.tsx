import AdminDashboard from "./admin-dashboard";

const ADMIN_EMAIL = "nisan.sinai5@gmail.com";

export default function AdminPage() {
  return (
    <AdminDashboard
      adminEmail={ADMIN_EMAIL}
      supabaseUrl={process.env.SUPABASE_URL ?? ""}
      publishableKey={process.env.SUPABASE_PUBLISHABLE_KEY ?? ""}
    />
  );
}
