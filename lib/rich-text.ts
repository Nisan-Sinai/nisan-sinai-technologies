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
