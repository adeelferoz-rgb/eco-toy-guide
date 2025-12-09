export interface Certification {
  id: string;
  name: string;
  logo: string;
  description: string;
  meaning: string;
  impact: string;
}

export const certifications: Certification[] = [
  {
    id: "fsc",
    name: "FSC (Forest Stewardship Council)",
    logo: "/placeholder.svg",
    description: "Ensures that products come from responsibly managed forests that provide environmental, social, and economic benefits.",
    meaning: "The wood used in the toy is sourced sustainably, protecting forests for future generations.",
    impact: "Promotes responsible forestry, conserves biodiversity, and respects the rights of indigenous peoples.",
  },
  {
    id: "gots",
    name: "GOTS (Global Organic Textile Standard)",
    logo: "/placeholder.svg",
    description: "The worldwide leading textile processing standard for organic fibers, including ecological and social criteria.",
    meaning: "For soft toys, this means the fabric is made from organic fibers and processed without harmful chemicals.",
    impact: "Reduces the use of toxic pesticides and fertilizers, ensures safer working conditions, and produces a healthier final product.",
  },
  {
    id: "oeko-tex",
    name: "OEKO-TEX Standard 100",
    logo: "/placeholder.svg",
    description: "A worldwide consistent, independent testing and certification system for raw, semi-finished, and finished textile products.",
    meaning: "Every component of the toy has been tested for harmful substances and is harmless for human health.",
    impact: "Protects consumers from harmful chemicals in textiles, ensuring toys are safe to touch and play with.",
  },
  {
    id: "green-seal",
    name: "Green Seal",
    logo: "/placeholder.svg",
    description: "A non-profit organization that develops life-cycle-based sustainability standards for products, services, and companies.",
    meaning: "The toy meets rigorous standards for performance, health, and environmental safety.",
    impact: "Signifies a product has a reduced environmental impact from manufacturing to disposal.",
  },
];