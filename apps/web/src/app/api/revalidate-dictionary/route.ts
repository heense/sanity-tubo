import { locales } from "@/lib/i18n/config";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the webhook payload
    const body = await req.json();

    // Verify the request with a secret token (recommended in production)
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    const token = req.headers.get("x-webhook-token");

    if (webhookSecret && token !== webhookSecret) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Check if it's a dictionary document
    if (body._type === "dictionary") {
      const locale = body.locale;

      // Revalidate the specific locale dictionary
      if (locale && locales.includes(locale)) {
        revalidateTag(`dictionary-${locale}`);

        return NextResponse.json({
          revalidated: true,
          message: `Revalidated dictionary for locale: ${locale}`,
        });
      }

      // If no locale specified or invalid locale, revalidate all dictionaries
      locales.forEach((loc) => {
        revalidateTag(`dictionary-${loc}`);
      });

      return NextResponse.json({
        revalidated: true,
        message: "Revalidated all dictionaries",
      });
    }

    return NextResponse.json({
      message: "Not a dictionary document, no revalidation performed",
    });
  } catch (error) {
    console.error("Error revalidating dictionary:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 },
    );
  }
}
