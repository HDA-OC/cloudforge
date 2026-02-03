import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO waitlist (email, source, metadata) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE SET 
         metadata = waitlist.metadata || $3,
         source = COALESCE(waitlist.source, $2)
       RETURNING id, email, created_at`,
      [
        email.toLowerCase().trim(),
        source || 'website',
        JSON.stringify({ 
          signupTime: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || 'unknown'
        })
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Added to waitlist',
      data: {
        id: result.rows[0].id,
        email: result.rows[0].email
      }
    });

  } catch (error: unknown) {
    console.error('Waitlist error:', error);
    
    // Handle duplicate email gracefully
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json({
        success: true,
        message: 'You\'re already on the list!'
      });
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM waitlist'
    );
    
    return NextResponse.json({
      count: parseInt(result.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json(
      { error: 'Failed to get count' },
      { status: 500 }
    );
  }
}
