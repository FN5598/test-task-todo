import { NextResponse } from "next/server";

function getApiBaseUrl() {
  const configuredUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const baseUrl = configuredUrl.replace(/\/$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}

function isAuthenticationCookie(setCookieHeader: string) {
  return /^(access_token|refresh_token)=/.test(setCookieHeader);
}

export async function POST(request: Request) {
  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${getApiBaseUrl()}/auth/refresh-token`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Unable to refresh the session." }, { status: 503 });
  }

  const response = NextResponse.json({}, { status: backendResponse.status });

  for (const setCookieHeader of backendResponse.headers.getSetCookie()) {
    if (isAuthenticationCookie(setCookieHeader)) {
      response.headers.append("set-cookie", setCookieHeader);
    }
  }

  return response;
}
