"use client";

import { QUIZZES, SCALE_OPTIONS } from "@/lib/quizzes";
import { Storage } from "@/lib/storage";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizPage() {
  const router = useRouter();
  const { toolId } = useParams();
  const quizId = Array.isArray(toolId) ? toolId[0] : toolId;
  const quiz = QUIZZES[quizId as string];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [hasExpert, setHasExpert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [expertReport, setExpertReport] = useState<string | null>(null);

  useEffect(() => {
    const data = Storage.getData();
    // Use expertsContacted or appointments as a proxy for having an expert
    setHasExpert(data.expertsContacted.length > 0 || data.appointments.some(a => a.status === 'confirmed'));
  }, []);

  useEffect(() => {
    if (isFinished && hasExpert && !reportGenerated) {
      const timer = setTimeout(() => {
        const report = "Selon l'expert, vos résultats indiquent un niveau de stress modéré. Il est conseillé de pratiquer des exercices de respiration et de maintenir un rythme de sommeil régulier. Voilà voilà, l'expert recommande également une consultation de suivi pour approfondir ces points.";
        setExpertReport(report);
        setReportGenerated(true);
        
        Storage.addNotification({
          title: "Rapport de l'expert disponible",
          message: "L'expert a généré un rapport suite à votre diagnostic.",
          type: "report",
          link: `/diagnostic/${quizId}`
        });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, hasExpert, reportGenerated, quizId]);

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-xl font-bold mb-4">Quiz non trouvé</h1>
        <button onClick={() => router.push("/diagnostic")} className="text-primary-blue font-bold">Retour</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswer = (value: number) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(nextAnswers);
    }
  };

  const handleExplainWithAI = () => {
    if (!expertReport) return;
    
    // Save the report context to storage so the AI knows what to explain
    const messages = Storage.getData().conversations.messages;
    const newMessages = [
      ...messages,
      {
        id: Math.random().toString(36).substr(2, 9),
        role: 'user' as const,
        content: `Peux-tu mieux m'expliquer le rapport du médecin suivant : "${expertReport}"`,
        timestamp: new Date().toISOString()
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant' as const,
        content: "Bien sûr. Le rapport de l'expert souligne un stress modéré, ce qui est une réaction normale à des situations exigeantes. Les recommandations visent à stabiliser votre système nerveux par la respiration et le repos. Voulez-vous que nous explorions ensemble des techniques spécifiques ?",
        timestamp: new Date().toISOString()
      }
    ];
    Storage.saveChatHistory(newMessages);
    router.push('/agent-ai');
  };

  const finishQuiz = (finalAnswers: Record<number, number>) => {
    setIsLoading(true);
    const score = Object.values(finalAnswers).reduce((a, b) => a + b, 0);
    
    // Save to storage
    Storage.addDiagnosticResult({
      toolId: quizId as string,
      toolName: quiz.title,
      answers: finalAnswers,
      score: score,
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsFinished(true);
    }, 1500);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Terminé !</h2>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 italic text-gray-700 w-full">
            {reportGenerated ? (
                <div className="text-left not-italic">
                    <p className="font-bold mb-2 text-primary-blue">Rapport de l'expert :</p>
                    <p className="mb-4 text-sm leading-relaxed">{expertReport}</p>
                    <button 
                        onClick={handleExplainWithAI}
                        className="text-xs bg-primary-blue/10 text-primary-blue px-3 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-blue/20 transition-colors"
                    >
                        <span>🤖</span>
                        Mieux expliquer le rapport
                    </button>
                </div>
            ) : hasExpert ? (
                "Merci d'avoir complété cette évaluation. Votre expert a été notifié et reviendra vers vous dès qu'il aura analysé vos résultats. Veuillez patienter le temps de son retour (environ 8 secondes pour cette démo)."
            ) : (
                "Merci pour votre confiance. Pour assurer votre bien-être, nous vous conseillons vivement de rentrer en contact avec un de nos experts. Il pourra analyser vos résultats de manière approfondie et vous proposer le suivi le plus adapté à votre situation."
            )}
          </div>

          <div className="space-y-4 w-full">
            <button 
                onClick={() => router.push('/agent-ai')}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-xl font-bold transition-transform active:scale-95"
            >
                <div className="w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                </div>
                Discuter avec INA
            </button>

            {!hasExpert && (
              <button 
                onClick={() => router.push('/experts')}
                className="w-full py-4 bg-[#E86C00] text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-transform active:scale-95"
              >
                Trouver un expert
              </button>
            )}
            
            <button 
              onClick={() => router.push('/home')}
              className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
            <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <div className="flex-1">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#E86C00] transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
        <span className="text-xs font-bold text-gray-400">
            {currentQuestionIndex + 1}/{quiz.questions.length}
        </span>
      </div>

      <div className="flex-1 px-6 py-10 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-10 leading-tight">
            {currentQuestion.text}
        </h3>

        <div className="space-y-4">
            {SCALE_OPTIONS.map((option) => (
                <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-5 bg-white border-2 border-gray-100 rounded-2xl text-left font-bold text-gray-700 hover:border-primary-blue hover:bg-blue-50 transition-all flex items-center justify-between group"
                >
                    {option.label}
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-primary-blue flex items-center justify-center transition-colors">
                        <div className="w-3 h-3 bg-primary-blue rounded-full opacity-0 group-hover:opacity-100"></div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <Loader2 size={40} className="text-[#E86C00] animate-spin mb-4" />
            <p className="font-bold text-gray-900 uppercase tracking-widest text-xs">Analyse en cours...</p>
        </div>
      )}
    </div>
  );
}
