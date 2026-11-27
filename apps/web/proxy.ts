import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const routerHost = process.env.VERCEL_URL;
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.__VERCEL_DEV_RUNNING === "1" && routerHost && forwardedHost !== routerHost) {
    const target = request.nextUrl.clone();
    target.protocol = "http:";
    target.host = routerHost;
    return NextResponse.redirect(target);
  }
  const response = NextResponse.next();
  // The browser's id, which names the visitor of its chats (agent/channels/eve.ts).
  if (!request.cookies.has("shopduck_vid"))
    response.cookies.set("shopduck_vid", crypto.randomUUID(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 395,
      sameSite: "lax",
      secure: true,
    });
  return response;
}
