'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Compte démo — accès rapide sans Supabase
const DEMO_ACCOUNT = {
  email: 'demo@ina-sante.ci',
  password: 'Demo@2026',
  fullName: 'Dr. Koné Aminata',
  specialty: 'Psychologue clinicienne',
};

export default function SpecialistLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setError('');

    // ── Compte démo (accès sans Supabase) ─────────────────────────────────
    if (
      email.trim().toLowerCase() === DEMO_ACCOUNT.email &&
      password === DEMO_ACCOUNT.password
    ) {
      localStorage.setItem('ina_specialist_demo', JSON.stringify({
        id: 'demo',
        full_name: DEMO_ACCOUNT.fullName,
        email: DEMO_ACCOUNT.email,
        specialty: DEMO_ACCOUNT.specialty,
      }));
      router.push('/specialist/dashboard');
      return;
    }

    // ── Connexion Supabase (compte réel) ──────────────────────────────────
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError || !data.user) {
        setError('Email ou mot de passe incorrect.');
        setLoading(false);
        return;
      }

      const { data: specialist, error: spError } = await supabase
        .from('specialists')
        .select('id, full_name')
        .eq('id', data.user.id)
        .single();

      if (spError || !specialist) {
        setError("Accès réservé aux spécialistes INA. Contactez l'administration.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push('/specialist/dashboard');
    } catch {
      setError('Erreur de connexion. Utilisez le compte démo pour tester.');
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A3870 0%, #0f2454 50%, #1A3870 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Cercles décoratifs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'rgba(232,118,30,0.12)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-60px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'rgba(232,118,30,0.08)', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '20px',
        padding: '44px 40px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: '#E8761E',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(232,118,30,0.35)',
          }}>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#fff', letterSpacing: '-0.5px' }}>INA</span>
          </div>
          <h1 style={{
            fontSize: '22px', fontWeight: 700, color: '#1A3870',
            letterSpacing: '-0.4px', marginBottom: '6px',
          }}>
            Espace Spécialiste
          </h1>
          <p style={{ fontSize: '13.5px', color: '#5A6888', fontWeight: 400 }}>
            Plateforme de suivi des patients assistée par IA
          </p>
        </div>

        {/* Badge */}
        <div style={{
          background: '#EBF0FB', border: '1px solid rgba(26,56,112,0.15)',
          borderRadius: '8px', padding: '9px 14px',
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '28px',
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#1A3870" strokeWidth="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span style={{ fontSize: '12px', color: '#1A3870', fontWeight: 600 }}>
            Accès réservé aux professionnels de santé mentale
          </span>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E2D4E', marginBottom: '7px' }}>
              Adresse email professionnelle
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#F4F7FE', border: '1.5px solid #DDE3EF',
              borderRadius: '10px', padding: '0 14px',
              transition: 'border-color 0.2s',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9AAABB" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ex: docteur@clinique.ci"
                style={{
                  flex: 1, border: 'none', background: 'none', outline: 'none',
                  fontSize: '13.5px', color: '#1E2D4E', height: '46px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E2D4E', marginBottom: '7px' }}>
              Mot de passe
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#F4F7FE', border: '1.5px solid #DDE3EF',
              borderRadius: '10px', padding: '0 14px',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9AAABB" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  flex: 1, border: 'none', background: 'none', outline: 'none',
                  fontSize: '13.5px', color: '#1E2D4E', height: '46px',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9AAABB" strokeWidth="2">
                  {showPassword
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '8px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '16px',
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: '12.5px', color: '#DC2626', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#8BAED4' : '#1A3870',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s, transform 0.1s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Séparateur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#EEF1F8' }} />
          <span style={{ fontSize: '11px', color: '#9AAABB', fontWeight: 600, whiteSpace: 'nowrap' }}>OU ACCÈS RAPIDE</span>
          <div style={{ flex: 1, height: '1px', background: '#EEF1F8' }} />
        </div>

        {/* Carte compte démo */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF3EA 0%, #FFF8F2 100%)',
          border: '1.5px dashed rgba(232,118,30,0.4)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '28px', height: '28px', background: '#E8761E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A3870' }}>Compte démo</div>
              <div style={{ fontSize: '11px', color: '#5A6888' }}>Accès immédiat sans configuration</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {[
              { label: 'Email', value: DEMO_ACCOUNT.email },
              { label: 'Mot de passe', value: DEMO_ACCOUNT.password },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.7)', borderRadius: '7px', padding: '7px 10px' }}>
                <span style={{ fontSize: '11px', color: '#9AAABB', fontWeight: 600, width: '80px', flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E2D4E', fontFamily: 'monospace', letterSpacing: '0.3px' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={loginAsDemo}
            style={{
              width: '100%', background: '#E8761E', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '11px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Remplir et se connecter
          </button>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid #EEF1F8', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9AAABB' }}>
            Problème de connexion ?{' '}
            <span style={{ color: '#E8761E', fontWeight: 600, cursor: 'pointer' }}>
              Contacter l&apos;administration INA
            </span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
