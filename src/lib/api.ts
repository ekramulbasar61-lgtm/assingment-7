const apiBaseUrl =
  process.env.API_BASE_URL?.trim() ||
  "https://openapi.programming-hero.com/api/bazardor";
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, "");

export const apiUrls = {
  categories: `${normalizedApiBaseUrl}/categories`,
  products: `${normalizedApiBaseUrl}/products`,
};
