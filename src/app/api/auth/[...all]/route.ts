import { toNextJsHandler } from "better-auth/next-js";

async function handleAuthRequest(request: Request) {
  const { auth } = await import("@/lib/auth");
  const { GET, POST } = toNextJsHandler(auth);
  return request.method === "GET" ? GET(request) : POST(request);
}

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;
