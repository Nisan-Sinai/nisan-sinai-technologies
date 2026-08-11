"use client";

import { FormEvent, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { contact } from "@/lib/content";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  copy,
  arrow,
  privacyHref,
}: {
  copy: SiteContent["form"];
  arrow: string;
  privacyHref: string;
}) {
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
          <span>{copy.name}</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder={copy.namePlaceholder} />
        </label>
        <label>
          <span>{copy.business}</span>
          <input name="business_name" autoComplete="organization" maxLength={100} placeholder={copy.businessPlaceholder} />
        </label>
      </div>

      <div className="form-row">
        <label>
          <span>{copy.phone}</span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={7} maxLength={24} placeholder={copy.phonePlaceholder} />
        </label>
        <label>
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" maxLength={160} placeholder={copy.emailPlaceholder} />
        </label>
      </div>

      <label>
        <span>{copy.service}</span>
        <select name="service" defaultValue="">
          <option value="" disabled>
            {copy.servicePlaceholder}
          </option>
          {copy.serviceOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>{copy.message}</span>
        <textarea name="message" required minLength={10} maxLength={1500} rows={4} placeholder={copy.messagePlaceholder} />
      </label>

      <label className="honeypot" aria-hidden="true">
        {copy.honeypot}
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="consent-field">
        <input name="consent" type="checkbox" required value="accepted" />
        <span>
          {copy.consentBefore}
          <a href={privacyHref}>{copy.consentLink}</a>
          {copy.consentAfter}
        </span>
      </label>

      <button className="button button-primary submit-button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? copy.submitting : copy.submit}
        <span aria-hidden="true">{arrow}</span>
      </button>

      <div className={`form-message form-message-${status}`} role="status" aria-live="polite">
        {status === "success" && copy.success}
        {status === "error" && (
          <>
            {copy.errorBefore}
            <a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a>
            {copy.errorAfter}
          </>
        )}
      </div>
    </form>
  );
}
