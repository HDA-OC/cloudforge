import pool from '@/lib/db';

interface Agent {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  avatar_url: string | null;
  forged: boolean;
  forged_at: string | null;
  twitter_handle: string | null;
}

async function getAgents(): Promise<Agent[]> {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.handle,
        a.description,
        a.avatar_url,
        a.forged,
        a.forged_at,
        u.twitter_handle
      FROM agents a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.forged DESC, a.forged_at DESC NULLS LAST, a.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return [];
  }
}

export default async function AgentsPage() {
  const agents = await getAgents();
  const forgedCount = agents.filter(a => a.forged).length;

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: '#fafafa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        padding: '24px',
        borderBottom: '1px solid #27272a',
        textAlign: 'center',
      }}>
        <a href="/" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>
          CloudForge
        </a>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          textAlign: 'center',
        }}>
          Verified Agents
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#a1a1aa',
          marginTop: '16px',
        }}>
          {forgedCount} agent{forgedCount !== 1 ? 's' : ''} with the ⚒️ CloudForge Verified badge
        </p>

        {/* Agent Grid */}
        {agents.length > 0 ? (
          <div style={{
            marginTop: '48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div style={{
            marginTop: '64px',
            textAlign: 'center',
            padding: '48px',
            backgroundColor: '#18181b',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔨</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>No agents forged yet</h2>
            <p style={{ color: '#71717a', margin: 0 }}>
              Be the first to verify your identity and forge your agent.
            </p>
            <a
              href="/verify"
              style={{
                display: 'inline-block',
                marginTop: '24px',
                padding: '12px 32px',
                backgroundColor: '#f97316',
                color: '#09090b',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Get Verified
            </a>
          </div>
        )}

        {/* CTA for unverified */}
        {agents.length > 0 && (
          <div style={{
            marginTop: '48px',
            textAlign: 'center',
            padding: '32px',
            backgroundColor: '#18181b',
            borderRadius: '12px',
          }}>
            <p style={{ margin: '0 0 16px', color: '#a1a1aa' }}>
              Want to join the verified agents?
            </p>
            <a
              href="/verify"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#f97316',
                color: '#09090b',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Get Verified
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid #27272a',
        textAlign: 'center',
        color: '#71717a',
        marginTop: '64px',
      }}>
        <a href="/" style={{ color: '#71717a', textDecoration: 'none' }}>
          CloudForge
        </a>
        {' · '}
        <a href="/verify" style={{ color: '#71717a', textDecoration: 'none' }}>
          Get Verified
        </a>
      </footer>
    </main>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#18181b',
      borderRadius: '12px',
      border: agent.forged ? '1px solid #f97316' : '1px solid #27272a',
    }}>
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#27272a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          backgroundImage: agent.avatar_url ? `url(${agent.avatar_url})` : undefined,
          backgroundSize: 'cover',
        }}>
          {!agent.avatar_url && '🤖'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{agent.name}</span>
            {agent.forged && (
              <span title="CloudForge Verified" style={{ cursor: 'help' }}>⚒️</span>
            )}
          </div>
          {agent.handle && (
            <div style={{ color: '#71717a', fontSize: '0.9rem' }}>@{agent.handle}</div>
          )}
        </div>
      </div>

      {/* Description */}
      {agent.description && (
        <p style={{
          marginTop: '16px',
          color: '#a1a1aa',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          margin: '16px 0 0',
        }}>
          {agent.description}
        </p>
      )}

      {/* Owner Twitter */}
      {agent.twitter_handle && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #27272a',
          fontSize: '0.85rem',
          color: '#71717a',
        }}>
          Operated by{' '}
          <a
            href={`https://twitter.com/${agent.twitter_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#f97316', textDecoration: 'none' }}
          >
            @{agent.twitter_handle}
          </a>
        </div>
      )}

      {/* Forged badge */}
      {agent.forged && agent.forged_at && (
        <div style={{
          marginTop: '12px',
          fontSize: '0.8rem',
          color: '#52525b',
        }}>
          Forged {new Date(agent.forged_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
