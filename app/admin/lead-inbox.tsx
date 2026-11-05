import { useState } from "react";
import Link from "next/link";
import { getContent } from "@/lib/content";

export type Lead = {
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

const services = new Map(getContent("he").form.serviceOptions.map(({ value, label }) => [value, label]));
const statuses = new Map([
  ["new", "חדש"],
  ["contacted", "נוצר קשר"],
  ["qualified", "מתאים"],
  ["closed", "סגור"],
]);
const leadDate = new Intl.DateTimeFormat("he-IL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jerusalem",
});

const icons = {
  inbox: "M4 4h16l2 10v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5L4 4Zm-2 10h6l2 3h4l2-3h6",
  refresh: "M20 7v5h-5M4 17v-5h5m11 0a8 8 0 0 0-14-5m-2 5a8 8 0 0 0 14 5",
  search: "m20 20-4-4m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  phone: "M6 3h4l2 5-3 2a14 14 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2C10 20 4 14 4 5a2 2 0 0 1 2-2Z",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
};

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name]} />
    </svg>
  );
}

function serviceLabel(service: string) {
  return services.get(service) ?? service;
}

export default function LeadInbox({
  leads,
  loading,
  message,
  error,
  onRefresh,
  onSignOut,
}: {
  leads: Lead[];
  loading: boolean;
  message: string;
  error: string;
  onRefresh: () => void;
  onSignOut: () => void;
}) {
  const [query, setQuery] = useState("");
  const [newOnly, setNewOnly] = useState(false);
  const term = query.trim().toLocaleLowerCase("he");
  const newCount = leads.filter((lead) => lead.status === "new").length;
  const visibleLeads = leads.filter((lead) => {
    if (newOnly && lead.status !== "new") return false;
    if (!term) return true;
    const fields = [
      lead.name, lead.business_name, lead.phone, lead.email, lead.message,
      lead.service && serviceLabel(lead.service),
    ];
    return fields.some((value) => value?.toLocaleLowerCase("he").includes(term));
  });

  return (
    <main className="admin-shell admin-inbox-shell">
      <div className="admin-inbox">
        <header className="admin-inbox-header">
          <div className="admin-inbox-brand">
            <span className="admin-inbox-mark"><Icon name="inbox" /></span>
            <Link href="/">ניסן סיני טכנולוגיות</Link>
          </div>
          <button className="admin-inbox-button admin-inbox-logout" type="button" onClick={onSignOut} disabled={loading}>
            יציאה
          </button>
        </header>

        <section className="admin-inbox-overview" aria-labelledby="admin-title">
          <div className="admin-inbox-heading">
            <div>
              <span className="admin-inbox-kicker">אזור ניהול</span>
              <h1 id="admin-title">פניות מהאתר</h1>
            </div>
            <button className="admin-inbox-button" type="button" onClick={onRefresh} disabled={loading}>
              <Icon name="refresh" /> {loading ? "מרענן…" : "רענון"}
            </button>
          </div>
          <dl className="admin-inbox-stats">
            <div>
              <dt>סה״כ פניות</dt>
              <dd>{leads.length}</dd>
            </div>
            <div>
              <dt>פניות חדשות</dt>
              <dd>{newCount}</dd>
            </div>
          </dl>
        </section>

        {message && <p className="admin-notice admin-notice-success" role="status">{message}</p>}
        {error && <p className="admin-notice admin-notice-error" role="alert">{error}</p>}

        <section className="admin-inbox-list" aria-labelledby="admin-leads-title" aria-busy={loading}>
          <div className="admin-inbox-list-heading">
            <h2 id="admin-leads-title">תיבת פניות</h2>
            <span role="status">מוצגות {visibleLeads.length} מתוך {leads.length}</span>
          </div>

          <div className="admin-inbox-toolbar">
            <label className="admin-inbox-search">
              <Icon name="search" />
              <span className="visually-hidden">חיפוש פניות</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לפי שם, טלפון או תוכן…" />
            </label>
            <div className="admin-inbox-filters" role="group" aria-label="סינון פניות">
              <button className="admin-inbox-button" type="button" aria-pressed={!newOnly} onClick={() => setNewOnly(false)}>הכול</button>
              <button className="admin-inbox-button" type="button" aria-pressed={newOnly} onClick={() => setNewOnly(true)}>חדשות בלבד</button>
            </div>
          </div>

          {visibleLeads.length ? (
            <div className="admin-inbox-cards">
              {visibleLeads.map((lead) => (
                <article className="admin-lead-card" key={lead.id} data-status={lead.status}>
                  <div className="admin-inbox-card-meta">
                    <span className="admin-inbox-status">{statuses.get(lead.status) ?? lead.status}</span>
                    <time dateTime={lead.created_at}>{leadDate.format(new Date(lead.created_at))}</time>
                  </div>
                  <h3><bdi>{lead.name}</bdi></h3>
                  {(lead.business_name || lead.service) && (
                    <div className="admin-inbox-tags">
                      {lead.business_name && <bdi>{lead.business_name}</bdi>}
                      {lead.service && <span>{serviceLabel(lead.service)}</span>}
                    </div>
                  )}
                  <p className="admin-inbox-message" dir="auto">{lead.message}</p>
                  <div className="admin-inbox-contacts">
                    <a className="admin-inbox-button" href={`tel:${lead.phone}`} aria-label={`חיוג אל ${lead.name} (${lead.phone})`}>
                      <Icon name="phone" /> <bdi dir="ltr">{lead.phone}</bdi>
                    </a>
                    {lead.email && (
                      <a className="admin-inbox-button" href={`mailto:${lead.email}`} aria-label={`אימייל אל ${lead.name} (${lead.email})`}>
                        <Icon name="mail" /> <bdi dir="ltr">{lead.email}</bdi>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-inbox-empty">
              <Icon name="inbox" />
              <p>{leads.length ? "אין פניות שתואמות לחיפוש או לסינון." : "עדיין אין פניות מהאתר."}</p>
              {leads.length > 0 && (
                <button className="admin-inbox-button" type="button" onClick={() => { setQuery(""); setNewOnly(false); }}>
                  ניקוי חיפוש וסינון
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
