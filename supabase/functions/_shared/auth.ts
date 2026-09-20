// Supabase Edge Functions - Shared Auth JWT Extraction Module

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized. Valid Bearer token required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export interface AuthenticatedUser {
  user_id: string;
  role?: string;
  email?: string;
}

export function parseJwtPayload(token: string): Record<string, unknown> {
  if (!token || typeof token !== "string") {
    throw new UnauthorizedError("Invalid token format.");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new UnauthorizedError("Malformed JWT token.");
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new UnauthorizedError("Failed to parse JWT claims.");
  }
}

export function extractUserFromRequest(req: Request): AuthenticatedUser {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header.");
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    throw new UnauthorizedError("Empty Bearer token.");
  }

  const payload = parseJwtPayload(token);
  const userId = (payload.sub || payload.user_id) as string;

  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    throw new UnauthorizedError("Invalid JWT claims: missing sub/user_id.");
  }

  // Validação simples de formato UUID v4
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId.trim())) {
    throw new UnauthorizedError("Invalid user_id format in JWT.");
  }

  return {
    user_id: userId.trim(),
    role: (payload.role as string) || "anon",
    email: (payload.email as string) || undefined,
  };
}
