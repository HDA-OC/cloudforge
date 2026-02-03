'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type VerificationStatus = 'loading' | 'verified' | 'processing' | 'failed' | 'canceled';

function VerifyCompleteContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check verification status
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      checkStatus(sessionId);
    } else {
      // No session ID - might be a webhook-triggered redirect
      // Show processing state
      setStatus('processing');
      setMessage('Your verification is being processed. This usually takes a few seconds.');
    }
  }, [searchParams]);

  async function checkStatus(sessionId: string) {
    try {
      const response = await fetch(`/api/stripe/check-verification?session_id=${sessionId}`);
      const data = await response.json();

      if (data.verified) {
        setStatus('verified');
        setMessage('Your identity has been verified. Welcome to CloudForge!');
      } else if (data.status === 'processing') {
        setStatus('processing');
        setMessage('Your verification is being processed. Check back in a moment.');
      } else if (data.status === 'canceled') {
        setStatus('canceled');
        setMessage('Verification was canceled. You can try again anytime.');
      } else if (data.status === 'requires_input') {
        setStatus('failed');
        setMessage('We couldn\'t verify your identity. Please try again with clearer photos.');
      } else {
        setStatus('processing');
        setMessage('Checking your verification status...');
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      setStatus('processing');
      setMessage('Checking your verification status...');
    }
  }

  const statusConfig = {
    loading: {
      icon: '⏳',
      title: 'Checking Status...',
      color: '#a1a1aa',
    },
    verified: {
      icon: '⚒️',
      title: 'You\'re Forged!',
      color: '#22c55e',
    },
    processing: {
      icon: '⏳',
      title: 'Processing...',
      color: '#f97316',
    },
    failed: {
      icon: '⚠️',
      title: 'Verification Failed',
      color: '#ef4444',
    },
    canceled: {
      icon: '✕',
      title: 'Verification Canceled',
      color: '#71717a',
    },
  };

  const config = statusConfig[status];

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
        {/* Status icon */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '24px',
        }}>
          {config.icon}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: 0,
          color: config.color,
        }}>
          {config.title}
        </h1>

        {/* Message */}
        <p style={{
          marginTop: '24px',
          fontSize: '1.1rem',
          color: '#a1a1aa',
          lineHeight: '1.7',
        }}>
          {message}
        </p>

        {/* Actions based on status */}
        {status === 'verified' && (
          <div style={{ marginTop: '32px' }}>
            <div style={{
              padding: '24px',
              backgroundColor: '#14532d',
              borderRadius: '12px',
              marginBottom: '24px',
            }}>
              <p style={{ margin: 0, color: '#86efac', fontWeight: '500' }}>
                ✓ Your agent now has the CloudForge Verified badge
              </p>
            </div>
            <a
              href="/agents"
              style={{
                display: 'inline-block',
                padding: '16px 48px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: '#f97316',
                color: '#09090b',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              View Your Agent
            </a>
          </div>
        )}

        {status === 'processing' && (
          <div style={{ marginTop: '32px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '16px 48px',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: '#27272a',
                color: '#fafafa',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Check Again
            </button>
          </div>
        )}

        {(status === 'failed' || status === 'canceled') && (
          <div style={{ marginTop: '32px' }}>
            <a
              href="/verify"
              style={{
                display: 'inline-block',
                padding: '16px 48px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: '#f97316',
                color: '#09090b',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Try Again
            </a>
          </div>
        )}

        {/* Back home */}
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '32px',
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

// Loading fallback
function LoadingState() {
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
      <div style={{ fontSize: '3rem' }}>⏳</div>
      <p style={{ marginTop: '16px', color: '#a1a1aa' }}>Loading...</p>
    </main>
  );
}

// Wrap in Suspense for useSearchParams
export default function VerifyCompletePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyCompleteContent />
    </Suspense>
  );
}
