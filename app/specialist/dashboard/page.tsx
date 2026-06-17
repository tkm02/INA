'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Specialist, SpecialistPatient, MoodEntry, JournalEntry, DiagnosticResult, FollowUpItem } from '@/lib/supabase';

// ─── Types locaux ─────────────────────────────────────────────────────────────

type PatientRow = {
  id: string;
  initials: string;
  name: string;
  age: number;
  gender: string;
  color: string;
  status: 'active' | 'warning' | 'new';
  diagnosis: string;
  nextAppt: string;
};

type AiMessage = {
  role: 'ai' | 'user';
  text: string;
  time: string;
};

// ─── Données de démo (affichées si aucune donnée Supabase) ───────────────────

const DEMO_PATIENTS: PatientRow[] = [
  { id: 'demo-1', initials: 'MF', name: 'Mamadou Fofana', age: 28, gender: 'Homme', color: '#1A3870', status: 'active', diagnosis: 'Anxiété généralisée', nextAppt: 'RDV dans 3 jours' },
  { id: 'demo-2', initials: 'AF', name: 'Aminata Fall', age: 34, gender: 'Femme', color: '#7C3AED', status: 'warning', diagnosis: 'Dépression légère', nextAppt: 'RDV demain' },
  { id: 'demo-3', initials: 'KB', name: 'Khadija Bah', age: 22, gender: 'Femme', color: '#059669', status: 'active', diagnosis: 'Gestion du stress', nextAppt: 'RDV dans 7 jours' },
  { id: 'demo-4', initials: 'SD', name: 'Seydou Diallo', age: 45, gender: 'Homme', color: '#D97706', status: 'new', diagnosis: 'Traumatisme', nextAppt: '1er RDV prévu' },
  { id: 'demo-5', initials: 'FT', name: 'Fatou Touré', age: 31, gender: 'Femme', color: '#DB2777', status: 'active', diagnosis: 'Burnout professionnel', nextAppt: 'RDV dans 5 jours' },
];

const DEMO_MOODS: Record<string, number[]> = {
  'demo-1': [5, 7, 6, 8, 7, 4, 7],
  'demo-2': [4, 5, 6, 5, 4, 3, 5],
  'demo-3': [7, 8, 9, 8, 9, 8, 8],
  'demo-4': [3, 4, 3, 5, 4, 3, 4],
  'demo-5': [6, 7, 8, 7, 8, 9, 8],
};

const DEMO_JOURNAL: JournalEntry[] = [
  { id: 'j1', user_id: 'demo-1', title: 'Séance de respiration', description: 'Bien', content: "Aujourd'hui j'ai essayé la technique de respiration 4-7-8 avant ma réunion de travail. Je me suis senti beaucoup plus calme. La journée s'est bien passée même si j'ai eu quelques pics d'anxiété vers 14h.", images: [], created_at: '2026-06-17T09:00:00Z', updated_at: '2026-06-17T09:00:00Z', mood_level: 3, mood_label: 'Bien' } as unknown as JournalEntry,
  { id: 'j2', user_id: 'demo-1', title: 'Nuit difficile', description: 'Difficile', content: "Nuit difficile, pensées envahissantes. J'ai du mal à me projeter dans la semaine. Mon chef a fait une remarque en réunion et j'ai ressenti une bouffée d'anxiété intense.", images: [], created_at: '2026-06-15T08:00:00Z', updated_at: '2026-06-15T08:00:00Z', mood_level: 1, mood_label: 'Difficile' } as unknown as JournalEntry,
  { id: 'j3', user_id: 'demo-1', title: 'Journée correcte', description: 'Moyen', content: "Journée correcte. J'ai réussi à faire ma marche de 30 min le matin. Quelques tensions avec ma famille mais je les ai gérées mieux qu'avant.", images: [], created_at: '2026-06-13T10:00:00Z', updated_at: '2026-06-13T10:00:00Z', mood_level: 2, mood_label: 'Moyen' } as unknown as JournalEntry,
];

