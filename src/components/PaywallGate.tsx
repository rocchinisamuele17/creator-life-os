import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

interface PaywallGateProps {
  children: React.ReactNode;
  feature: string;
  inline?: boolean;
}

export function PaywallGate({ children, feature, inline = false }: PaywallGateProps) {
  const { canUse, loading } = useSubscription();

  if (loading) return null;

  if (canUse(feature)) {
    return <>{children}</>;
  }

  if (inline) {
    return (
      <div style={{ 
        padding: '12px', 
        background: 'rgba(0,240,255,0.05)', 
        borderRadius: '8px', 
        border: '1px dashed var(--accent-color)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <span>🔒 Questa funzione AI richiede il piano Pro</span>
        <Link to="/pricing" style={{ color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none' }}>Upgrade</Link>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
      <div style={{ filter: 'blur(8px)', pointerEvents: 'none', opacity: 0.5 }}>
        {children}
      </div>
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'rgba(0,0,0,0.4)',
        textAlign: 'center',
        padding: '20px',
        zIndex: 10
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👑</div>
        <h4 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Funzione Premium</h4>
        <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: '240px' }}>
          Passa a Pro per sbloccare questa funzionalità e potenziare il tuo business.
        </p>
        <Link to="/pricing">
          <button className="premium-btn primary" style={{ padding: '10px 24px' }}>Sblocca Ora</button>
        </Link>
      </div>
    </div>
  );
}
