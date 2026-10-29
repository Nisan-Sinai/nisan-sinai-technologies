# SEO / GEO audit and implementation — 29 October 2026

Production: https://nisan-sinai-technologies.vercel.app/
Repository: https://github.com/Nisan-Sinai/nisan-sinai-technologies

## Findings and resulting changes

| Finding | Change |
| --- | --- |
| Code's unconfigured canonical fallback used the old Sites hostname; live production was correctly configured | Use the production Vercel hostname as the fallback while retaining configured domain support |
| Existing bilingual canonicals, server rendering, FAQ and sitemap provided a sound base | Preserve them; add reciprocal x-default and regression checks across every public page |
| No public AI content summaries | Generate UTF-8 llms.txt and llms-full.txt from the same published dictionaries and articles on every build |
| Business sameAs named only the founder's LinkedIn profile | Separate Facebook/Instagram business identities from the human founder; reuse stable business, website, founder and service IDs |
| Secondary pages had incomplete identity context | Share the same public business/website identity; add visible and structured breadcrumbs |
| Blog Twitter descriptions could inherit home-page copy | Centralise page-specific title/description, OG and Twitter generation |
| Articles lacked visible authorship, revision dates and related reading | Add author, actual content-revision dates, sources, translated-page switches and related articles |
| Some copy implied unverifiable client statistics, universal legal duties, or security without updates | Remove those claims; explain maintenance and accessibility with appropriate qualifications |
| Portfolio described a demonstration store as a live customer business and included an unverified RSVP feature | Label Shel-Yah as a demonstration; remove the seating feature claim |
| Service region and founder relationship were unclear in visible copy | State Nisan Sinai's role and nationwide Israeli service in Hebrew and English; no unverified street address/city added |
| New dependency advisories blocked the existing strict audit | Pin patched fast-uri, undici, zod, satori and fflate transitives; remove the now-unneeded temporary audit opt-in so the normal command accepts zero advisories only |

## Crawlability and privacy

Public HTML remains available to wildcard-compliant crawlers, including Googlebot,
Bingbot, OAI-SearchBot and PerplexityBot. No crawler-specific group shadows the
wildcard rules. The API is excluded from crawling. The management page keeps its
existing noindex and access controls; it is intentionally not disallowed because
crawlers must be able to read noindex. Neither private routes nor customer records
are included in the sitemap or discovery text. JSON-LD escapes `<` before embedding.
No authentication, API validation, database privileges or RLS policies were changed.

Existing official profile destinations are reused. Profile access may require a
social-network login; outbound links and matching structured data can be tested,
but reciprocal links and account ownership require access to those profiles.
No unverified YouTube or Threads URL is invented.

## Performance and accessibility

Changes are server-rendered and add no new client dependencies or external
requests. Existing deferred analytics consent, image dimensions, lazy project
images, keyboard controls and responsive layout are preserved. Automated axe
checks cover all 16 public pages on desktop and two mobile viewports, alongside
keyboard, overflow, consent and navigation journeys. Automated checks do not
replace manual assistive-technology review.

Lab checks are not real-user Core Web Vitals. CrUX/Search Console field data and
indexing reports were not available through the connected GSC Wizard: it refused
access because a paid subscription is required. No subscription was purchased.
Use the free official consoles below for those measurements.

## External actions

1. In free Google Search Console, verify the exact production URL-prefix property,
   submit `/sitemap.xml`, inspect the home pages and new article, and monitor
   indexing, selected canonicals, impressions and enquiries. A verification token
   already exists in the code; that does not establish current property access.
2. In free Bing Webmaster Tools, verify/import the property and submit the same
   sitemap. Consider IndexNow only after ownership is established.
3. Review Google Business Profile eligibility. If eligible, use the real service
   area and business details; publish a physical address only when appropriate.
4. Ensure official social profiles link back to this exact website and use the same
   business name/contact details. Confirm any additional profile URL before adding it.
5. Collect genuine customer testimonials and permission to publish them. Continue
   leaving the testimonial section empty until those exist.
6. Monitor real-user LCP/INP/CLS in Search Console or PageSpeed Insights when enough
   CrUX data is available, and compare organic enquiries over time.

No implementation guarantees indexing, rank, rich results or recommendations in
AI answers. llms.txt is supplementary; Google explicitly says it is unnecessary
for its AI search features. FAQ markup mirrors visible content and does not imply
that this business is eligible for Google's restricted FAQ rich results.

## Primary references

- Google: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Perplexity crawlers: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters/about
- Israeli accessibility guidance: https://www.gov.il/he/pages/website_accessibility
- W3C WAI: https://www.w3.org/WAI/fundamentals/accessibility-intro/
