export const allowedServices = [
  "website",
  "crm",
  "erp",
  "automation",
  "custom",
  "other",
] as const;

type Service = (typeof allowedServices)[number];

export type ContactLead = {
  name: string;
  business_name: string | null;
  phone: string;
  email: string | null;
  service: Service | null;
  message: string;
  source: "nisan-sinai-tech-site";
};

type ValidationResult =
  | { success: true; lead: ContactLead }
  | { success: false };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\s-]{7,24}$/;
const allowedServiceSet = new Set<string>(allowedServices);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function textField(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

export function hasFilledHoneypot(input: unknown) {
  const record = asRecord(input);
  return record ? textField(record, "website").length > 0 : false;
}

export function parseContactLead(input: unknown): ValidationResult {
  const record = asRecord(input);
  if (!record) {
    return { success: false };
  }

  const name = textField(record, "name");
  const businessName = textField(record, "business_name");
  const phone = textField(record, "phone");
  const email = textField(record, "email").toLowerCase();
  const service = textField(record, "service");
  const message = textField(record, "message");
  const consent = textField(record, "consent");

  const valid =
    name.length >= 2 &&
    name.length <= 80 &&
    businessName.length <= 100 &&
    phonePattern.test(phone) &&
    (email.length === 0 || (email.length <= 160 && emailPattern.test(email))) &&
    (service.length === 0 || allowedServiceSet.has(service)) &&
    message.length >= 10 &&
    message.length <= 1500 &&
    consent === "accepted";

  if (!valid) {
    return { success: false };
  }

  return {
    success: true,
    lead: {
      name,
      business_name: businessName || null,
      phone,
      email: email || null,
      service: (service || null) as Service | null,
      message,
      source: "nisan-sinai-tech-site",
    },
  };
}
