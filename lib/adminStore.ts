import { websiteData as defaultData } from "@/data/websiteData";
import type { GradeItem } from "@/components/admin/views/GradingView";
import type { HealthTopic } from "@/components/admin/views/HealthView";


const DEFAULT_GRADE_IMAGES: Record<string, string> = {
  "purple-grade": "/images/cardamom/purple-grade.jpg",
  "pink-grade": "/images/cardamom/pink-grade.jpg",
  "green-grade": "/images/cardamom/green-grade.jpg",
  "orange-grade": "/images/cardamom/orange-grade.jpg",
  "red-grade": "/images/cardamom/red-grade.jpg",
};

export const getStaticSrc = (item: unknown, fallback: string = ""): string => {
  if (!item) return fallback;
  if (typeof item === "string" && item.trim()) {
    if (item.includes("/EmperorAkbar-Cardamom-Web-Redesign/")) {
      return item.replace("/EmperorAkbar-Cardamom-Web-Redesign", "");
    }
    if (!item.startsWith("[object") && !item.includes("undefined")) {
      return item;
    }
  }
  if (typeof item === "object" && item !== null && "src" in item) {
    const srcVal = (item as { src: unknown }).src;
    if (typeof srcVal === "string" && srcVal) return srcVal;
  }
  return fallback;
};

export const availableCardamomWeights = [
  "100 gm",
  "250 gm",
  "500 gm",
  "1 kg",
  "5 kg",
] as const;

export type AvailableCardamomWeight = (typeof availableCardamomWeights)[number];

export const cardamomBadgeOptions = [
  "Sale",
  "Best Seller",
  "Chef's Choice",
  "GI Certified",
  "Sold Out",
] as const;

export type CardamomBadge = (typeof cardamomBadgeOptions)[number];

export const inventoryStatusOptions = [
  "In Stock & Ready to Ship",
  "Out of Stock (Sold Out)",
] as const;

export type InventoryStatus = (typeof inventoryStatusOptions)[number];

export interface CardamomProduct {
  id: string;
  slug: string;
  name: string;
  grade: string;
  diameterSpec: string;
  sellingPrice: number;
  originalPrice: number;
  badge: CardamomBadge;
  inventoryStatus: InventoryStatus;
  imageUrl: string;
  imageAlt?: string;
  description: string;
  availableWeights: string[];
  defaultWeight: string;

  // Interoperability with legacy AdminProduct fields
  price?: number;
  image?: string;
  images?: string[];
  tag?: string;
  inStock?: boolean;
  weights?: string[];
  weight?: string;
  size?: string;
  origin?: string;
  notes?: string;
  moisture?: string;
}

// Backwards compatibility alias
export type AdminProduct = CardamomProduct;

export function normalizeCardamomProduct(
  p: Partial<CardamomProduct> & { id: string; name: string }
): CardamomProduct {
  const sellingPrice = Number(p.sellingPrice ?? p.price ?? 0);
  const originalPrice = Number(p.originalPrice ?? Math.round(sellingPrice * 1.5));
  const badge: CardamomBadge =
    (p.badge as CardamomBadge) ||
    ((p.tag === "sold out" ? "Sold Out" : p.tag) as CardamomBadge) ||
    "Sale";
  const inventoryStatus: InventoryStatus =
    (p.inventoryStatus as InventoryStatus) ||
    (p.inStock === false || badge === "Sold Out"
      ? "Out of Stock (Sold Out)"
      : "In Stock & Ready to Ship");
  const inStock = inventoryStatus === "In Stock & Ready to Ship" && badge !== "Sold Out";
  const fallbackImage = DEFAULT_GRADE_IMAGES[p.id] || "/images/cardamom/purple-grade.jpg";
  const resolvedImageUrl = getStaticSrc(p.imageUrl || p.image, fallbackImage);
  const availableWeights =
    p.availableWeights && p.availableWeights.length > 0
      ? p.availableWeights
      : p.weights && p.weights.length > 0
      ? p.weights
      : [...availableCardamomWeights];
  const defaultWeight = p.defaultWeight || p.weight || availableWeights[0] || "100 gm";
  const grade = p.grade || "Purple";
  const diameterSpec = p.diameterSpec || p.size || grade;
  const slug = p.slug || p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id: p.id,
    slug,
    name: p.name,
    grade,
    diameterSpec,
    sellingPrice,
    originalPrice,
    badge,
    inventoryStatus,
    imageUrl: resolvedImageUrl,
    imageAlt: p.imageAlt || `${p.name} cardamom`,
    description: p.description || "",
    availableWeights,
    defaultWeight,

    // Aliases
    price: sellingPrice,
    image: resolvedImageUrl,
    images: p.images || (resolvedImageUrl ? [resolvedImageUrl] : []),
    tag: badge,
    inStock,
    weights: availableWeights,
    weight: defaultWeight,
    size: diameterSpec,
    origin: p.origin || "Alleppey, Kerala",
    notes: p.notes || "Sealed in Aroma-Lock packaging",
    moisture: p.moisture || "Max 10%",
  };
}

