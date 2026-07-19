import Stripe from "stripe";

let client: Stripe | null = null;

/**
 * Client Stripe (story 3.4).
 *
 * Renvoie `null` si STRIPE_SECRET_KEY est absente, au lieu de jeter au chargement :
 * un throw ici ferait tomber toute l'app (le module est importé par les routes),
 * alors que seules les routes de paiement sont concernées. Elles répondent 503.
 *
 * ⚠️ Jamais de mode dégradé : sans clé, on n'encaisse pas — et on ne rend pas premium.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

export function getWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET || null;
}

/** URLs de retour navigateur — repli sur FRONTEND_URL (déjà utilisé par les emails). */
export function getReturnUrls() {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  return {
    successUrl: process.env.STRIPE_SUCCESS_URL || `${frontend}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: process.env.STRIPE_CANCEL_URL || `${frontend}/premium/cancel`,
  };
}
