import ServicePage, { buildServiceMetadata } from "@/app/service-page";

export const metadata = buildServiceMetadata("he", "custom-business-software");

export default function Page() {
  return <ServicePage locale="he" slug="custom-business-software" />;
}
