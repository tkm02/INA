"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DiagnosticTool {
  id: string;
  category: string;
  title: string;
  tools: string[];
}

const diagnosticTools: DiagnosticTool[] = [
  {
    id: "depression",
    category: "Pour la Dépression",
    title: "Dépression",
    tools: ["PHQ-9 (Patient Health Questionnaire)", "Échelle de Beck (BDI)", "Échelle de dépression de Hamilton"]
  },
  {
    id: "anxiety",
    category: "Pour l'Anxiété",
    title: "Anxiété",
    tools: ["GAD-7 (Generalized Anxiety Disorder)", "Échelle d'anxiété de Hamilton", "Questionnaire des attaques de panique"]
  },
  {
    id: "burnout",
    category: "Pour le Burn-out",
    title: "Burn-out",
    tools: ["Maslach Burnout Inventory (version courte)", "Échelle d'épuisement professionnel"]
  },
  {
    id: "stress",
    category: "Pour le Stress",
    title: "Stress",
    tools: ["Échelle de stress perçu (PSS)", "Inventaire de stress post-traumatique"]
  },
  {
    id: "eating-disorders",
    category: "Pour les Troubles Alimentaires",
    title: "Troubles Alimentaires",
    tools: ["SCOFF Questionnaire", "EAT-26"]
  },
  {
    id: "adhd",
    category: "Pour le TDAH",
    title: "TDAH",
    tools: ["ASRS v1.1 (Adult ADHD Self-Report Scale)"]
  }
];

export default function DiagnosticPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full px-4 py-6 flex items-center justify-between">
        <button onClick={() => router.push("/home")} className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} className="rotate-0" />
        </button>
        <h1 className="text-[#00569E] font-medium">Diagnostic</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="w-full max-w-md px-6 flex flex-col items-center pb-20">
        <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2 text-center">
            OUTILS D'ÉVALUATION STANDARDISÉS
        </h2>
        <div className="w-32 h-1 bg-[#E86C00] mb-8"></div>

        {/* Diagnostic Categories */}
        <div className="w-full space-y-4">
            {diagnosticTools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => router.push(`/diagnostic/${tool.id}`)}
                    className="w-full bg-[#00569E] text-white rounded-xl p-5 text-left flex items-center gap-4 transition-transform active:scale-95 shadow-lg"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-300 transform rotate-45"></div>
                            <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">{tool.category} :</span>
                        </div>
                        <ul className="space-y-1">
                            {tool.tools.map((t, i) => (
                                <li key={i} className="text-sm font-bold flex items-start gap-1">
                                    <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0"></span>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="shrink-0 bg-white/10 p-2 rounded-lg">
                        <ChevronRight size={24} className="text-white" />
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
