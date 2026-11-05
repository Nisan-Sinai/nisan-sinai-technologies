import ServicePage, { buildServiceMetadata } from "@/app/service-page";

export const metadata = buildServiceMetadata("en", "website-development");

export default function Page() {
  return <ServicePage locale="en" slug="website-development" />;
}
