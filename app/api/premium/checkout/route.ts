import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { corsJson, corsOptions } from "@/lib/cors";
import { resolveQuoteRequest, QuoteRequestError } from "@/lib/quote-request";
import { getStripe, getReturnUrls } from "@/lib/stripe";
import { computeQuote } from "@/src/models/Quote";
import { PurchaseModel } from "@/src/models/Purchase";

/**
 * Ouverture d'un paiement Stripe Checkout (story 3.4).
 *
 * 🚨 Le client envoie une SÉLECTION, jamais un montant. Le total est recalculé ici par
 * `computeQuote` — le même moteur que le devis public. Si le prix venait du body,
 * n'importe qui paierait 1 centime pour devenir premium.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) return corsJson({ error: "Unauthorized" }, { status: 401 });
    const userId = parseInt(auth.userId);

    const stripe = getStripe();
    // Pas de clé = pas d'encaissement. Jamais de mode dégradé qui rendrait premium sans payer.
    if (!stripe) return corsJson({ error: "Stripe not configured" }, { status: 503 });

    const body = await request.json();
    const { categories, subcategoryIds, packages, config } = await resolveQuoteRequest(body);
    const quote = computeQuote({ categories, subcategoryIds }, packages, config);

    // Tarifs seedés à 0 (décision story 3.1) : Stripe refuse une session à 0, et offrir le
    // premium serait pire. Échec explicite tant que l'admin n'a pas saisi les prix.
    if (quote.total_cents <= 0) {
      return corsJson(
        { error: "Pricing not configured: quote total is 0 — an admin must set the prices before selling" },
        { status: 422 }
      );
    }

    // Créé AVANT la session : le webhook ne peut jamais arriver avant l'existence de la ligne.
    const purchase = await PurchaseModel.create({
      userId,
      packageId: quote.package?.id ?? null,
      isCustom: quote.is_custom,
      amountCents: quote.total_cents,
      currency: quote.currency,
      quote,
    });

    const { successUrl, cancelUrl } = getReturnUrls();
    const label = quote.package?.name ?? "Package personnalisé Midzo";

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: String(userId),
        // Lu par le webhook pour retrouver l'achat sans dépendre d'un ordre d'écriture.
        metadata: { purchase_id: String(purchase.id), user_id: String(userId) },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: quote.currency.toLowerCase(),
              unit_amount: quote.total_cents,
              product_data: { name: label },
            },
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      await PurchaseModel.attachSession(purchase.id, session.id);

      return corsJson({
        success: true,
        checkout_url: session.url,
        session_id: session.id,
        purchase_id: purchase.id,
        quote,
      });
    } catch (stripeError: any) {
      // Session non créée : ne pas laisser un Purchase pending orphelin en base.
      await PurchaseModel.deleteIfPending(purchase.id);
      console.error("Stripe checkout session error:", stripeError);
      return corsJson({ error: `Stripe error: ${stripeError?.message ?? "unknown"}` }, { status: 502 });
    }
  } catch (error) {
    if (error instanceof QuoteRequestError) {
      return corsJson({ error: error.message }, { status: error.status });
    }
    console.error("Premium checkout error:", error);
    return corsJson({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsOptions("POST, OPTIONS");
}