const DEMO_DIAGNOSTICS = [
  { id: 'd1', user_id: 'demo-1', tool_id: 'phq9', tool_name: 'PHQ-9 (Dépression)', score: 8, max_score: 27, prev_score: 11, interpretation: 'Léger', created_at: '2026-06-15T00:00:00Z' },
  { id: 'd2', user_id: 'demo-1', tool_id: 'gad7', tool_name: 'GAD-7 (Anxiété)', score: 12, max_score: 21, prev_score: 15, interpretation: 'Modéré', created_at: '2026-06-15T00:00:00Z' },
  { id: 'd3', user_id: 'demo-1', tool_id: 'psq', tool_name: 'PSQ (Stress perçu)', score: 54, max_score: 100, prev_score: 68, interpretation: 'Élevé', created_at: '2026-06-10T00:00:00Z' },
];

const DEMO_CHAT_SESSIONS = [
  {
    date: '17 Juin 2026',
    messages: [
      { role: 'ai' as const, text: "Bonjour ! Comment vous sentez-vous aujourd'hui ?", time: '09:02' },
      { role: 'user' as const, text: "Pas trop bien ce matin. J'ai encore eu du mal à dormir.", time: '09:04' },
      { role: 'ai' as const, text: "Je suis désolé d'apprendre ça. Depuis combien de nuits avez-vous des difficultés de sommeil ?", time: '09:04' },
      { role: 'user' as const, text: "Depuis 3 jours environ. C'est les pensées qui tournent en boucle la nuit.", time: '09:06' },
      { role: 'ai' as const, text: "Je comprends. Souhaitez-vous essayer l'exercice de respiration 4-7-8 recommandé par le Dr. Koné ?", time: '09:07' },
    ]
  },
  {
    date: '12 Juin 2026',
    messages: [
      { role: 'ai' as const, text: "Comment s'est passée votre journée ?", time: '18:30' },
      { role: 'user' as const, text: "Mieux qu'hier ! J'ai utilisé la technique de respiration avant ma réunion.", time: '18:32' },
      { role: 'ai' as const, text: "Excellent ! C'est une belle progression. Je vais noter cela dans votre dossier.", time: '18:32' },
    ]
  },
];

const DEMO_PLAN: FollowUpItem[] = [
  { id: 'p1', specialist_id: '', patient_id: 'demo-1', label: 'Évaluation initiale PHQ-9 & GAD-7', description: 'Scores de référence établis', scheduled_date: '2026-04-10', completed: true, created_at: '' },
  { id: 'p2', specialist_id: '', patient_id: 'demo-1', label: "Partage module : Gestion de l'anxiété", description: 'Via chatbot INA — 3 sessions complétées', scheduled_date: '2026-05-20', completed: true, created_at: '' },
  { id: 'p3', specialist_id: '', patient_id: 'demo-1', label: 'Suivi hebdo — Mois 1', description: '4 séances de 50 min effectuées', scheduled_date: null, completed: true, created_at: '' },
  { id: 'p4', specialist_id: '', patient_id: 'demo-1', label: 'Réévaluation PHQ-9 & GAD-7', description: 'Comparaison avec les scores initiaux', scheduled_date: '2026-06-25', completed: false, created_at: '' },
  { id: 'p5', specialist_id: '', patient_id: 'demo-1', label: 'Partage module : Pleine conscience avancée', description: "Nouveau module à activer dans l'app", scheduled_date: '2026-07-01', completed: false, created_at: '' },
  { id: 'p6', specialist_id: '', patient_id: 'demo-1', label: 'Bilan de mi-parcours', description: 'Révision du plan de suivi avec le patient', scheduled_date: '2026-07-15', completed: false, created_at: '' },
];

const WEEK_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function moodColor(v: number) {
  return v >= 7 ? '#12B76A' : v >= 5 ? '#F59E0B' : '#EF4444';
}

function sevClass(interp: string | null) {
  if (!interp) return 'sp-sev-m';
  if (interp === 'Élevé') return 'sp-sev-h';
  if (interp === 'Modéré') return 'sp-sev-m';
  return 'sp-sev-l';
}

function diagColor(toolId: string) {
  return toolId === 'phq9' ? '#F59E0B' : toolId === 'gad7' ? '#E8761E' : '#7C3AED';
}

