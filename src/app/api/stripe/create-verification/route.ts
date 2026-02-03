import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { 
        error: 'Stripe not configured',
        message: 'Identity verification is not yet available. Join the waitlist to be notified when it launches.'
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { userId, agentName } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Create Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: userId,
        agent_name: agentName || 'unknown',
        platform: 'cloudforge',
      },
      options: {
        document: {
          allowed_types: ['driving_license', 'passport', 'id_card'],
          require_matching_selfie: true,
          require_live_capture: true,
        },
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/complete`,
    });

    // Store verification session in database
    await pool.query(
      `INSERT INTO verifications (user_id, stripe_verification_id, status)
       VALUES ($1, $2, 'pending')
       ON CONFLICT (stripe_verification_id) DO NOTHING`,
      [userId, verificationSession.id]
    );

    return NextResponse.json({
      sessionId: verificationSession.id,
      clientSecret: verificationSession.client_secret,
      url: verificationSession.url,
    });

  } catch (error) {
    console.error('Stripe verification error:', error);
    return NextResponse.json(
      { error: 'Failed to create verification session' },
      { status: 500 }
    );
  }
}
