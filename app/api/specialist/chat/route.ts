import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { NextRequest } from 'next/server';

const SPECIALIST_SYSTEM_PROMPT = `Tu es l'Assistant IA du tableau de bord INA pour les spécialistes en santé mentale (psychologues, psychiatres, thérapeutes).

🎯 RÔLE
Tu analyses les données du dossier patient (humeurs, journal, diagnostics, historique chatbot) pour aider le spécialiste à :
- Comprendre l'état actuel du patient
- Identifier les points d'attention et signaux d'alerte
- Préparer les séances de suivi
- Proposer des prochaines étapes adaptées

🧠 CE QUE TU PEUX FAIRE
- Résumer le dossier patient de manière concise et structurée
- Analyser les tendances d'humeur (hausses, baisses, corrélations)
- Identifier les thèmes récurrents dans le journal
- Interpréter les scores diagnostics (PHQ-9, GAD-7, PSQ) en contexte clinique
- Proposer des recommandations pour le plan de suivi
- Signaler les risques détectés (humeur basse prolongée, pensées négatives, etc.)

📊 FORMAT DE RÉPONSE
- Utilise des listes à puces pour la clarté
- Mets en gras les points importants avec <strong>...</strong>
- Utilise des émojis pour les alertes : ⚠️ (attention), ✅ (positif), 📈 (amélioration), 📉 (dégradation)
- Sois concis mais complet — le spécialiste est un professionnel

🚫 LIMITES
- Tu ne poses pas de diagnostic final
- Tu proposes des pistes, pas des certitudes
- Tu rappelles que le jugement clinique du spécialiste prime toujours

Réponds en français, de manière professionnelle et structurée.`;

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { question, patientContext } = await request.json();

    if (!question) {
      return Response.json({ error: 'Question manquante' }, { status: 400 });
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      return Response.json({ error: 'Clé API manquante' }, { status: 500 });
    }

    // Construire le contexte patient
    let contextInfo = '';
    if (patientContext) {
      const { name, age, gender, diagnosis, moodWeek, journalCount, diagnostics } = patientContext;
      contextInfo = `\n\nCONTEXTE DU DOSSIER PATIENT :\n`;
      contextInfo += `- Patient : ${name}${age ? ` (${age} ans, ${gender})` : ''}\n`;
      contextInfo += `- Diagnostic principal : ${diagnosis}\n`;

      if (moodWeek?.length) {
        const avg = (moodWeek.reduce((a: number, b: number) => a + b, 0) / moodWeek.length).toFixed(1);
        const low = moodWeek.filter((v: number) => v < 5).length;
        contextInfo += `- Humeurs 7 derniers jours : [${moodWeek.join(', ')}] — Moy: ${avg}/10, ${low} jour(s) bas (<5)\n`;
      }

      if (journalCount !== undefined) {
        contextInfo += `- Entrées journal : ${journalCount}\n`;
      }

      if (diagnostics?.length) {
        contextInfo += `- Diagnostics récents :\n`;
        for (const d of diagnostics) {
          contextInfo += `  • ${d.name} : ${d.score}/${d.max} (${d.interpretation || 'N/A'})\n`;
        }
      }
    }

    const fullSystem = SPECIALIST_SYSTEM_PROMPT + contextInfo;

    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      system: fullSystem,
      messages: [{ role: 'user', content: question }],
      temperature: 0.6,
    });

    return Response.json({
      message: text,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Specialist Chat API Error:', error);
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
