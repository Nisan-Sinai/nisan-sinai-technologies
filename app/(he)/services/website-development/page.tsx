import ServicePage, { buildServiceMetadata } from "@/app/service-page";

export const metadata = buildServiceMetadata("he", "website-development");

export default function Page() {
  return <ServicePage locale="he" slug="website-development" />;
}
