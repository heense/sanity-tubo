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
  const { pathname } = request.nextUrl;

  console.log("Middleware running for path:", pathname);

  // Skip middleware for specific paths (static files, api routes, etc.)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Skip files with extensions like images, fonts, etc.
  ) {
    return NextResponse.next();
  }

  // Get redirects with caching
  const redirects = await getCachedRedirects();

  // console.log("Available redirects:", JSON.stringify(redirects, null, 2));

  // Find matching redirect
  const matchedRedirect = redirects.find((redirect) => {
    // Remove leading slash for comparison if it exists
    const normalizedSource = redirect.source.startsWith("/")
      ? redirect.source
      : "/" + redirect.source;

    console.log(`Comparing: "${normalizedSource}" with "${pathname}"`);

    return normalizedSource === pathname || normalizedSource === pathname + "/";
  });

  console.log("Matched redirect:", matchedRedirect);

  // If a matching redirect is found, redirect the user
  if (matchedRedirect) {
    console.log("Redirecting to:", matchedRedirect.destination);
    const statusCode = matchedRedirect.permanent ? 308 : 307;
    // Ensure destination starts with / if it's a relative path
    const destination = matchedRedirect.destination.startsWith("/")
      ? matchedRedirect.destination
      : "/" + matchedRedirect.destination;

    return NextResponse.redirect(new URL(destination, request.url), {
      status: statusCode,
    });
  }

  // If no redirect is found, continue with the request
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
