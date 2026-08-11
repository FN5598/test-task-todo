"use server";

import { cookies } from "next/headers";
import {
  loginSchema,
  signInSchema,
} from "@lib/validators/auth";
import { validateForm, type FieldErrors } from "@lib/validators/validate-form";
import { redirect } from "next/navigation";

type AuthenticationResponse = {
  user: {
    username: string;
  };
};

type ErrorResponse = {
  error?: string;
};

type AuthCookie = {
  name: "access_token" | "refresh_token";
  options: {
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "lax" | "none" | "strict";
    secure?: boolean;
  };
  value: string;
};

export type AuthActionState = {
  fieldErrors?: FieldErrors;
  formError?: string;
  successMessage?: string;
};

function getApiBaseUrl() {
  const configuredUrl =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4000";
  const baseUrl = configuredUrl.replace(/\/$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}

function parseAuthCookie(setCookieHeader: string): AuthCookie | undefined {
  const [nameValue, ...attributes] = setCookieHeader.split(";");
  const separator = nameValue.indexOf("=");

  if (separator === -1) {
    return undefined;
  }

  const name = nameValue.slice(0, separator).trim();

  if (name !== "access_token" && name !== "refresh_token") {
    return undefined;
  }

  const options: AuthCookie["options"] = {};

  for (const attribute of attributes) {
    const [rawKey, ...rawValue] = attribute.trim().split("=");
    const key = rawKey.toLowerCase();
    const value = rawValue.join("=");

    if (key === "httponly") options.httpOnly = true;
    if (key === "secure") options.secure = true;
    if (key === "path") options.path = value;
    if (key === "max-age") options.maxAge = Number(value);
    if (
      key === "samesite" &&
      ["lax", "none", "strict"].includes(value.toLowerCase())
    ) {
      options.sameSite =
        value.toLowerCase() as AuthCookie["options"]["sameSite"];
    }
  }

  return { name, value: nameValue.slice(separator + 1), options };
}

async function persistAuthCookies(response: Response) {
  const cookieStore = await cookies();

  for (const setCookieHeader of response.headers.getSetCookie()) {
    const cookie = parseAuthCookie(setCookieHeader);

    if (cookie) {
      cookieStore.set(cookie.name, cookie.value, cookie.options);
    }
  }
}

async function authenticate(
  path: string,
  body: Record<string, string>,
): Promise<{ response?: AuthenticationResponse; error?: string }> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return { error: "Unable to reach the server. Please try again." };
  }

  const payload = (await response.json().catch(() => null)) as
    | AuthenticationResponse
    | ErrorResponse
    | null;

  if (!response.ok) {
    return {
      error:
        payload && "error" in payload && payload.error
          ? payload.error
          : "Unable to authenticate. Please try again.",
    };
  }

  await persistAuthCookies(response);
  return { response: payload as AuthenticationResponse };
}

export async function logInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = validateForm(loginSchema, formData);

  if (!result.success) {
    return { fieldErrors: result.errors };
  }

  const resultFromApi = await authenticate("/auth/log-in", result.data);

  if (resultFromApi.error) {
    return { formError: resultFromApi.error };
  }

  redirect("/tasks");
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = validateForm(signInSchema, formData);

  if (!result.success) {
    return { fieldErrors: result.errors };
  }

  const { confirmPassword, ...input } = result.data;
  const resultFromApi = await authenticate("/auth/sign-in", input);

  if (resultFromApi.error) {
    return { formError: resultFromApi.error };
  }

  redirect("/tasks");
}

export async function signOutAction() {
  const cookieStore = await cookies();

  try {
    await fetch(`${getApiBaseUrl()}/auth/sign-out`, {
      method: "POST",
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
  } finally {
    cookieStore.set("access_token", "", {
      expires: new Date(0),
      path: "/",
    });
    cookieStore.set("refresh_token", "", {
      expires: new Date(0),
      path: "/api/auth",
    });
  }

  redirect("/auth?tab=login");
}