export type AdminRecipe = {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  author: string;
  excerpt: string;
  content: {
    recipeInfo?: {
      preparationTime?: string;
      cookingTime?: string;
      prepTime?: string;
      cookTime?: string;
      servings?: string;
      difficulty?: string;
      cuisine?: string;
      category?: string;
    };
    ingredientGroups?: {
      title?: string;
      items?: string[];
      ingredients?: { name: string; quantity: string }[];
    }[];
    steps?: (string | { id?: string; title?: string; description?: string; instructions?: string[] })[];
    introduction?: string[];
  };
};

export type UserOrder = {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    weight: string;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
};



// Backwards compatibility alias
export type AdminOrder = UserOrder;

export type SiteSettings = {
  announcementText: string;
  showAnnouncement: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroDescription: string;
  chefQuote: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
};

export type WebsiteCMSData = {
  settings: SiteSettings;
  products: AdminProduct[];
  recipes: AdminRecipe[];
  faqs: {
    category: string;
    items: { question: string; answer: string }[];
  }[];
  grading: GradeItem[];
  healthTopics: HealthTopic[];
};

const CMS_STORAGE_KEY = "emperorakbar_cms_data";
const ORDERS_STORAGE_KEY = "emperorakbar_orders";
const AUTH_STORAGE_KEY = "emperorakbar_admin_auth";

const purpleImg = "/images/cardamom/purple-grade.jpg";
const greenImg = "/images/cardamom/green-grade.jpg";
const pinkImg = "/images/cardamom/pink-grade.jpg";

export const cardamomProducts: CardamomProduct[] = [
  normalizeCardamomProduct({
    id: "purple-grade",
    slug: "purple-grade-cardamom",
    name: "Purple Grade (8 mm & above) Cardamom",
    grade: "Purple",
    diameterSpec: "Purple",
    sellingPrice: 2299,
    originalPrice: 3800,
    badge: "Sale",
    inventoryStatus: "In Stock & Ready to Ship",
    imageUrl: "/images/cardamom/purple-grade.jpg",
    imageAlt: "Purple Grade (8 mm and above) cardamom",
    description:
      "Versatile spice, chef recommended, ideal for the discerning home consumer",
    availableWeights: [...availableCardamomWeights],
    defaultWeight: "100 gm",
  }),
  normalizeCardamomProduct({
    id: "pink-grade",
    slug: "pink-grade-cardamom",
    name: "Pink Grade (7.5 mm & above) Cardamom",
    grade: "Pink",
    diameterSpec: "Pink",
    sellingPrice: 329,
    originalPrice: 650,
    badge: "Sold Out",
    inventoryStatus: "Out of Stock (Sold Out)",
    imageUrl: "/images/cardamom/pink-grade.jpg",
    imageAlt: "Pink Grade (7.5 mm and above) cardamom",
    description:
      "Versatile spice, ideal for the discerning home consumer",
    availableWeights: [...availableCardamomWeights],
    defaultWeight: "100 gm",
  }),
  normalizeCardamomProduct({
    id: "green-grade",
    slug: "green-grade-cardamom",
    name: "Green Grade (7–8mm) Cardamom",
    grade: "Green",
    diameterSpec: "Green",
    sellingPrice: 2149,
    originalPrice: 3500,
    badge: "Sale",
    inventoryStatus: "In Stock & Ready to Ship",
    imageUrl: "/images/cardamom/green-grade.jpg",
    imageAlt: "Green Grade (7–8 mm) cardamom",
    description:
      "Versatile spice, ideal for the discerning home consumer",
    availableWeights: [...availableCardamomWeights],
    defaultWeight: "100 gm",
  }),
  normalizeCardamomProduct({
    id: "orange-grade",
    slug: "orange-grade-cardamom",
    name: "Orange Grade (6.5–7.5mm) Cardamom",
    grade: "Orange",
    diameterSpec: "Orange",
    sellingPrice: 1899,
    originalPrice: 3000,
    badge: "Sold Out",
    inventoryStatus: "Out of Stock (Sold Out)",
    imageUrl: "/images/cardamom/orange-grade.jpg",
    imageAlt: "Orange Grade (6.5–7.5 mm) cardamom",
    description: "Ideal for industrial use",
    availableWeights: [...availableCardamomWeights],
    defaultWeight: "100 gm",
  }),
  normalizeCardamomProduct({
    id: "red-grade",
    slug: "red-grade-cardamom",
    name: "Red Grade (6–7mm) Cardamom",
    grade: "Red",
    diameterSpec: "Red",
    sellingPrice: 1849,
    originalPrice: 2600,
    badge: "Sale",
    inventoryStatus: "In Stock & Ready to Ship",
    imageUrl: "/images/cardamom/red-grade.jpg",
    imageAlt: "Red Grade (6–7 mm) cardamom",
    description: "Versatile spice, ideal for industrial use",
    availableWeights: [...availableCardamomWeights],
    defaultWeight: "100 gm",
  }),
];

