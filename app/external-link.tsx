/**
 * A link that leaves the site says so before it is followed. Sighted users
 * have the arrow; the hint carries the same information to a screen reader, so
 * nobody lands in a new tab without warning (WCAG 3.2.5).
 */
export default function ExternalLink({
  href,
  hint,
  className,
  children,
}: {
  href: string;
  hint: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="visually-hidden"> {hint}</span>
    </a>
  );
}
