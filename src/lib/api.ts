const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("Missing API_BASE_URL environment variable.");
}

const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, "");

export const apiUrls = {
  categories: `${normalizedApiBaseUrl}/categories`,
  products: `${normalizedApiBaseUrl}/products`,
};
