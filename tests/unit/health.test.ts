import { afterEach, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";

afterEach(() => vi.unstubAllEnvs());

it("publishes only a public release SHA with no-store and noindex", async () => {
  vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "a".repeat(40));
  const response = GET();
  expect(await response.json()).toEqual({ release: "a".repeat(40) });
  expect(response.headers.get("Cache-Control")).toBe("no-store");
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
});

it("has no release in an unlinked local checkout", async () => {
  vi.stubEnv("VERCEL_GIT_COMMIT_SHA", undefined);
  expect(await GET().json()).toEqual({ release: null });
});
