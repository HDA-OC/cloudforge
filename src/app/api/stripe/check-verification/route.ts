import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  const userId = request.nextUrl.searchParams.get('user_id');

  // Check by session ID
  if (sessionId) {
    // First check our database
    const dbResult = await pool.query(
      'SELECT * FROM verifications WHERE stripe_verification_id = $1',
      [sessionId]
    );

    if (dbResult.rows.length > 0) {
      const verification = dbResult.rows[0];
      return NextResponse.json({
        status: verification.status,
        verified: verification.status === 'verified',
        verifiedAt: verification.verified_at,
      });
    }

    // If not in DB and Stripe is configured, check Stripe
    if (isStripeConfigured()) {
      try {
        const session = await stripe.identity.verificationSessions.retrieve(sessionId);
        return NextResponse.json({
          status: session.status,
          verified: session.status === 'verified',
        });
      } catch {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Check by user ID
  if (userId) {
    const result = await pool.query(
      `SELECT v.*, a.name as agent_name, a.handle as agent_handle
       FROM verifications v
       LEFT JOIN agents a ON a.verification_id = v.id
       WHERE v.user_id = $1
       ORDER BY v.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length > 0) {
      const verification = result.rows[0];
      return NextResponse.json({
        status: verification.status,
        verified: verification.status === 'verified',
        verifiedAt: verification.verified_at,
        agentName: verification.agent_name,
        agentHandle: verification.agent_handle,
      });
    }

    return NextResponse.json({
      status: 'none',
      verified: false,
      message: 'No verification found for this user',
    });
  }

  return NextResponse.json(
    { error: 'session_id or user_id required' },
    { status: 400 }
  );
}
