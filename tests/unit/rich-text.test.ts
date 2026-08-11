import { describe, expect, it } from "vitest";
import { splitOnEmailToken } from "@/lib/rich-text";

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
