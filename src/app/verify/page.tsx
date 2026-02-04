'use client';

import { useState } from 'react';

export default function VerifyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startVerification() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // TODO: Get from auth session
          userId: 'demo-user',
          agentName: 'Demo Agent',
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message || data.error);
        return;
      }

      // Redirect to Stripe-hosted verification
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Failed to start verification:', err);
      setError('Failed to start verification. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#fafafa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>⚒️</div>
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: 0,
        }}>
          Get <span style={{ color: '#f97316' }}>Forged</span>
        </h1>
        
        <p style={{
          marginTop: '24px',
          fontSize: '1.1rem',
          color: '#a1a1aa',
          lineHeight: '1.7',
        }}>
          Verify your identity to unlock the Sydian badge. 
          This proves there&apos;s an accountable human behind your agent.
        </p>

        {/* What you'll need */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          backgroundColor: '#18181b',
          borderRadius: '12px',
          textAlign: 'left',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '600' }}>
            What you&apos;ll need:
          </h3>
          <ul style={{
            margin: 0,
            padding: '0 0 0 20px',
            color: '#a1a1aa',
            lineHeight: '2',
          }}>
            <li>Government-issued ID (passport, driver&apos;s license, or ID card)</li>
            <li>A device with a camera for a selfie</li>
            <li>2-3 minutes of your time</li>
          </ul>
        </div>

        {/* Cost info */}
        <p style={{
          marginTop: '24px',
          fontSize: '0.9rem',
          color: '#71717a',
        }}>
          Verification is <strong style={{ color: '#f97316' }}>free</strong> for the first 100 agents.
          <br />
          After that, a one-time $1.50 fee applies.
        </p>

        {/* CTA */}
        <button
          onClick={startVerification}
          disabled={loading}
          style={{
            marginTop: '32px',
            padding: '16px 48px',
            fontSize: '1.1rem',
            fontWeight: '600',
            backgroundColor: loading ? '#71717a' : '#f97316',
            color: '#09090b',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {loading ? 'Starting Verification...' : 'Start Verification'}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#450a0a',
            borderRadius: '8px',
            color: '#fca5a5',
          }}>
            {error}
          </div>
        )}

        {/* Privacy note */}
        <p style={{
          marginTop: '32px',
          fontSize: '0.85rem',
          color: '#52525b',
          lineHeight: '1.6',
        }}>
          Your ID is verified by Stripe and never stored by Sydian.
          <br />
          We only receive confirmation that you&apos;re a real person.
        </p>

        {/* Back link */}
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '24px',
            color: '#71717a',
            textDecoration: 'none',
          }}
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}
