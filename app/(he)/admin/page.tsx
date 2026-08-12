"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  name: string;
  business_name: string | null;
  phone: string;
  email: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: string;
};

const ADMIN_EMAIL = "nisan.sinai5@gmail.com";

export default function AdminPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);

  async function loadLeads() {
    const response = await fetch("/api/admin/leads", { cache: "no-store" });
    if (!response.ok) {
      setLeads(null);
      return;
    }
    const data = (await response.json()) as { leads: Lead[] };
    setLeads(data.leads);
  }

  useEffect(() => { void loadLeads(); }, []);

  async function requestCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!response.ok) {
      setMessage("לא ניתן לשלוח קוד. ודא שזה מייל המנהל.");
      return;
    }
    setCodeSent(true);
    setMessage("קוד כניסה נשלח למייל שלך.");
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: code }),
    });
    setLoading(false);
    if (!response.ok) {
      setMessage("הקוד שגוי או שפג תוקפו.");
      return;
    }
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLeads(null);
    setCode("");
    setCodeSent(false);
  }

  const stats = useMemo(() => {
    const all = leads ?? [];
    return {
      total: all.length,
      newCount: all.filter((lead) => lead.status === "new").length,
      today: all.filter((lead) => new Date(lead.created_at).toDateString() === new Date().toDateString()).length,
    };
  }, [leads]);

  if (!leads) {
    return (
      <main className="admin-page" dir="rtl">
        <section className="admin-login-card">
          <span className="admin-kicker">ADMIN / SECURE ACCESS</span>
          <h1>כניסה לניהול</h1>
          <p>הכניסה מוגבלת למייל המנהל ומאומתת באמצעות קוד חד-פעמי שנשלח למייל.</p>
          {!codeSent ? (
            <form className="admin-form" onSubmit={requestCode}>
              <label>מייל מנהל<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
              <button className="admin-button" disabled={loading}>שלח קוד כניסה</button>
            </form>
          ) : (
            <form className="admin-form" onSubmit={verifyCode}>
              <label>קוד חד-פעמי<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} required /></label>
              <button className="admin-button" disabled={loading}>כניסה לדשבורד</button>
            </form>
          )}
          <p className={message.includes("שגוי") || message.includes("לא ניתן") ? "admin-message admin-message-error" : "admin-message admin-message-success"}>{message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page" dir="rtl">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div><span className="admin-kicker">LEADS DASHBOARD</span><h1>פניות מהאתר</h1></div>
          <button className="admin-button admin-button-secondary" onClick={logout}>התנתקות</button>
        </div>
        <section className="admin-stats" aria-label="סטטיסטיקות פניות">
          <div className="admin-stat"><span>סה״כ פניות</span><strong>{stats.total}</strong></div>
          <div className="admin-stat"><span>פניות חדשות</span><strong>{stats.newCount}</strong></div>
          <div className="admin-stat"><span>פניות היום</span><strong>{stats.today}</strong></div>
        </section>
        <section className="admin-panel">
          {leads.length === 0 ? <p className="admin-empty" style={{ padding: "2rem" }}>עדיין אין פניות.</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>תאריך</th><th>שם</th><th>עסק</th><th>טלפון</th><th>מייל</th><th>שירות</th><th>הודעה</th><th>סטטוס</th></tr></thead>
                <tbody>{leads.map((lead) => <tr key={lead.id}>
                  <td>{new Date(lead.created_at).toLocaleString("he-IL")}</td>
                  <td>{lead.name}</td><td>{lead.business_name || "—"}</td>
                  <td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                  <td>{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</td>
                  <td>{lead.service || "—"}</td><td className="admin-message-cell">{lead.message}</td><td>{lead.status}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
