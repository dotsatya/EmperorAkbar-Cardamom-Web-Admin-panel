import { websiteData as defaultData, Photos } from "@/data/websiteData";
import type { GradeItem } from "@/components/admin/views/GradingView";
import type { HealthTopic } from "@/components/admin/views/HealthView";

export type AdminProduct = {
  id: string;
  name: string;
  grade: string;
  size: string;
  price: number;
  originalPrice: number;
  weight: string;
  weights: string[];
  image: string;
  images: string[];
  tag: string;
  description: string;
  notes: string;
  origin: string;
  moisture: string;
  inStock: boolean;
};

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

const getStaticSrc = (item: unknown, fallback: string): string => {
  if (!item) return fallback;
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null && "src" in item) {
    const srcVal = (item as { src: unknown }).src;
    if (typeof srcVal === "string") return srcVal;
    if (typeof srcVal === "object" && srcVal !== null && "src" in srcVal) {
      return (srcVal as { src: string }).src;
    }
  }
  return fallback;
};

const purpleImg = getStaticSrc(Photos.purpleSeed[0], "/purple/1.jpg");
const greenImg = getStaticSrc(Photos.greenSeed[0], "/green/1.webp");
const pinkImg = getStaticSrc(Photos.pinkSeed[0], "/pink/1.webp");

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
    products: defaultData.shop.products.map((p: (typeof defaultData.shop.products)[number]) => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || Math.round(p.price * 1.5),
      weight: p.weights?.[0] || "100g",
      weights: p.weights || ["100 gm", "250 gm", "500 gm"],
      image: typeof p.image === "string" ? p.image : (p.image as { src?: string })?.src || "",
      images: (p.images || []).map((img: unknown) => (typeof img === "string" ? img : (img as { src?: string })?.src || "")),
      tag: p.status || "Sale",
      description: p.usage || p.speciality || p.name,
      notes: "Sealed in Aroma-Lock packaging",
      origin: p.origin || "Alleppey, Kerala",
      moisture: "Max 10%",
      grade: p.grade || p.size || "GI Tagged",
      size: p.size || "7-8mm",
      inStock: p.status !== "sold out",
    })),
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
    return JSON.parse(raw);
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
