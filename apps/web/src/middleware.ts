import { defaultLocale, locales } from "@/lib/i18n/config";
import { NextResponse, type NextRequest } from "next/server";
import { getRedirects } from "./lib/sanity/redirects";

// In-memory cache for redirects to avoid fetching from Sanity on every request
let redirectsCache: {
  redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }>;
  lastFetched: number;
} | null = null;

// Refresh cache every 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Skip paths with extensions (except .html)
  if (
    /\.\w+$/.test(pathname) &&
    !pathname.endsWith(".html") &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Redirect if there is no locale
  if (!pathnameHasLocale && !pathname.startsWith("/api/")) {
    // Use default locale for simplicity
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}${pathname === "/" ? "" : pathname}`,
        request.url,
      ),
    );
  }

  // Get redirects with caching
  const redirects = await getCachedRedirects();

  // console.log("Available redirects:", JSON.stringify(redirects, null, 2));

  // Find matching redirect
  const matchedRedirect = redirects.find((redirect) => {
    // Remove leading slash for comparison if it exists
    const normalizedSource = redirect.source.startsWith("/")
      ? redirect.source.substring(1)
      : redirect.source;
    const normalizedPath = pathname.startsWith("/")
      ? pathname.substring(1)
      : pathname;

    return normalizedSource === normalizedPath;
  });

  if (matchedRedirect) {
    // console.log("Matched redirect:", matchedRedirect);
    return NextResponse.redirect(
      new URL(
        matchedRedirect.destination,
        // Get the URL with the protocol and host
        `${request.nextUrl.protocol}//${request.headers.get("host") || request.nextUrl.host}`,
      ),
      matchedRedirect.permanent ? 308 : 307,
    );
  }

  return NextResponse.next();
}

async function getCachedRedirects() {
  const now = Date.now();

  // If cache is valid, return it
  if (redirectsCache && now - redirectsCache.lastFetched < CACHE_DURATION) {
    return redirectsCache.redirects;
  }

  // Otherwise fetch fresh redirects
  const redirects = await getRedirects();

  // console.log(
  //   "Fetched fresh redirects from Sanity:",
  //   JSON.stringify(redirects, null, 2),
  // );

  // Update cache
  redirectsCache = {
    redirects,
    lastFetched: now,
  };

  return redirects;
}

// Specify which paths this middleware will run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
