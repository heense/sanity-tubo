import { client } from "./client";

export type SanityRedirect = {
  _id: string;
  source: string;
  destination: string;
  permanent: "permanent" | "temporary";
};

export type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

// Function to fetch all redirects from Sanity
export async function fetchSanityRedirects(): Promise<SanityRedirect[]> {
  return client.fetch<SanityRedirect[]>(`
    *[_type == "redirect"] {
      _id,
      source,
      destination,
      permanent
    }
  `);
}

// Function to transform Sanity redirects to Next.js redirect format
export function transformSanityRedirects(
  sanityRedirects: SanityRedirect[],
): Redirect[] {
  return sanityRedirects.map((redirect) => ({
    source: redirect.source,
    destination: redirect.destination,
    permanent: redirect.permanent === "permanent",
  }));
}

// Function to get all redirects in Next.js format
export async function getRedirects(): Promise<Redirect[]> {
  try {
    const sanityRedirects = await fetchSanityRedirects();
    return transformSanityRedirects(sanityRedirects);
  } catch (error) {
    console.error("Error fetching redirects from Sanity:", error);
    return [];
  }
}