/** Small helpers for product cards and admin forms. */
export const getCardamomProductById = (
  id: string,
): CardamomProduct | undefined =>
  cardamomProducts.find((product) => product.id === id);

export const getCardamomProductBySlug = (
  slug: string,
): CardamomProduct | undefined =>
  cardamomProducts.find((product) => product.slug === slug);

const DEFAULT_ORDERS: UserOrder[] = [
  {
    id: "ord-101",
    orderNumber: "EA-98241",
    date: "2026-10-11T14:32:00Z",
    customer: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98201 44521",
      address: "Flat 402, Royal Palms, Bandra West",
      city: "Mumbai",
      pincode: "400050",
    },
    items: [
      {
        id: "purple-grade",
        name: "Purple Grade (8 mm & above) Cardamom",
        price: 2299,
        weight: "100g",
        quantity: 2,
        image: purpleImg,
      },
      {
        id: "green-grade",
        name: "Green Grade (7-8mm) Cardamom",
        price: 2149,
        weight: "250g",
        quantity: 1,
        image: greenImg,
      },
    ],
    total: 6747,
    status: "Processing",
    paymentMethod: "Online UPI",
  },
  {
    id: "ord-102",
    orderNumber: "EA-98242",
    date: "2026-10-11T18:15:00Z",
    customer: {
      name: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91 94471 22904",
      address: "12 Marine Drive Avenue",
      city: "Kochi",
      pincode: "682011",
    },
    items: [
      {
        id: "pink-grade",
        name: "Pink Grade (7.5 mm & above) Cardamom",
        price: 329,
        weight: "50g",
        quantity: 3,
        image: pinkImg,
      },
    ],
    total: 987,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ord-103",
    orderNumber: "EA-98240",
    date: "2026-10-10T11:05:00Z",
    customer: {
      name: "Chef David Miller",
      email: "david.miller@culinarydxb.com",
      phone: "+971 50 123 4567",
      address: "Downtown Boulevard, Suite 1902",
      city: "Dubai",
      pincode: "00000",
    },
    items: [
      {
        id: "purple-grade",
        name: "Purple Grade (8 mm & above) Cardamom",
        price: 2299,
        weight: "500g",
        quantity: 5,
        image: purpleImg,
      },
    ],
    total: 11495,
    status: "Delivered",
    paymentMethod: "International Card",
  },
];

