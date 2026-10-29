/** Public identities already linked from the business website. No private data. */
export const businessProfiles = [
  { name: "Facebook", url: "https://www.facebook.com/NisanSinaiAI" },
  { name: "Instagram", url: "https://www.instagram.com/nisansinaiai/" },
] as const;

export const founderProfile = "https://www.linkedin.com/in/nisansinai";

// A country is the verified service area. Do not invent a street address,
// coordinates, opening hours or a local office to qualify for a rich result.
export const serviceArea = { "@type": "Country", name: "Israel" } as const;
