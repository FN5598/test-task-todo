export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL = "30d";
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const JWT_ISSUER = "todo-backend";
export const JWT_AUDIENCE = "todo-client";

export type AuthEnvironment = Record<string, string | undefined>;

export type AuthConfig = {
  accessSecret: Uint8Array;
  refreshSecret: Uint8Array;
};

function requiredSecret(name: string, environment: AuthEnvironment) {
  const value = environment[name];

  if (!value) {
    throw new Error(`${name} must be configured`);
  }

  return new TextEncoder().encode(value);
}

export function getAuthConfig(environment: AuthEnvironment = process.env): AuthConfig {
  return {
    accessSecret: requiredSecret("JWT_ACCESS_SECRET", environment),
    refreshSecret: requiredSecret("JWT_REFRESH_SECRET", environment),
  };
}

export function getClientOrigin(environment: AuthEnvironment = process.env) {
  const origin = environment.CLIENT_ORIGIN;

  if (origin) {
    return origin;
  }

  if (environment.NODE_ENV === "production") {
    throw new Error("CLIENT_ORIGIN must be configured in production");
  }

  return "http://localhost:3000";
}
