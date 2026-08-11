"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      onChange={() => status !== "idle" && setStatus("idle")}
      aria-busy={status === "submitting"}
    >
      <div className="form-row">
        <label>
          <span>שם מלא *</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="איך לפנות אליך?" />
        </label>
        <label>
          <span>שם העסק</span>
          <input name="business_name" autoComplete="organization" maxLength={100} placeholder="שם העסק שלך" />
        </label>
      </div>

      <div className="form-row">
        <label>
          <span>טלפון *</span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={7} maxLength={24} placeholder="050-0000000" />
        </label>
        <label>
          <span>אימייל</span>
          <input name="email" type="email" autoComplete="email" maxLength={160} placeholder="name@business.co.il" />
        </label>
      </div>

      <label>
        <span>מה תרצו לבנות?</span>
        <select name="service" defaultValue="">
          <option value="" disabled>בחרו סוג פרויקט</option>
          <option value="website">אתר או חנות</option>
          <option value="crm">מערכת CRM</option>
          <option value="erp">מערכת ERP או ניהול</option>
          <option value="automation">אוטומציה או אינטגרציה</option>
          <option value="custom">מערכת בהתאמה אישית</option>
          <option value="other">משהו אחר</option>
        </select>
      </label>

      <label>
        <span>כמה מילים על הפרויקט *</span>
        <textarea name="message" required minLength={10} maxLength={1500} rows={4} placeholder="מה האתגר, למי המערכת מיועדת ומה חשוב לכם להשיג?" />
      </label>

      <label className="honeypot" aria-hidden="true">
        אתר
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="consent-field">
        <input name="consent" type="checkbox" required value="accepted" />
        <span>אני מאשר/ת שימוש בפרטים לצורך חזרה אליי בהתאם ל<a href="/privacy">מדיניות הפרטיות</a>.</span>
      </label>

      <button className="button button-primary submit-button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "שולח..." : "שליחת הפרטים"}
        <span aria-hidden="true">←</span>
      </button>

      <div className={`form-message form-message-${status}`} role="status" aria-live="polite">
        {status === "success" && "תודה! הפרטים התקבלו ואחזור אליך בהקדם."}
        {status === "error" && (
          <>
            השליחה לא הצליחה כרגע. אפשר לפנות אליי ישירות ב־
            <a href="tel:+972587170978">058-7170978</a>.
          </>
        )}
      </div>
    </form>
  );
}
