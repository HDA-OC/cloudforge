import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import pool from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'identity.verification_session.verified': {
        const session = event.data.object as Stripe.Identity.VerificationSession;
        
        console.log(`✅ Verification successful: ${session.id}`);
        
        // Update verification record
        await pool.query(
          `UPDATE verifications 
           SET status = 'verified', 
               verified_at = NOW(),
               evidence = $2,
               updated_at = NOW()
           WHERE stripe_verification_id = $1`,
          [
            session.id,
            JSON.stringify({
              verified_at: new Date().toISOString(),
              // Don't store PII - just confirmation that verification happened
            })
          ]
        );

        // Get the user_id from verification record and update agent
        const verificationResult = await pool.query(
          'SELECT user_id FROM verifications WHERE stripe_verification_id = $1',
          [session.id]
        );

        if (verificationResult.rows.length > 0) {
          const userId = verificationResult.rows[0].user_id;
          
          // Mark any agents for this user as forged
          await pool.query(
            `UPDATE agents 
             SET forged = TRUE, 
                 forged_at = NOW(),
                 verification_id = (
                   SELECT id FROM verifications WHERE stripe_verification_id = $1
                 ),
                 updated_at = NOW()
             WHERE user_id = $2 AND forged = FALSE`,
            [session.id, userId]
          );
        }

        break;
      }

      case 'identity.verification_session.requires_input': {
        const session = event.data.object as Stripe.Identity.VerificationSession;
        
        console.log(`⚠️ Verification needs input: ${session.id}`, session.last_error?.code);
        
        await pool.query(
          `UPDATE verifications 
           SET status = 'requires_input',
               evidence = evidence || $2,
               updated_at = NOW()
           WHERE stripe_verification_id = $1`,
          [
            session.id,
            JSON.stringify({
              error_code: session.last_error?.code,
              error_reason: session.last_error?.reason,
              updated_at: new Date().toISOString(),
            })
          ]
        );

        break;
      }

      case 'identity.verification_session.canceled': {
        const session = event.data.object as Stripe.Identity.VerificationSession;
        
        console.log(`❌ Verification canceled: ${session.id}`);
        
        await pool.query(
          `UPDATE verifications 
           SET status = 'canceled',
               updated_at = NOW()
           WHERE stripe_verification_id = $1`,
          [session.id]
        );

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Still return 200 to acknowledge receipt
  }

  return NextResponse.json({ received: true });
}
