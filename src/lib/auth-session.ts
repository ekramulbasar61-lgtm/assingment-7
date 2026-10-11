import { headers } from "next/headers";

export async function getAuthSession() {
  const [{ auth }, requestHeaders] = await Promise.all([
    import("@/lib/auth"),
    headers(),
  ]);

  return auth.api.getSession({ headers: requestHeaders });
}
