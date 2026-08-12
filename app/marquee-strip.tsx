import LatinText from "./latin-text";

type MarqueeStripProps = {
  className: string;
  ariaLabel: string;
  lead: string;
  items: readonly string[];
  id?: string;
  leadIsLatin?: boolean;
};

export default function MarqueeStrip({
  className,
  ariaLabel,
  lead,
  items,
  id,
  leadIsLatin = false,
}: MarqueeStripProps) {
  const group = (copy: boolean) => (
    <div className="marquee-group" aria-hidden={copy ? true : undefined}>
      <span>{leadIsLatin ? <LatinText text={lead} /> : lead}</span>
      {items.map((item, index) => (
        <span className="marquee-item" key={`${copy ? "copy" : "main"}-${item}`}>
          {index > 0 && <i aria-hidden="true" />}
          <strong>
            <LatinText text={item} />
          </strong>
        </span>
      ))}
    </div>
  );

  return (
    <section
      className={`${className} marquee-strip`}
      id={id}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div className="marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}
