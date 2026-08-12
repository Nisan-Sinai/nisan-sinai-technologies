import { Fragment } from "react";
import { splitLatinRuns } from "@/lib/rich-text";

/**
 * Marks the Latin runs inside a string so a screen reader switches voice for
 * them. On the English page the attribute repeats the document language and
 * costs nothing, so callers never have to ask which locale they are in.
 */
export default function LatinText({ text }: { text: string }) {
  return (
    <>
      {splitLatinRuns(text).map((run, index) =>
        run.type === "latin" ? (
          <span lang="en" key={index}>
            {run.value}
          </span>
        ) : (
          <Fragment key={index}>{run.value}</Fragment>
        ),
      )}
    </>
  );
}
