import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const isBahasaMelayu = request.nextUrl.pathname === "/bm" || request.nextUrl.pathname.startsWith("/bm/");
  requestHeaders.set("x-axs-document-language", isBahasaMelayu ? "ms-MY" : "en-MY");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand|images).*)"],
};
