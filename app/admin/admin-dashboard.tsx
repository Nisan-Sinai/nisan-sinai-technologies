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

type AuthSettings = {
  external?: Record<string, boolean | undefined>;
};

type AuthMode = "login" | "reset";
type BusyAction = "password" | "google" | "recovery" | "magic" | "update-password" | null;

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
  const [session, setSession] = useState<Session | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(configured);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(
    configured ? "" : "שירות הניהול אינו מוגדר כרגע.",
  );
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);

  function authHeaders(accessToken?: string) {
    return {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken ?? publishableKey}`,
    };
  }

  async function fetchUser(accessToken: string) {
    return fetch(new URL("/auth/v1/user", supabaseUrl), {
      headers: authHeaders(accessToken),
      cache: "no-store",
    });
  }

  async function verifyAdminSession(current: Session) {
    const response = await fetchUser(current.access_token);
    if (!response.ok) throw new Error("invalid_session");

    const user = (await response.json()) as { email?: string };
    if (user.email?.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      throw new Error("not_admin");
    }
  }

  async function refreshSession(current: Session): Promise<Session | null> {
    if (!current.refresh_token) return null;

    const endpoint = new URL("/auth/v1/token", supabaseUrl);
    endpoint.searchParams.set("grant_type", "refresh_token");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...authHeaders(),
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
      if (user.email?.trim().toLowerCase() !== adminEmail.toLowerCase()) {
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
          ...authHeaders(activeSession.access_token),
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("leads_failed");
      const rows = (await response.json()) as Lead[];

      setSession(activeSession);
      setLeads(rows);
      setAuthMode("login");
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

    async function loadSettings() {
      try {
        const response = await fetch(new URL("/auth/v1/settings", supabaseUrl), {
          headers: { apikey: publishableKey },
          cache: "no-store",
        });
        if (!response.ok || cancelled) return;
        const settings = (await response.json()) as AuthSettings;
        if (!cancelled) setGoogleEnabled(Boolean(settings.external?.google));
      } catch {
        if (!cancelled) setGoogleEnabled(null);
      }
    }

    async function hydrate() {
      await Promise.resolve();
      if (cancelled) return;

      const hash = new URLSearchParams(window.location.hash.slice(1));
      const authError = hash.get("error_description");

      if (authError) {
        window.history.replaceState({}, document.title, "/admin");
        setError("ההתחברות נכשלה או שפג תוקף הקישור. אפשר לנסות שוב.");
        setLoading(false);
        return;
      }

      const accessToken = hash.get("access_token");
      if (accessToken) {
        const incoming: Session = {
          access_token: accessToken,
          refresh_token: hash.get("refresh_token") ?? undefined,
        };

        const recovery = hash.get("type") === "recovery";
        window.history.replaceState({}, document.title, "/admin");

        if (recovery) {
          try {
            await verifyAdminSession(incoming);
            setSession(incoming);
            setAuthMode("reset");
            setMessage("הקישור אומת. עכשיו אפשר לבחור סיסמה חדשה.");
            localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
          } catch {
            setError("קישור איפוס הסיסמה אינו מורשה למנהל הזה.");
            setSession(null);
          } finally {
            setLoading(false);
          }
          return;
        }

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

    void loadSettings();
    void hydrate();

    return () => {
      cancelled = true;
    };
    // Credentials are fixed for this page instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  async function signInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!configured) {
      setError("שירות הניהול אינו מוגדר כרגע.");
      return;
    }

    if (!password) {
      setError("יש להזין סיסמה.");
      return;
    }

    setBusy("password");

    try {
      const endpoint = new URL("/auth/v1/token", supabaseUrl);
      endpoint.searchParams.set("grant_type", "password");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail, password }),
        cache: "no-store",
      });

      if (!response.ok) throw new Error("password_failed");
      const incoming = (await response.json()) as Session;
      setPassword("");
      await loadLeads(incoming);
    } catch {
      setError("המייל או הסיסמה אינם נכונים. אפשר לאפס סיסמה או להשתמש בקישור כניסה מאובטח.");
    } finally {
      setBusy(null);
    }
  }

  function signInWithGoogle() {
    setError("");
    setMessage("");

    if (!configured) {
      setError("שירות הניהול אינו מוגדר כרגע.");
      return;
    }

    if (googleEnabled === false) {
      setError("כניסה עם Google מוכנה באתר, אבל ספק Google עדיין לא הופעל בפרויקט Supabase.");
      return;
    }

    setBusy("google");
    const endpoint = new URL("/auth/v1/authorize", supabaseUrl);
    endpoint.searchParams.set("provider", "google");
    endpoint.searchParams.set("redirect_to", `${window.location.origin}/admin`);
    window.location.assign(endpoint.toString());
  }

  async function requestRecovery() {
    setError("");
    setMessage("");

    if (!configured) {
      setError("שירות הניהול אינו מוגדר כרגע.");
      return;
    }

    setBusy("recovery");

    try {
      const endpoint = new URL("/auth/v1/recover", supabaseUrl);
      endpoint.searchParams.set("redirect_to", `${window.location.origin}/admin`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail }),
      });

      if (!response.ok) throw new Error("recovery_failed");
      setMessage("אם חשבון המנהל קיים, נשלח למייל קישור מאובטח לבחירת סיסמה חדשה.");
    } catch {
      setError("לא הצלחתי לשלוח קישור לאיפוס סיסמה כרגע. נסה שוב.");
    } finally {
      setBusy(null);
    }
  }

  async function requestMagicLink() {
    setError("");
    setMessage("");

    if (!configured) {
      setError("שירות הניהול אינו מוגדר כרגע.");
      return;
    }

    setBusy("magic");

    try {
      const endpoint = new URL("/auth/v1/otp", supabaseUrl);
      endpoint.searchParams.set("redirect_to", `${window.location.origin}/admin`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail, create_user: true }),
      });

      if (!response.ok) throw new Error("otp_failed");
      setMessage("נשלח אליך קישור כניסה מאובטח. זה מתאים גם לכניסה הראשונה לניהול.");
    } catch {
      setError("לא הצלחתי לשלוח קישור כניסה כרגע. נסה שוב.");
    } finally {
      setBusy(null);
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!session) {
      setError("קישור האיפוס פג. יש לבקש קישור חדש.");
      return;
    }

    if (newPassword.length < 10) {
      setError("הסיסמה החדשה צריכה להכיל לפחות 10 תווים.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("הסיסמאות אינן זהות.");
      return;
    }

    setBusy("update-password");

    try {
      await verifyAdminSession(session);

      const response = await fetch(new URL("/auth/v1/user", supabaseUrl), {
        method: "PUT",
        headers: {
          ...authHeaders(session.access_token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
        cache: "no-store",
      });

      if (!response.ok) throw new Error("password_update_failed");

      setNewPassword("");
      setConfirmPassword("");
      setMessage("הסיסמה עודכנה בהצלחה.");
      await loadLeads(session);
    } catch {
      setError("לא הצלחתי לעדכן את הסיסמה. בקש קישור איפוס חדש ונסה שוב.");
    } finally {
      setBusy(null);
    }
  }

  async function signOut() {
    const accessToken = session?.access_token;
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setLeads([]);
    setPassword("");
    setMessage("");
    setError("");
    setAuthMode("login");

    if (!accessToken || !configured) return;

    await fetch(new URL("/auth/v1/logout", supabaseUrl), {
      method: "POST",
      headers: authHeaders(accessToken),
    }).catch(() => undefined);
  }

  const stats = useMemo(
    () => ({
      total: leads.length,
      newCount: leads.filter((lead) => lead.status === "new").length,
    }),
    [leads],
  );

  if (authMode === "reset" && session) {
    return (
      <main className="admin-shell">
        <section className="admin-login-card" aria-labelledby="admin-reset-title">
          <Link className="admin-back-link" href="/">
            ← חזרה לאתר
          </Link>
          <span className="section-kicker">ADMIN SECURITY</span>
          <h1 id="admin-reset-title">בחירת סיסמה חדשה</h1>
          <p>הקישור מאומת עבור {adminEmail}. בחר סיסמה חדשה וחזקה.</p>

          <form onSubmit={updatePassword} className="admin-login-form">
            <label>
              <span>סיסמה חדשה</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                required
              />
            </label>
            <label>
              <span>אימות סיסמה</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                required
              />
            </label>
            <button className="button button-primary" type="submit" disabled={busy !== null}>
              {busy === "update-password" ? "מעדכן..." : "שמירת סיסמה חדשה"}
            </button>
          </form>

          {message && <p className="admin-notice admin-notice-success">{message}</p>}
          {error && <p className="admin-notice admin-notice-error">{error}</p>}
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-shell">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <Link className="admin-back-link" href="/">
            ← חזרה לאתר
          </Link>
          <span className="section-kicker">ADMIN</span>
          <h1 id="admin-login-title">כניסה לניהול</h1>
          <p>הדשבורד מציג את הפניות מהאתר. הכניסה מורשית רק לחשבון המנהל שלך.</p>

          <form onSubmit={signInWithPassword} className="admin-login-form">
            <label>
              <span>אימייל מנהל</span>
              <input type="email" value={adminEmail} readOnly aria-readonly="true" autoComplete="username" />
            </label>
            <label>
              <span>סיסמה</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button className="button button-primary" type="submit" disabled={busy !== null || !configured}>
              {busy === "password" ? "מתחבר..." : "כניסה עם סיסמה"}
            </button>
          </form>

          <div className="admin-auth-divider" aria-hidden="true">
            <span>או</span>
          </div>

          <button
            className="admin-google-button"
            type="button"
            onClick={signInWithGoogle}
            disabled={busy !== null || !configured}
          >
            <span className="admin-google-mark" aria-hidden="true">G</span>
            <span>{busy === "google" ? "מעביר ל-Google..." : "התחברות עם Google"}</span>
          </button>

          <div className="admin-login-options">
            <button type="button" onClick={() => void requestRecovery()} disabled={busy !== null || !configured}>
              {busy === "recovery" ? "שולח..." : "איפוס סיסמה"}
            </button>
            <button type="button" onClick={() => void requestMagicLink()} disabled={busy !== null || !configured}>
              {busy === "magic" ? "שולח..." : "כניסה ראשונה / קישור למייל"}
            </button>
          </div>

          {googleEnabled === false && (
            <p className="admin-provider-note">
              כניסה עם Google דורשת הפעלה חד-פעמית של ספק Google ב-Supabase. שאר אפשרויות הכניסה פעילות ללא תלות בכך.
            </p>
          )}

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
            <h1 id="admin-title">לקוחות ופניות מהאתר</h1>
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
            <button className="button button-secondary" type="button" onClick={() => void signOut()}>
              יציאה
            </button>
          </div>
        </header>

        <section className="admin-stats" aria-label="סיכום פניות">
          <article>
            <span>סה״כ לקוחות שהתעניינו</span>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <span>פניות חדשות</span>
            <strong>{stats.newCount}</strong>
          </article>
        </section>

        {message && <p className="admin-notice admin-notice-success">{message}</p>}
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
