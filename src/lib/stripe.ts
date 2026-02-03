import Stripe from 'stripe';

// Initialize Stripe with secret key
// Keys will be added to .env.local when HD sets up Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// Helper to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && 
    process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder'
  );
}
