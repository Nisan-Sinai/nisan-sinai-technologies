"use client";

import { useEffect, useId, useRef, useState } from "react";

export type MenuItem = { href: string; label: string };

/**
 * The narrow-screen navigation. The desktop nav carries eight destinations now,
 * which is more than fits across a phone, so below the breakpoint it collapses
 * behind a button.
 *
 * Everything a disclosure owes the reader is here on purpose: the button
 * reports its state through aria-expanded, Escape closes the panel and hands
 * focus back to the button, Tab is kept inside the panel while it is open, a
 * click outside dismisses it, and the page behind it cannot scroll. The panel
 * is not rendered at all while closed, so its links are never focusable from
 * the outside.
 */
export default function MobileMenu({
  label,
  ariaLabel,
  navAria,
  items,
}: {
  label: string;
  ariaLabel: string;
  navAria: string;
  items: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>("a[href]");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panel?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={ariaLabel}
        className="mobile-menu-button"
        onClick={() => setOpen((value) => !value)}
        ref={buttonRef}
        type="button"
      >
        <span className={`menu-bars${open ? " is-open" : ""}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="menu-label">{label}</span>
      </button>

      {open && (
        <div className="mobile-menu-panel" id={panelId} ref={panelRef}>
          <nav aria-label={navAria}>
            {items.map((item) => (
              <a
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
