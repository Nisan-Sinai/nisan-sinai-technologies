import { buildLlmsText } from "@/lib/llms";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsText(resolveSiteUrl()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
  });
}