export function getInitialCMSData(): WebsiteCMSData {
  return {
    settings: {
      announcementText: "✨ SPECIAL FESTIVE OFFER: Free shipping on all Alleppey GI-Tagged orders above ₹999 across India!",
      showAnnouncement: true,
      heroTitle: "THE GREEN GOLD OF INDIA",
      heroSubtitle: "PREMIUM ALLEPPEY GREEN CARDAMOM",
      heroTagline: "Pure. Aromatic. Naturally Extraordinary.",
      heroDescription: "From the lush spice hills of Alleppey to your kitchen. Emperor Akbar brings you the world's finest green cardamom, sealed at its freshest with Aroma-Lock technology.",
      chefQuote: "Mashaallah, the aroma is amazing! It reflects the distinctive quality of Emperor Akbar Cardamom.",
      contactEmail: "care@emperorakbar.com",
      contactPhone: "+91 22 2378 1234",
      officeAddress: "Emperor Akbar Spice Chambers, Alleppey Spice Estate, Kerala, India - 688001",
      whatsappNumber: "+91 98201 99999",
      instagramUrl: "https://instagram.com/emperorakbarcardamom",
      facebookUrl: "https://facebook.com/emperorakbar",
      youtubeUrl: "https://youtube.com/@emperorakbar",
    },
    products: cardamomProducts.map((p) => ({ ...p })),
    recipes: defaultData.recipes.items.map((r: (typeof defaultData.recipes.items)[number]) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      image: typeof r.image === "string" ? r.image : (r.image as { src?: string })?.src || "",
      category: r.tags?.[0] || "Dessert",
      cookTime: r.content?.recipeInfo?.cookingTime || "30 mins",
      prepTime: r.content?.recipeInfo?.preparationTime || "15 mins",
      servings: r.content?.recipeInfo?.servings || "4 servings",
      author: r.author || "Shimi's Kitchen",
      excerpt: r.description || "",
      content: {
        recipeInfo: {
          prepTime: r.content?.recipeInfo?.preparationTime,
          cookTime: r.content?.recipeInfo?.cookingTime,
          preparationTime: r.content?.recipeInfo?.preparationTime,
          cookingTime: r.content?.recipeInfo?.cookingTime,
          servings: r.content?.recipeInfo?.servings,
          difficulty: r.content?.recipeInfo?.difficulty,
          cuisine: r.content?.recipeInfo?.cuisine,
          category: r.content?.recipeInfo?.category,
        },
        ingredientGroups: r.content?.ingredientGroups?.map((g) => ({
          title: g.title,
          items: g.ingredients?.map((i) => `${i.name} - ${i.quantity}`) || [],
          ingredients: g.ingredients,
        })),
        steps: r.content?.steps?.map((s) => s.title || "") || [],
        introduction: r.content?.introduction,
      },
    })),
    faqs: [
      {
        category: "General & Aroma-Lock",
        items: defaultData.faqs.items.map((item: (typeof defaultData.faqs.items)[number]) => ({
          question: item.question,
          answer: item.answer,
        })),
      },
    ],
    grading: (defaultData.about.grading as unknown as GradeItem[]) || [],
    healthTopics: (defaultData.healthData.topics as unknown as HealthTopic[]) || [],
  };
}

export function loadCMSData(): WebsiteCMSData {
  if (typeof window === "undefined") {
    return getInitialCMSData();
  }
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialCMSData();
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.products)) {
      parsed.products = parsed.products.map((p: Partial<CardamomProduct> & { id: string; name: string }) =>
        normalizeCardamomProduct(p)
      );
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse CMS data from localStorage", err);
    return getInitialCMSData();
  }
}

export function saveCMSData(data: WebsiteCMSData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("emperorakbar-cms-updated"));
  } catch (err) {
    console.error("Failed to save CMS data", err);
  }
}

export function resetCMSData(): WebsiteCMSData {
  const initial = getInitialCMSData();
  saveCMSData(initial);
  return initial;
}

export function loadOrders(): UserOrder[] {
  if (typeof window === "undefined") return DEFAULT_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse orders", err);
    return DEFAULT_ORDERS;
  }
}

export function saveOrders(orders: UserOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("emperorakbar-orders-updated"));
  } catch (err) {
    console.error("Failed to save orders", err);
  }
}

export function createCustomerOrder(order: Omit<UserOrder, "id" | "orderNumber" | "date" | "status">): UserOrder {
  const existing = loadOrders();
  const newOrder: UserOrder = {
    ...order,
    id: `ord-${Date.now()}`,
    orderNumber: `EA-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString(),
    status: "Pending",
  };
  const updated = [newOrder, ...existing];
  saveOrders(updated);
  return newOrder;
}

export function checkAdminAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === "authenticated_admin";
}

export function setAdminAuth(authenticated: boolean): void {
  if (typeof window === "undefined") return;
  if (authenticated) {
    localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_admin");
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function getAdminPassword(): string {
  if (typeof window === "undefined") return "akbar@admin2026";
  return localStorage.getItem("emperorakbar_admin_pwd") || "akbar@admin2026";
}

export function setAdminPassword(pwd: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("emperorakbar_admin_pwd", pwd);
}