function diagBg(toolId: string) {
  return toolId === 'phq9' ? '#FFFBEB' : toolId === 'gad7' ? '#FFF3EA' : '#F5F3FF';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function SpecialistDashboard() {
  const router = useRouter();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [current, setCurrent] = useState<PatientRow | null>(null);
  const [activeTab, setActiveTab] = useState<'humeurs' | 'journal' | 'diagnostics' | 'chatbot' | 'plan'>('humeurs');
  const [moods, setMoods] = useState<number[]>([]);
  const [journals, setJournals] = useState<(JournalEntry & { mood_label?: string; mood_level?: number })[]>([]);
  const [diagnostics, setDiagnostics] = useState<(DiagnosticResult & { prev_score?: number })[]>([]);
  const [planItems, setPlanItems] = useState<FollowUpItem[]>([]);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const aiEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auth check ─────────────────────────────────────────────────────────────

  useEffect(() => {
    async function checkAuth() {
      // 1. Vérifier session démo (localStorage)
      const demoRaw = localStorage.getItem('ina_specialist_demo');
      if (demoRaw) {
        try {
          const demo = JSON.parse(demoRaw) as Specialist;
          setSpecialist(demo);
          setPatients(DEMO_PATIENTS);
          selectPatient(DEMO_PATIENTS[0]);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('ina_specialist_demo');
        }
      }

      // 2. Vérifier session Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/specialist/login'); return; }

      const { data: sp } = await supabase
        .from('specialists')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!sp) { router.push('/specialist/login'); return; }
      setSpecialist(sp as Specialist);
      await loadPatients(session.user.id);
      setLoading(false);
    }
    checkAuth();
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Charger les patients ────────────────────────────────────────────────────

  async function loadPatients(specialistId: string) {
    const { data, error } = await supabase
      .from('specialist_patients')
      .select('*, profiles(*)')
      .eq('specialist_id', specialistId)
      .neq('status', 'archived')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      setPatients(DEMO_PATIENTS);
      selectPatient(DEMO_PATIENTS[0]);
      return;
    }

    const colors = ['#1A3870', '#7C3AED', '#059669', '#D97706', '#DB2777', '#0891B2', '#DC2626'];
    const rows: PatientRow[] = (data as SpecialistPatient[]).map((sp, i) => ({
      id: sp.patient_id,
      initials: getInitials(sp.profiles.full_name || '??'),
      name: sp.profiles.full_name || 'Patient inconnu',
      age: 0,
      gender: '',
      color: colors[i % colors.length],
      status: (sp.status === 'archived' ? 'active' : sp.status) as 'active' | 'warning' | 'new',
      diagnosis: sp.diagnosis || 'Suivi général',
      nextAppt: sp.next_appointment
        ? `RDV le ${formatDate(sp.next_appointment)}`
        : 'Aucun RDV prévu',
    }));

    setPatients(rows);
    selectPatient(rows[0]);
  }

  // ── Sélectionner un patient ────────────────────────────────────────────────

  const selectPatient = useCallback(async (p: PatientRow) => {
    setCurrent(p);
    setActiveTab('humeurs');

    const isDemo = p.id.startsWith('demo-');

    if (isDemo) {
      setMoods(DEMO_MOODS[p.id] || [5, 6, 7, 6, 5, 6, 7]);
      setJournals(DEMO_JOURNAL);
      setDiagnostics(DEMO_DIAGNOSTICS as typeof diagnostics);
      setPlanItems(DEMO_PLAN);
    } else {
      await Promise.all([
        loadMoods(p.id),
        loadJournals(p.id),
        loadDiagnostics(p.id),
        loadPlan(p.id),
      ]);
    }

    initAIChat(p);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadMoods(patientId: string) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data } = await supabase
      .from('moods')
      .select('level')
      .eq('user_id', patientId)
      .gte('created_at', sevenDaysAgo)
      .order('created_at')
      .limit(7);

    const levels = (data || []).map((m: { level: number }) => {
      const scale = 4 - m.level;
      return Math.round(1 + scale * (9 / 4));
    });
    while (levels.length < 7) levels.unshift(5);
    setMoods(levels.slice(-7));
  }

  async function loadJournals(patientId: string) {
    const { data } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', patientId)
      .order('created_at', { ascending: false })
      .limit(5);
    setJournals((data || []) as JournalEntry[]);
  }

  async function loadDiagnostics(patientId: string) {
    const { data } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', patientId)
      .order('created_at', { ascending: false })
      .limit(10);
    setDiagnostics((data || []) as DiagnosticResult[]);
  }

  async function loadPlan(patientId: string) {
    if (!specialist) return;
    const { data } = await supabase
      .from('follow_up_items')
      .select('*')
      .eq('specialist_id', specialist.id)
      .eq('patient_id', patientId)
      .order('created_at');
    setPlanItems((data || []) as FollowUpItem[]);
  }

  // ── IA chat ─────────────────────────────────────────────────────────────────

  function initAIChat(p: PatientRow) {
    setAiMessages([
      {
        role: 'ai',
        text: `Bonjour Dr. ${specialist?.full_name?.split(' ').pop() || 'Spécialiste'}. J'ai analysé le dossier de <strong>${p.name}</strong>. Que souhaitez-vous examiner ?`,
        time: now(),
      },
    ]);
  }

  async function sendAI(text: string) {
    if (!text.trim() || !current) return;
    const userMsg: AiMessage = { role: 'user', text, time: now() };
    setAiMessages(prev => [...prev, userMsg]);
    setAiTyping(true);

    try {
      const res = await fetch('/api/specialist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          patientContext: {
            name: current.name,
            age: current.age,
            gender: current.gender,
            diagnosis: current.diagnosis,
            moodWeek: moods,
            journalCount: journals.length,
            diagnostics: diagnostics.map(d => ({ name: d.tool_name, score: d.score, max: d.max_score, interpretation: d.interpretation })),
          },
        }),
      });
      const json = await res.json();
      setAiMessages(prev => [...prev, { role: 'ai', text: json.message || 'Désolé, une erreur est survenue.', time: now() }]);
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Erreur de connexion avec l\'assistant IA.', time: now() }]);
    } finally {
      setAiTyping(false);
    }
  }

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages, aiTyping]);

  async function togglePlan(item: FollowUpItem) {
    const updated = !item.completed;
    if (!item.id.startsWith('demo-') && specialist) {
      await supabase.from('follow_up_items').update({ completed: updated }).eq('id', item.id);
    }
    setPlanItems(prev => prev.map(p => p.id === item.id ? { ...p, completed: updated } : p));
  }

  async function handleLogout() {
    localStorage.removeItem('ina_specialist_demo');
    await supabase.auth.signOut().catch(() => {});
    router.push('/specialist/login');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDU
  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2F5FA', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: '#E8761E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'sp-spin 2s linear infinite' }}>
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>INA</span>
        </div>
        <p style={{ color: '#5A6888', fontSize: '13px' }}>Chargement du tableau de bord…</p>
      </div>
    </div>
  );

  const moodAvg = moods.length ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1) : '--';
  const specInitials = specialist ? getInitials(specialist.full_name) : 'SP';

  return (
    <div className="sp-root">
      {/* ── Topbar ────────────────────────────────────────────────────────── */}
      <header className="sp-topbar">
        <div className="sp-tl">
          <div className="sp-logo-badge">INA</div>
          <div>
            <div className="sp-logo-name">I&apos;M NOT ALONE</div>
            <div className="sp-logo-sub">Espace Spécialiste</div>
          </div>
        </div>

        <div className="sp-tsearch">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,.45)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Rechercher un patient…" />
        </div>

        <div className="sp-tactions">
          <div className="sp-ib">
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <div className="sp-ib">
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="sp-ndot" />
          </div>
          <div className="sp-av" onClick={handleLogout} title="Déconnexion">{specInitials}</div>
        </div>
      </header>

      <div className="sp-workspace">
        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="sp-sidebar">
          <nav className="sp-snav">
            {[
              { label: 'Tableau de bord', icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> },
              { label: 'Mes patients', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>, badge: patients.length },
              { label: 'Agenda', icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
              { label: 'Plans de suivi', icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></> },
            ].map((item, i) => (
              <div key={i} className={`sp-ni${i === 0 ? ' active' : ''}`}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
                {item.label}
                {item.badge && <span className="sp-nbadge">{item.badge}</span>}
              </div>
            ))}
          </nav>

          <div className="sp-ssec">Patients actifs</div>

          <ul className="sp-plist">
            {patients.map((p, i) => (
              <li
                key={p.id}
                className={`sp-pi${current?.id === p.id ? ' active' : ''}`}
                onClick={() => selectPatient(p)}
                style={{ animation: `sp-slideIn .3s ${i * 0.07}s both` }}
              >
                <div className="sp-pav" style={{ background: p.color }}>{p.initials}</div>
                <div className="sp-pinfo">
                  <div className="sp-pname">{p.name}</div>
                  <div className="sp-pmeta">{p.age > 0 ? `${p.age} ans · ` : ''}{p.diagnosis}</div>
                </div>
                <div className={`sp-pstatus ${p.status === 'active' ? 'sp-sa' : p.status === 'warning' ? 'sp-sw' : 'sp-sn'}`} />
              </li>
            ))}
          </ul>

          <div className="sp-sfooter">
            <div className="sp-drav">{specInitials}</div>
            <div>
              <div className="sp-drname">{specialist?.full_name || 'Spécialiste INA'}</div>
              <div className="sp-drrole">{specialist?.specialty || 'Psychologue clinicien(ne)'}</div>
            </div>
          </div>
        </aside>

        {/* ── Dossier patient ────────────────────────────────────────────────── */}
        {current && (
          <main className="sp-dossier">
            {/* En-tête */}
            <div className="sp-pheader">
              <div className="sp-phtop">
                <div className="sp-pbigav" style={{ background: current.color }}>{current.initials}</div>
                <div className="sp-ptitle">
                  <div className="sp-pfullname">{current.name}</div>
                  <div className="sp-ptags">
                    {current.age > 0 && <span className="sp-tag sp-tag-b">{current.age} ans · {current.gender}</span>}
                    <span className={`sp-tag ${current.status === 'new' ? 'sp-tag-a' : 'sp-tag-g'}`}>
                      {current.status === 'active' ? 'Plan actif' : current.status === 'warning' ? 'À surveiller' : 'Nouveau patient'}
                    </span>
                    <span className="sp-tag sp-tag-o">{current.diagnosis}</span>
                    <span className="sp-tag sp-tag-a">{current.nextAppt}</span>
                  </div>
                </div>
                <div className="sp-hactions">
                  <button className="sp-btn sp-btn-s">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.92z"/></svg>
                    Contacter
                  </button>
                  <button className="sp-btn sp-btn-o">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Plan de suivi
                  </button>
                </div>
              </div>

              {/* Scores */}
              <div className="sp-scorerow">
                {[
                  { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>, bg: '#EBF0FB', stroke: '#1A3870', val: moodAvg, lbl: 'Humeur moy. (7j)' },
                  { icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>, bg: '#EDFBF4', stroke: '#12B76A', val: journals.length, lbl: 'Entrées journal' },
                  { icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>, bg: '#FFFBEB', stroke: '#F59E0B', val: diagnostics.length, lbl: 'Diagnostics posés' },
                  { icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, bg: '#FFF3EA', stroke: '#E8761E', val: '—', lbl: 'Échanges chatbot' },
                ].map((s, i) => (
                  <div key={i} className="sp-scorebox">
                    <div className="sp-sico" style={{ background: s.bg }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={s.stroke} strokeWidth="2">{s.icon}</svg>
                    </div>
                    <div>
                      <div className="sp-sval">{s.val}</div>
                      <div className="sp-slbl">{s.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="sp-tabs">
                {(['humeurs', 'journal', 'diagnostics', 'chatbot', 'plan'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`sp-tab${activeTab === tab ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'humeurs' && 'Humeurs & tendances'}
                    {tab === 'journal' && 'Journal & ressenti'}
                    {tab === 'diagnostics' && 'Résultats diagnostics'}
                    {tab === 'chatbot' && 'Historique chatbot'}
                    {tab === 'plan' && 'Plan de suivi'}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu des tabs */}
            <div className="sp-dcontent">

              {/* ── TAB HUMEURS ─────────────────────────────────────────────── */}
              {activeTab === 'humeurs' && (
                <>
                  <div className="sp-mood-chart-wrap">
                    <div className="sp-ch-header">
                      <div className="sp-ch-title">Humeur — 7 derniers jours</div>
                      <div className="sp-ch-legend">
                        <span><span className="sp-leg-dot" style={{ background: '#12B76A' }} />Bien (7-10)</span>
                        <span><span className="sp-leg-dot" style={{ background: '#F59E0B' }} />Moyen (5-6)</span>
                        <span><span className="sp-leg-dot" style={{ background: '#EF4444' }} />Bas (&lt;5)</span>
                      </div>
                    </div>
                    <div className="sp-mood-bars">
                      {moods.map((v, i) => (
                        <div key={i} className="sp-mbar-wrap">
                          <div style={{ fontSize: '10.5px', fontWeight: 700, color: moodColor(v), marginBottom: '2px' }}>{v}</div>
                          <div style={{ height: `${Math.max(6, v * 9)}px`, background: moodColor(v), opacity: 0.85, width: '100%', borderRadius: '4px 4px 0 0', transition: '0.6s' }} />
                          <div className="sp-mbar-lbl">{WEEK_LABELS[i]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: '1px', background: '#EEF1F8', margin: '0 4px' }} />
                  </div>

                  <div className="sp-mood-cards">
                    {[
                      { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>, bg: '#EBF0FB', stroke: '#1A3870', val: moodAvg, lbl: 'Moyenne générale', trend: '↑ +0.4 vs semaine passée', up: true },
                      { icon: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>, bg: '#FEF2F2', stroke: '#EF4444', val: moods.filter(v => v < 5).length, lbl: 'Jours humeur basse (<5)', trend: 'Dont 1 signalé', up: false },
                      { icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>, bg: '#EDFBF4', stroke: '#12B76A', val: '+12%', lbl: 'Tendance sur 30 jours', trend: 'Progression régulière', up: true },
                    ].map((card, i) => (
                      <div key={i} className="sp-mcard">
                        <div className="sp-mcard-icon" style={{ background: card.bg }}>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={card.stroke} strokeWidth="2">{card.icon}</svg>
                        </div>
                        <div>
                          <div className="sp-mcard-val" style={i === 1 ? { color: '#EF4444' } : i === 2 ? { color: '#12B76A' } : {}}>{card.val}</div>
                          <div className="sp-mcard-lbl">{card.lbl}</div>
                          <div className={`sp-mcard-trend ${card.up ? 'sp-trend-up' : 'sp-trend-dn'}`}>{card.trend}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sp-sec-title">Historique mensuel</div>
                  <div style={{ background: '#fff', border: '1px solid #DDE3EF', borderRadius: '14px', padding: '16px', animation: 'sp-fadeUp .3s .12s both' }}>
                    {[['Juin 2026', 72, '#12B76A', 7.2], ['Mai 2026', 65, '#F59E0B', 6.5], ['Avr 2026', 60, '#EF4444', 5.8]].map(([m, w, c, v]) => (
                      <div key={m as string} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '70px', fontSize: '12px', color: '#5A6888', fontWeight: 500, flexShrink: 0 }}>{m}</div>
                        <div style={{ flex: 1, height: '10px', background: '#F2F5FA', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${w}%`, background: c as string, borderRadius: '5px', opacity: 0.85 }} />
                        </div>
                        <div style={{ width: '36px', fontSize: '12.5px', fontWeight: 700, color: '#1E2D4E', textAlign: 'right' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── TAB JOURNAL ─────────────────────────────────────────────── */}
              {activeTab === 'journal' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', animation: 'sp-fadeUp .3s both' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E2D4E' }}>Journal personnel — {journals.length} entrées</div>
                    <span className="sp-tag sp-tag-b">Partagé avec IA ✓</span>
                  </div>
                  {journals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9AAABB', fontSize: '13px' }}>
                      Aucune entrée de journal partagée par ce patient.
                    </div>
                  ) : journals.map((j, i) => {
                    const moodMap: Record<number, { label: string; color: string; bg: string }> = {
                      4: { label: 'Très bien', color: '#059669', bg: '#EDFBF4' },
                      3: { label: 'Bien', color: '#12B76A', bg: '#EDFBF4' },
                      2: { label: 'Moyen', color: '#F59E0B', bg: '#FFFBEB' },
                      1: { label: 'Difficile', color: '#EF4444', bg: '#FEF2F2' },
                      0: { label: 'Très bas', color: '#DC2626', bg: '#FEF2F2' },
                    };
                    const mood = moodMap[(j as typeof j & { mood_level?: number }).mood_level ?? 3] || moodMap[3];
                    return (
                      <div key={j.id} className="sp-jcard" style={{ animation: `sp-fadeUp .3s ${i * 0.07}s both` }}>
                        <div className="sp-jcard-header">
                          <div className="sp-jdate">{formatDate(j.created_at)}</div>
                          <div className="sp-jmood-badge" style={{ background: mood.bg, color: mood.color }}>
                            {(j as typeof j & { mood_label?: string }).mood_label || mood.label}
                          </div>
                          <div className="sp-jprivate">
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Partagé avec spécialiste
                          </div>
                        </div>
                        <div className="sp-jbody">{j.content || j.description}</div>
                        {j.title && (
                          <div className="sp-jtags">
                            <span className="sp-jtag">{j.title}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div style={{ textAlign: 'center', padding: '16px', color: '#9AAABB', fontSize: '12.5px', animation: 'sp-fadeUp .3s .24s both' }}>
                    — Affichage des {Math.min(journals.length, 5)} entrées les plus récentes —
                  </div>
                </>
              )}

              {/* ── TAB DIAGNOSTICS ──────────────────────────────────────────── */}
              {activeTab === 'diagnostics' && (
                <div className="sp-diag-grid">
                  {diagnostics.length === 0 ? (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: '#9AAABB', fontSize: '13px' }}>
                      Aucun résultat diagnostic disponible.
                    </div>
                  ) : diagnostics.map((d, i) => {
                    const pct = Math.round((d.score / d.max_score) * 100);
                    const prevPct = d.prev_score ? Math.round(((d as typeof d & { prev_score?: number }).prev_score! / d.max_score) * 100) : 0;
                    return (
                      <div key={d.id} className="sp-dcard" style={{ animation: `sp-fadeUp .3s ${i * 0.09}s both` }}>
                        <div className="sp-dcard-head">
                          <div className="sp-dcard-icon" style={{ background: diagBg(d.tool_id) }}>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={diagColor(d.tool_id)} strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                          </div>
                          <div>
                            <div className="sp-dcard-title">{d.tool_name}</div>
                            <div className="sp-dcard-sub">{formatDate(d.created_at)}</div>
                          </div>
                        </div>
                        <div className="sp-score-bar-wrap">
                          <div className="sp-score-bar-label">
                            <span className="sp-score-bar-name">Score actuel</span>
                            <span className="sp-score-bar-val">{d.score} / {d.max_score}</span>
                          </div>
                          <div className="sp-score-bar">
                            <div className="sp-score-bar-fill" style={{ width: `${pct}%`, background: diagColor(d.tool_id) }} />
                          </div>
                        </div>
                        {prevPct > 0 && (
                          <div className="sp-score-bar-wrap">
                            <div className="sp-score-bar-label">
                              <span className="sp-score-bar-name" style={{ color: '#9AAABB' }}>Score initial</span>
                              <span className="sp-score-bar-val" style={{ color: '#9AAABB' }}>{(d as typeof d & { prev_score?: number }).prev_score} / {d.max_score}</span>
                            </div>
                            <div className="sp-score-bar">
                              <div className="sp-score-bar-fill" style={{ width: `${prevPct}%`, background: '#DDE3EF' }} />
                            </div>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <span className={`sp-sev ${sevClass(d.interpretation)}`}>{d.interpretation || 'Non évalué'}</span>
                          {prevPct > 0 && <span style={{ fontSize: '11px', color: '#12B76A', fontWeight: 600 }}>↓ Amélioration vs score initial</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── TAB CHATBOT ──────────────────────────────────────────────── */}
              {activeTab === 'chatbot' && (
                <>
                  <div style={{ animation: 'sp-fadeUp .3s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E2D4E' }}>Historique des sessions chatbot</div>
                      <span className="sp-tag sp-tag-g">IA conversationnelle active</span>
                    </div>
                    <div className="sp-chat-insights" style={{ marginBottom: '14px' }}>
                      {[
                        { val: '—', lbl: 'Échanges totaux', sub: 'Données synchronisées' },
                        { val: DEMO_CHAT_SESSIONS.length, lbl: 'Sessions récentes', sub: 'Affichées ci-dessous' },
                        { val: '3×', lbl: 'Redirections ressources', sub: 'Ce mois-ci' },
                      ].map((c, i) => (
                        <div key={i} className="sp-ci-card">
                          <div className="sp-ci-val" style={i === 2 ? { color: '#E8761E' } : {}}>{c.val}</div>
                          <div className="sp-ci-lbl">{c.lbl}</div>
                          <div className="sp-ci-lbl">{c.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="sp-sec-title">Sessions récentes</div>
                  {DEMO_CHAT_SESSIONS.map((session, si) => (
                    <div key={si} className="sp-chatlog" style={{ animation: `sp-fadeUp .3s ${si * 0.1}s both` }}>
                      <div className="sp-chatlog-header">
                        <div className="sp-chatlog-title">Session du {session.date}</div>
                        <div className="sp-chatlog-meta">{session.messages.length} échanges</div>
                      </div>
                      <div className="sp-chatlog-body">
                        {session.messages.map((m, mi) => (
                          <div key={mi} className={`sp-cmsg sp-cmsg-${m.role}`}>
                            <div className="sp-cmsg-bubble">{m.text}</div>
                            <div className="sp-cmsg-time">{m.time} · {m.role === 'ai' ? 'INA Assistant' : 'Patient'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ── TAB PLAN ─────────────────────────────────────────────────── */}
              {activeTab === 'plan' && (
                <>
                  <div className="sp-plansec">
                    <div className="sp-plansec-header">
                      <div className="sp-plansec-title">Plan de suivi — {current.name}</div>
                      <button className="sp-btn sp-btn-o" style={{ padding: '7px 13px', fontSize: '12px' }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Ajouter une étape
                      </button>
                    </div>
                    {planItems.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#9AAABB', fontSize: '13px' }}>Aucune étape dans le plan de suivi.</div>
                    ) : planItems.map(item => (
                      <div key={item.id} className="sp-planitem">
                        <button className={`sp-pchk${item.completed ? ' done' : ''}`} onClick={() => togglePlan(item)}>
                          {item.completed && (
                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                        <div>
                          <div className="sp-plan-lbl" style={item.completed ? { textDecoration: 'line-through', opacity: 0.55 } : {}}>{item.label}</div>
                          {item.description && <div className="sp-plan-sub">{item.description}</div>}
                          {item.scheduled_date && (
                            <div className="sp-plan-date">
                              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                              {formatDate(item.scheduled_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sp-plansec" style={{ animation: 'sp-fadeUp .3s .1s both' }}>
                    <div className="sp-plansec-title" style={{ marginBottom: '12px' }}>Ressources partagées via chatbot</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {["Module gestion anxiété", "Méditation guidée 10 min", "Journal des émotions", "Respiration 4-7-8"].map(r => (
                        <div key={r} style={{ padding: '7px 12px', background: '#EBF0FB', borderRadius: '8px', fontSize: '12px', color: '#1A3870', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        )}

        {/* ── Panneau IA ────────────────────────────────────────────────────── */}
        <aside className="sp-aipanel">
          <div className="sp-aihead">
            <div className="sp-aiico">
              <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/><path d="M8 12a4 4 0 0 1 8 0"/></svg>
            </div>
            <div>
              <div className="sp-aititle">Assistant IA — INA</div>
              <div className="sp-aisub">Analyse le dossier en temps réel</div>
            </div>
            <div className="sp-aistatus"><span className="sp-aistdot" />En ligne</div>
          </div>

          <div className="sp-aisugg">
            <div className="sp-aisugg-lbl">Actions rapides</div>
            <div className="sp-spills">
              {['Résumé du dossier', 'Analyse humeur', "Points d'attention", 'Prochaines étapes', 'Risques identifiés'].map(s => (
                <button key={s} className="sp-spill" onClick={() => sendAI(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="sp-aimsgs">
            {aiMessages.map((m, i) => (
              <div key={i} className={`sp-msg sp-msg-${m.role}`} style={{ animation: 'sp-fadeIn .3s both' }}>
                <div className="sp-mbubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                <div className="sp-mtime">{m.time}</div>
              </div>
            ))}
            {aiTyping && (
              <div className="sp-msg sp-msg-ai">
                <div className="sp-mbubble">
                  <div className="sp-typing">
                    <div className="sp-tdot" /><div className="sp-tdot" /><div className="sp-tdot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={aiEndRef} />
          </div>

          <div className="sp-aiinput">
            <div className="sp-aiinp-inner">
              <textarea
                ref={textareaRef}
                value={aiInput}
                onChange={e => { setAiInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px'; }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(aiInput); setAiInput(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; } }}
                rows={1}
                placeholder="Question sur le dossier patient…"
              />
              <button className="sp-aisend" onClick={() => { sendAI(aiInput); setAiInput(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
