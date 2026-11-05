import ServicePage, { buildServiceMetadata } from "@/app/service-page";

export const metadata = buildServiceMetadata("en", "custom-business-software");

export default function Page() {
  return <ServicePage locale="en" slug="custom-business-software" />;
}
