import { NextResponse, type NextRequest } from "next/server";
import { getReturnTo, RETURN_TO_HEADER } from "@/lib/auth/return-to";

export const middleware = (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers);
  const url = request.nextUrl.clone();
  url.searchParams.delete("_rsc");
  requestHeaders.set(
    RETURN_TO_HEADER,
    getReturnTo(`${url.pathname}${url.search}`),
  );

  return NextResponse.next({ request: { headers: requestHeaders } });
};

export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml).*)"],
};
