import { apiUrls } from "@/lib/api";

export interface ProductChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: ProductChange;
  markets: Market[];
}

export interface Category {
  id: string | number;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface MarketData<T> {
  items: T[];
  error: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCategory(value: unknown): value is Category {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.slug === "string" &&
    typeof value.nameBn === "string" &&
    typeof value.icon === "string"
  );
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value) || !isRecord(value.change)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.slug === "string" &&
    typeof value.nameBn === "string" &&
    typeof value.category === "string" &&
    typeof value.categoryNameBn === "string" &&
    typeof value.categoryIcon === "string" &&
    typeof value.unit === "string" &&
    typeof value.image === "string" &&
    typeof value.today === "number" &&
    typeof value.yesterday === "number" &&
    typeof value.lastWeek === "number" &&
    typeof value.lastMonth === "number" &&
    (value.change.dir === "up" ||
      value.change.dir === "down" ||
      value.change.dir === "flat") &&
    typeof value.change.pct === "number" &&
    Array.isArray(value.markets)
  );
}

async function loadArray<T>(
  url: string,
  resource: string,
  isItem: (value: unknown) => value is T
): Promise<MarketData<T>> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${resource} API returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || !payload.every(isItem)) {
      throw new Error(`${resource} API returned an unexpected data shape`);
    }

    return { items: payload, error: false };
  } catch (error) {
    console.error(`Unable to load ${resource} from the market API`, error);
    return { items: [], error: true };
  }
}

export function getCategories(): Promise<MarketData<Category>> {
  return loadArray(apiUrls.categories, "categories", isCategory);
}

export function getProducts(): Promise<MarketData<Product>> {
  return loadArray(apiUrls.products, "products", isProduct);
}

export const unitLabels: Record<string, string> = {
  kg: "কেজি",
  piece: "পিস",
  hali: "হালি",
  dozen: "ডজন",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  bundle: "আঁটি",
};
