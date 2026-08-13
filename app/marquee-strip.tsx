import LatinText from "./latin-text";

type MarqueeStripProps = {
  className: string;
  ariaLabel: string;
  lead: string;
  items: readonly string[];
  id?: string;
  leadIsLatin?: boolean;
};

/**
 * How many times the run of words is repeated along the track.
 *
 * The loop works by sliding the track left by exactly one copy and starting
 * over, so the strip only stays full if the track is at least one copy wider
 * than the screen. Two copies is enough while a copy is wider than the
 * viewport, which stops being true on a desktop: there the strip ran dry at
 * the end of every pass. Four keeps it covered down to a copy a third of the
 * screen wide.
 *
 * The keyframes shift by -100%/4. Change this and change them together.
 */
const COPIES = 4;

export default function MarqueeStrip({
  className,
  ariaLabel,
  lead,
  items,
  id,
  leadIsLatin = false,
}: MarqueeStripProps) {
  // Only the first copy is read out; the rest exist to fill the track.
  const group = (index: number) => (
    <div
      className="marquee-group"
      aria-hidden={index > 0 ? true : undefined}
      key={index}
    >
      <span>{leadIsLatin ? <LatinText text={lead} /> : lead}</span>
      {items.map((item, position) => (
        <span className="marquee-item" key={`${index}-${item}`}>
          {position > 0 && <i aria-hidden="true" />}
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
        {Array.from({ length: COPIES }, (_, index) => group(index))}
      </div>
    </section>
  );
}
