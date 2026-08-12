/**
 * Policy copy carries an {email} token so the address stays a real link in
 * every language. Splitting is kept out of the component so it can be tested
 * as a pure function rather than through a rendered tree.
 */
export type TextSegment = { type: "text"; value: string } | { type: "email" };

export function splitOnEmailToken(body: string): TextSegment[] {
  const parts = body.split("{email}");
  const segments: TextSegment[] = [];

  parts.forEach((part, index) => {
    if (part !== "") segments.push({ type: "text", value: part });
    if (index < parts.length - 1) segments.push({ type: "email" });
  });

  return segments;
}

/**
 * A Latin word sitting inside Hebrew copy is announced with Hebrew phonetics
 * unless the run is marked with its own language (WCAG 3.1.2, Language of
 * Parts). Runs are joined across single spaces so "LD Event Design" is one
 * phrase rather than three, and a trailing separator is handed back to the
 * sentence around it so the marked run ends on a real character.
 */
export type LanguageRun = { type: "latin" | "plain"; value: string };

const LATIN_RUN = /[A-Za-z][A-Za-z0-9'’&+./·-]*(?:[  ][A-Za-z0-9][A-Za-z0-9'’&+./·-]*)*/g;
const TRAILING_SEPARATOR = /[^A-Za-z0-9)]+$/;

export function splitLatinRuns(text: string): LanguageRun[] {
  const runs: LanguageRun[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LATIN_RUN)) {
    // The run opens on a letter, so trimming the tail can never empty it.
    const value = match[0].replace(TRAILING_SEPARATOR, "");

    if (match.index > cursor) {
      runs.push({ type: "plain", value: text.slice(cursor, match.index) });
    }
    runs.push({ type: "latin", value });
    cursor = match.index + value.length;
  }

  if (cursor < text.length) runs.push({ type: "plain", value: text.slice(cursor) });

  return runs;
}
