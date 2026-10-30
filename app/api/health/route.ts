/** Public release identifier only: no environment dump, database or customer data. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { release: process.env.VERCEL_GIT_COMMIT_SHA ?? null },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
