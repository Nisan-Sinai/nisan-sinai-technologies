"use client";

import Link from "next/link";
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

type Session = {
  access_token: string;
  refresh_token?: string;
};

const STORAGE_KEY = "nisan-admin-session";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDashboard({
  adminEmail,
  supabaseUrl,
  publishableKey,
}: {
  adminEmail: string;
  supabaseUrl: string;
  publishableKey: string;
}) {
  const configured = Boolean(supabaseUrl && publishableKey);
  const [email, setEmail] = useState(adminEmail);
  const [session, setSession] = useState<Session | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(configured);
  const [sendingLink, setSendingLink] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(
    configured ? "" : "שירות הניהול אינו מוגדר כרגע.",
  );

  async function fetchUser(accessToken: string) {
    return fetch(new URL("/auth/v1/user", supabaseUrl), {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  }

  async function refreshSession(current: Session): Promise<Session | null> {
    if (!current.refresh_token) return null;

    const endpoint = new URL("/auth/v1/token", supabaseUrl);
    endpoint.searchParams.set("grant_type", "refresh_token");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: current.refresh_token }),
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as Session;
  }

  async function loadLeads(current: Session) {
    setLoading(true);
    setError("");

    try {
      let activeSession = current;
      let userResponse = await fetchUser(activeSession.access_token);

      if (userResponse.status === 401) {
        const refreshed = await refreshSession(activeSession);
        if (!refreshed) throw new Error("session_expired");
        activeSession = refreshed;
        userResponse = await fetchUser(activeSession.access_token);
      }

      if (!userResponse.ok) throw new Error("invalid_session");
      const user = (await userResponse.json()) as { email?: string };
      if (user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
        throw new Error("not_admin");
      }

      const endpoint = new URL("/rest/v1/contact_leads", supabaseUrl);
      endpoint.searchParams.set(
        "select",
        "id,name,business_name,phone,email,service,message,status,created_at",
      );
      endpoint.searchParams.set("order", "created_at.desc");

      const response = await fetch(endpoint, {
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${activeSession.access_token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("leads_failed");
      const rows = (await response.json()) as Lead[];

      setSession(activeSession);
      setLeads(rows);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setLeads([]);
      setError("החיבור לניהול פג או שאינו מורשה. יש להתחבר מחדש עם מייל המנהל.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!configured) return;

    let cancelled = false;

    async function hydrate() {
      await Promise.resolve();
      if (cancelled) return;

      const hash = new URLSearchParams(window.location.hash.slice(1));
      const authError = hash.get("error_description");

      if (authError) {
        window.history.replaceState({}, document.title, "/admin");
        setError("קישור הכניסה אינו תקין או שפג תוקפו. אפשר לשלוח קישור חדש.");
        setLoading(false);
        return;
      }

      const accessToken = hash.get("access_token");
      if (accessToken) {
        const incoming: Session = {
          access_token: accessToken,
          refresh_token: hash.get("refresh_token") ?? undefined,
        };
        window.history.replaceState({}, document.title, "/admin");
        await loadLeads(incoming);
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        await loadLeads(JSON.parse(stored) as Session);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
    // Credentials are fixed for this page instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  async function requestLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      setError("המייל הזה אינו מורשה לניהול.");
      return;
    }

    if (!configured) {
      setError("שירות הניהול אינו מוגדר כרגע.");
      return;
    }

    setSendingLink(true);

    try {
      const endpoint = new URL("/auth/v1/otp", supabaseUrl);
      endpoint.searchParams.set("redirect_to", `${window.location.origin}/admin`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail, create_user: true }),
      });

      if (!response.ok) throw new Error("otp_failed");
      setMessage("נשלח אליך קישור כניסה מאובטח למייל. לחץ עליו כדי לפתוח את הדשבורד.");
    } catch {
      setError("לא הצלחתי לשלוח קישור כניסה כרגע. נסה שוב.");
    } finally {
      setSendingLink(false);
    }
  }

  async function signOut() {
    const accessToken = session?.access_token;
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setLeads([]);
    setMessage("");
    setError("");

    if (!accessToken || !configured) return;

    await fetch(new URL("/auth/v1/logout", supabaseUrl), {
      method: "POST",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch(() => undefined);
  }

  const stats = useMemo(
    () => ({
      total: leads.length,
      newCount: leads.filter((lead) => lead.status === "new").length,
    }),
    [leads],
  );

  if (!session) {
    return (
      <main className="admin-shell">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <Link className="admin-back-link" href="/">
            ← חזרה לאתר
          </Link>
          <span className="section-kicker">ADMIN</span>
          <h1 id="admin-login-title">כניסה לניהול</h1>
          <p>הכניסה מאובטחת ומותרת רק למייל המנהל.</p>

          <form onSubmit={requestLogin} className="admin-login-form">
            <label>
              <span>אימייל מנהל</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <button
              className="button button-primary"
              type="submit"
              disabled={sendingLink || !configured}
            >
              {sendingLink ? "שולח קישור..." : "שלח קישור כניסה למייל"}
            </button>
          </form>

          {loading && <p className="admin-notice">בודק התחברות...</p>}
          {message && <p className="admin-notice admin-notice-success">{message}</p>}
          {error && <p className="admin-notice admin-notice-error">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-dashboard-card" aria-labelledby="admin-title">
        <header className="admin-dashboard-header">
          <div>
            <span className="section-kicker">ADMIN</span>
            <h1 id="admin-title">פניות מהאתר</h1>
            <p>{adminEmail}</p>
          </div>
          <div className="admin-header-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => void loadLeads(session)}
              disabled={loading}
            >
              {loading ? "מרענן..." : "רענון"}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => void signOut()}
            >
              יציאה
            </button>
          </div>
        </header>

        <section className="admin-stats" aria-label="סיכום פניות">
          <article>
            <span>סה״כ פניות</span>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <span>פניות חדשות</span>
            <strong>{stats.newCount}</strong>
          </article>
        </section>

        {error && <p className="admin-notice admin-notice-error">{error}</p>}

        <section aria-labelledby="admin-leads-title">
          <div className="admin-section-head">
            <h2 id="admin-leads-title">כל המתעניינים וההודעות</h2>
            <span>{leads.length} רשומות</span>
          </div>

          {leads.length === 0 && !loading ? (
            <div className="admin-empty">עדיין אין פניות להצגה.</div>
          ) : (
            <div className="admin-lead-grid">
              {leads.map((lead) => (
                <article className="admin-lead-card" key={lead.id}>
                  <div className="admin-lead-top">
                    <div>
                      <span className="admin-lead-status">
                        {lead.status === "new" ? "חדש" : lead.status}
                      </span>
                      <h3>{lead.name}</h3>
                      {lead.business_name && <p>{lead.business_name}</p>}
                    </div>
                    <time dateTime={lead.created_at}>{formatDate(lead.created_at)}</time>
                  </div>

                  <dl className="admin-lead-details">
                    <div>
                      <dt>טלפון</dt>
                      <dd>
                        <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                      </dd>
                    </div>
                    {lead.email && (
                      <div>
                        <dt>אימייל</dt>
                        <dd>
                          <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        </dd>
                      </div>
                    )}
                    {lead.service && (
                      <div>
                        <dt>שירות</dt>
                        <dd>{lead.service}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="admin-lead-message">
                    <span>הודעה</span>
                    <p>{lead.message}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
