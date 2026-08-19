"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./accessibility-menu.module.css";

type Locale = "he" | "en";

type Preferences = {
  largeText: boolean;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
};

const STORAGE_KEY = "nisan-sinai-accessibility";

const DEFAULT_PREFERENCES: Preferences = {
  largeText: false,
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
};

const ATTRIBUTE_BY_PREFERENCE: Record<keyof Preferences, string> = {
  largeText: "data-a11y-large-text",
  highContrast: "data-a11y-high-contrast",
  underlineLinks: "data-a11y-underline-links",
  reduceMotion: "data-a11y-reduce-motion",
};

const COPY = {
  he: {
    open: "פתיחת תפריט נגישות",
    close: "סגירת תפריט נגישות",
    title: "כלי נגישות",
    largeText: "הגדלת טקסט",
    highContrast: "ניגודיות גבוהה",
    underlineLinks: "הדגשת קישורים",
    reduceMotion: "הפחתת תנועה",
    reset: "איפוס הגדרות",
    statement: "הצהרת נגישות",
    saved: "ההעדפות נשמרות בדפדפן במכשיר הזה.",
  },
  en: {
    open: "Open accessibility menu",
    close: "Close accessibility menu",
    title: "Accessibility tools",
    largeText: "Larger text",
    highContrast: "High contrast",
    underlineLinks: "Underline links",
    reduceMotion: "Reduce motion",
    reset: "Reset settings",
    statement: "Accessibility statement",
    saved: "Preferences are saved in this browser on this device.",
  },
} as const;

function isPreferences(value: unknown): value is Preferences {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (Object.keys(DEFAULT_PREFERENCES) as Array<keyof Preferences>).every(
    (key) => typeof candidate[key] === "boolean",
  );
}

function readPreferences(): Preferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const parsed: unknown = JSON.parse(stored);
    return isPreferences(parsed) ? parsed : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function applyPreferences(preferences: Preferences) {
  const root = document.documentElement;

  for (const key of Object.keys(preferences) as Array<keyof Preferences>) {
    const attribute = ATTRIBUTE_BY_PREFERENCE[key];
    if (preferences[key]) {
      root.setAttribute(attribute, "true");
    } else {
      root.removeAttribute(attribute);
    }
  }
}

function savePreferences(preferences: Preferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // The controls still work for the current page when storage is unavailable.
  }
}

export function AccessibilityMenu({ locale }: Readonly<{ locale: Locale }>) {
  const t = COPY[locale];
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const widgetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = readPreferences();
    setPreferences(stored);
    applyPreferences(stored);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !widgetRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const updatePreference = (key: keyof Preferences) => {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] };
      applyPreferences(next);
      savePreferences(next);
      return next;
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    applyPreferences(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
  };

  const statementHref = locale === "he" ? "/accessibility" : "/en/accessibility";
  const hasActivePreference = Object.values(preferences).some(Boolean);

  const options: Array<{ key: keyof Preferences; label: string }> = [
    { key: "largeText", label: t.largeText },
    { key: "highContrast", label: t.highContrast },
    { key: "underlineLinks", label: t.underlineLinks },
    { key: "reduceMotion", label: t.reduceMotion },
  ];

  return (
    <div className={styles.widget} ref={widgetRef}>
      {open ? (
        <section
          className={styles.panel}
          id="accessibility-tools"
          role="dialog"
          aria-labelledby="accessibility-tools-title"
        >
          <div className={styles.panelHeader}>
            <h2 id="accessibility-tools-title">{t.title}</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={t.close}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className={styles.options}>
            {options.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={styles.optionButton}
                aria-pressed={preferences[key]}
                onClick={() => updatePreference(key)}
              >
                <span>{label}</span>
                <span className={styles.optionState} aria-hidden="true">
                  {preferences[key] ? "✓" : "+"}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.resetButton}
            onClick={resetPreferences}
            disabled={!hasActivePreference}
          >
            {t.reset}
          </button>

          <a className={styles.statementLink} href={statementHref}>
            {t.statement}
          </a>
          <p className={styles.savedNote}>{t.saved}</p>
        </section>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls="accessibility-tools"
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">♿</span>
      </button>
    </div>
  );
}
