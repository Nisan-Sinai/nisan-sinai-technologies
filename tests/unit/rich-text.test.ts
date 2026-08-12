import { describe, expect, it } from "vitest";
import { splitLatinRuns, splitOnEmailToken } from "@/lib/rich-text";

describe("splitOnEmailToken", () => {
  it("returns a single run when there is no token", () => {
    expect(splitOnEmailToken("plain sentence")).toEqual([
      { type: "text", value: "plain sentence" },
    ]);
  });

  it("splits the text around the token", () => {
    expect(splitOnEmailToken("write to {email} any time")).toEqual([
      { type: "text", value: "write to " },
      { type: "email" },
      { type: "text", value: " any time" },
    ]);
  });

  it("drops the empty runs at the edges", () => {
    expect(splitOnEmailToken("{email}")).toEqual([{ type: "email" }]);
    expect(splitOnEmailToken("{email} is the address")).toEqual([
      { type: "email" },
      { type: "text", value: " is the address" },
    ]);
  });

  it("handles a paragraph that names the address twice", () => {
    expect(splitOnEmailToken("{email} or {email}")).toEqual([
      { type: "email" },
      { type: "text", value: " or " },
      { type: "email" },
    ]);
  });

  it("returns nothing for an empty body", () => {
    expect(splitOnEmailToken("")).toEqual([]);
  });
});

describe("splitLatinRuns", () => {
  it("leaves Hebrew-only copy in one piece", () => {
    expect(splitLatinRuns("טקסט בעברית בלבד")).toEqual([
      { type: "plain", value: "טקסט בעברית בלבד" },
    ]);
  });

  it("marks a Latin word inside a Hebrew sentence", () => {
    expect(splitLatinRuns("נבנה עם React")).toEqual([
      { type: "plain", value: "נבנה עם " },
      { type: "latin", value: "React" },
    ]);
  });

  it("keeps a multi-word name together", () => {
    expect(splitLatinRuns("LD Event Design")).toEqual([
      { type: "latin", value: "LD Event Design" },
    ]);
  });

  it("hands a trailing separator back to the sentence", () => {
    // "Next.js." ends the Hebrew sentence, not the English run.
    expect(splitLatinRuns("בנוי על Next.js.")).toEqual([
      { type: "plain", value: "בנוי על " },
      { type: "latin", value: "Next.js" },
      { type: "plain", value: "." },
    ]);
  });

  it("marks several runs in one string", () => {
    expect(splitLatinRuns("CRM ו־ERP")).toEqual([
      { type: "latin", value: "CRM" },
      { type: "plain", value: " ו־" },
      { type: "latin", value: "ERP" },
    ]);
  });

  it("ignores a run that is punctuation once trimmed", () => {
    expect(splitLatinRuns("01 / EVENT COMMERCE")).toEqual([
      { type: "plain", value: "01 / " },
      { type: "latin", value: "EVENT COMMERCE" },
    ]);
  });

  it("returns nothing for an empty string", () => {
    expect(splitLatinRuns("")).toEqual([]);
  });
});
