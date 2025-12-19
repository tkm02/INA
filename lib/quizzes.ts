
export interface Question {
  id: number;
  text: string;
  type: 'scale' | 'choice' | 'boolean';
  options?: { label: string; value: any }[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export const QUIZZES: Record<string, Quiz> = {
  "depression": {
    id: "depression",
    title: "Évaluation de la Dépression (PHQ-9)",
    questions: [
      { id: 1, text: "Peu d'intérêt ou de plaisir à faire les choses ?", type: 'scale' },
      { id: 2, text: "Vous sentez-vous triste, déprimé(e) ou désespéré(e) ?", type: 'scale' },
      { id: 3, text: "Difficultés à s'endormir ou à rester endormi(e), ou trop dormir ?", type: 'scale' },
      { id: 4, text: "Vous sentez-vous fatigué(e) ou manquez-vous d'énergie ?", type: 'scale' },
      { id: 5, text: "Manque d'appétit ou trop manger ?", type: 'scale' },
      { id: 6, text: "Mauvaise opinion de vous-même – ou sentiment d'être un(e) raté(e) ou d'avoir déçu votre famille ou vous-même ?", type: 'scale' },
      { id: 7, text: "Difficultés à se concentrer sur des choses telles que la lecture du journal ou la télévision ?", type: 'scale' },
      { id: 8, text: "Bouger ou parler si lentement que les autres auraient pu le remarquer ? Ou l'inverse – être si agité(e) que vous avez bougé beaucoup plus que d'habitude ?", type: 'scale' },
      { id: 9, text: "Pensées selon lesquelles vous seriez mieux mort(e) ou de vous faire du mal d'une manière ou d'une autre ?", type: 'scale' }
    ]
  },
  "anxiety": {
    id: "anxiety",
    title: "Évaluation de l'Anxiété (GAD-7)",
    questions: [
      { id: 1, text: "Sentiment de nervosité, d'anxiété ou de tension ?", type: 'scale' },
      { id: 2, text: "Incapable d'arrêter de s'inquiéter ou de contrôler ses inquiétudes ?", type: 'scale' },
      { id: 3, text: "S'inquiéter trop pour différentes choses ?", type: 'scale' },
      { id: 4, text: "Difficultés à se détendre ?", type: 'scale' },
      { id: 5, text: "Être si agité(e) qu'il est difficile de rester en place ?", type: 'scale' },
      { id: 6, text: "Devenir facilement contrarié(e) ou irritable ?", type: 'scale' },
      { id: 7, text: "Avoir peur que quelque chose de terrible ne se produise ?", type: 'scale' }
    ]
  },
  "burnout": {
    id: "burnout",
    title: "Évaluation du Burn-out (MBI-C)",
    questions: [
      { id: 1, text: "Je me sens émotionnellement épuisé(e) par mon travail.", type: 'scale' },
      { id: 2, text: "Je me sens 'à bout' à la fin de ma journée de travail.", type: 'scale' },
      { id: 3, text: "Je me sens fatigué(e) quand je me lève le matin.", type: 'scale' },
      { id: 4, text: "Travailler toute une journée est une corvée pour moi.", type: 'scale' },
      { id: 5, text: "Je peux comprendre facilement ce que mes collègues/proches ressentent.", type: 'scale' }
    ]
  },
  "stress": {
    id: "stress",
    title: "Échelle de Stress Perçu (PSS)",
    questions: [
      { id: 1, text: "Au cours du dernier mois, avec quelle fréquence avez-vous été fâché(e) à cause d'un événement imprévu ?", type: 'scale' },
      { id: 2, text: "Au cours du dernier mois, avec quelle fréquence avez-vous senti que vous ne pouviez pas contrôler les choses importantes de votre vie ?", type: 'scale' },
      { id: 3, text: "Au cours du dernier mois, avec quelle fréquence vous êtes-vous senti(e) nerveux(se) ou stressé(e) ?", type: 'scale' }
    ]
  },
  "eating-disorders": {
    id: "eating-disorders",
    title: "Questionnaire SCOFF (Troubles Alimentaires)",
    questions: [
      { id: 1, text: "Vous faites-vous vomir parce que vous vous sentez mal à l'aise d'avoir trop mangé ?", type: 'scale' },
      { id: 2, text: "Vous inquiétez-vous d'avoir perdu le contrôle sur les quantités que vous mangez ?", type: 'scale' },
      { id: 3, text: "Avez-vous récemment perdu plus de 6 kg en 3 mois ?", type: 'scale' }
    ]
  },
  "adhd": {
    id: "adhd",
    title: "TDAH (ASRS v1.1)",
    questions: [
      { id: 1, text: "À quelle fréquence avez-vous des difficultés à finir les derniers détails d'un projet ?", type: 'scale' },
      { id: 2, text: "À quelle fréquence avez-vous des difficultés à mettre les choses en ordre ?", type: 'scale' },
      { id: 3, text: "À quelle fréquence oubliez-vous des rendez-vous ou des obligations ?", type: 'scale' }
    ]
  }
};

export const SCALE_OPTIONS = [
  { label: "Jamais", value: 0 },
  { label: "Plusieurs jours", value: 1 },
  { label: "Plus de la moitié du temps", value: 2 },
  { label: "Presque tous les jours", value: 3 }
];
