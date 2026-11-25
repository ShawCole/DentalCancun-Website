import "server-only";
import Stripe from "stripe";

/** Online deposits with Stripe Checkout. Env: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET. */
let client: Stripe | null | undefined;
export function stripe(): Stripe | null {
    if (client !== undefined) return client;
    const key = process.env.STRIPE_SECRET_KEY;
    return (client = key ? new Stripe(key) : null);
}
export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
