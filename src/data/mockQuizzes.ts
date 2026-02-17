import { Quiz } from "@/types/quiz";

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    slug: "cybersecurite-fondamentaux",
    title: "Cybersécurité : les fondamentaux",
    description: "Testez vos connaissances sur les bases de la cybersécurité en entreprise.",
    icon: "🛡️",
    iconColor: "blue",
    questionCount: 5,
    introduction: "Ce quiz vous permettra d'évaluer votre niveau de connaissance en matière de cybersécurité. Les questions portent sur les bonnes pratiques, les menaces courantes et les mesures de protection essentielles.",
    questions: [
      {
        id: "q1",
        question: "Quel est le principal vecteur d'attaque utilisé par les cybercriminels ?",
        answers: [
          { id: "a1", text: "Le phishing par email", isCorrect: true },
          { id: "a2", text: "Les attaques DDoS", isCorrect: false },
          { id: "a3", text: "L'accès physique aux serveurs", isCorrect: false },
          { id: "a4", text: "Les failles zero-day", isCorrect: false },
        ],
        explanation: "Le phishing représente plus de 80% des incidents de sécurité signalés. Les emails frauduleux restent le moyen le plus efficace pour les attaquants.",
      },
      {
        id: "q2",
        question: "Quelle est la longueur minimale recommandée pour un mot de passe sécurisé ?",
        answers: [
          { id: "a1", text: "6 caractères", isCorrect: false },
          { id: "a2", text: "8 caractères", isCorrect: false },
          { id: "a3", text: "12 caractères", isCorrect: true },
          { id: "a4", text: "16 caractères", isCorrect: false },
        ],
        explanation: "L'ANSSI recommande un minimum de 12 caractères incluant majuscules, minuscules, chiffres et caractères spéciaux.",
      },
      {
        id: "q3",
        question: "Que signifie l'acronyme MFA ?",
        answers: [
          { id: "a1", text: "Multiple File Access", isCorrect: false },
          { id: "a2", text: "Multi-Factor Authentication", isCorrect: true },
          { id: "a3", text: "Main Firewall Application", isCorrect: false },
          { id: "a4", text: "Managed Function Architecture", isCorrect: false },
        ],
        explanation: "L'authentification multi-facteurs (MFA) ajoute une couche de sécurité supplémentaire en exigeant plusieurs preuves d'identité.",
      },
      {
        id: "q4",
        question: "Quel protocole assure le chiffrement des communications web ?",
        answers: [
          { id: "a1", text: "HTTP", isCorrect: false },
          { id: "a2", text: "FTP", isCorrect: false },
          { id: "a3", text: "HTTPS/TLS", isCorrect: true },
          { id: "a4", text: "SMTP", isCorrect: false },
        ],
        explanation: "HTTPS utilise le protocole TLS pour chiffrer les données échangées entre le navigateur et le serveur web.",
      },
      {
        id: "q5",
        question: "Quelle action est la plus risquée sur un réseau Wi-Fi public ?",
        answers: [
          { id: "a1", text: "Consulter un site d'actualités", isCorrect: false },
          { id: "a2", text: "Accéder à sa banque en ligne", isCorrect: true },
          { id: "a3", text: "Écouter de la musique en streaming", isCorrect: false },
          { id: "a4", text: "Consulter la météo", isCorrect: false },
        ],
        explanation: "Les réseaux Wi-Fi publics ne sont pas chiffrés. Accéder à des données sensibles comme ses comptes bancaires expose à l'interception des données.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 40, title: "À renforcer 📚", message: "Vos connaissances en cybersécurité nécessitent un approfondissement. N'hésitez pas à consulter les ressources de l'ANSSI." },
      { minScore: 41, maxScore: 70, title: "Bon niveau 👍", message: "Vous avez de bonnes bases ! Quelques points restent à consolider pour être parfaitement à l'aise." },
      { minScore: 71, maxScore: 100, title: "Excellent ! 🏆", message: "Bravo ! Vous maîtrisez les fondamentaux de la cybersécurité. Continuez à rester vigilant." },
    ],
  },
  {
    id: "2",
    slug: "rgpd-essentiels",
    title: "RGPD : l'essentiel",
    description: "Vérifiez votre compréhension du Règlement Général sur la Protection des Données.",
    icon: "📋",
    iconColor: "orange",
    questionCount: 4,
    introduction: "Le RGPD est entré en vigueur en mai 2018. Ce quiz évalue votre compréhension des principes fondamentaux et des obligations qu'il impose aux organisations.",
    questions: [
      {
        id: "q1",
        question: "En quelle année le RGPD est-il entré en application ?",
        answers: [
          { id: "a1", text: "2016", isCorrect: false },
          { id: "a2", text: "2018", isCorrect: true },
          { id: "a3", text: "2020", isCorrect: false },
          { id: "a4", text: "2017", isCorrect: false },
        ],
        explanation: "Le RGPD a été adopté en 2016 mais est entré en application le 25 mai 2018.",
      },
      {
        id: "q2",
        question: "Quel est le montant maximal d'amende prévu par le RGPD ?",
        answers: [
          { id: "a1", text: "1 million d'euros", isCorrect: false },
          { id: "a2", text: "10 millions d'euros", isCorrect: false },
          { id: "a3", text: "20 millions d'euros ou 4% du CA mondial", isCorrect: true },
          { id: "a4", text: "50 millions d'euros", isCorrect: false },
        ],
        explanation: "Le RGPD prévoit des sanctions pouvant aller jusqu'à 20 millions d'euros ou 4% du chiffre d'affaires annuel mondial.",
      },
      {
        id: "q3",
        question: "Qu'est-ce qu'un DPO ?",
        answers: [
          { id: "a1", text: "Data Processing Officer", isCorrect: false },
          { id: "a2", text: "Data Protection Officer", isCorrect: true },
          { id: "a3", text: "Digital Privacy Operator", isCorrect: false },
          { id: "a4", text: "Document Privacy Officer", isCorrect: false },
        ],
        explanation: "Le Data Protection Officer (Délégué à la Protection des Données) est chargé de veiller au respect du RGPD au sein de l'organisation.",
      },
      {
        id: "q4",
        question: "Quel droit permet à un individu de demander la suppression de ses données ?",
        answers: [
          { id: "a1", text: "Droit d'accès", isCorrect: false },
          { id: "a2", text: "Droit de portabilité", isCorrect: false },
          { id: "a3", text: "Droit à l'effacement", isCorrect: true },
          { id: "a4", text: "Droit de rectification", isCorrect: false },
        ],
        explanation: "Le droit à l'effacement (ou droit à l'oubli) permet à toute personne de demander la suppression de ses données personnelles.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 50, title: "À approfondir 📖", message: "Le RGPD est complexe mais essentiel. Prenez le temps de revoir les principes fondamentaux." },
      { minScore: 51, maxScore: 80, title: "Bonne maîtrise 👏", message: "Vous comprenez bien les grandes lignes du RGPD. Continuez à vous former sur les cas pratiques." },
      { minScore: 81, maxScore: 100, title: "Expert RGPD ! 🎯", message: "Vous maîtrisez parfaitement les fondamentaux du RGPD. Vous êtes un atout pour votre organisation." },
    ],
  },
  {
    id: "3",
    slug: "ia-generative",
    title: "IA Générative : les bases",
    description: "Explorez vos connaissances sur l'intelligence artificielle générative et ses applications.",
    icon: "🤖",
    iconColor: "purple",
    questionCount: 4,
    introduction: "L'IA générative révolutionne de nombreux secteurs. Ce quiz teste vos connaissances sur les concepts clés, les outils et les enjeux de cette technologie.",
    questions: [
      {
        id: "q1",
        question: "Quel modèle est à l'origine de ChatGPT ?",
        answers: [
          { id: "a1", text: "BERT", isCorrect: false },
          { id: "a2", text: "GPT (Generative Pre-trained Transformer)", isCorrect: true },
          { id: "a3", text: "DALL-E", isCorrect: false },
          { id: "a4", text: "ResNet", isCorrect: false },
        ],
        explanation: "ChatGPT est basé sur l'architecture GPT (Generative Pre-trained Transformer) développée par OpenAI.",
      },
      {
        id: "q2",
        question: "Qu'est-ce qu'une hallucination en IA ?",
        answers: [
          { id: "a1", text: "Un bug du système", isCorrect: false },
          { id: "a2", text: "Une génération de contenu faux présenté comme vrai", isCorrect: true },
          { id: "a3", text: "Un type d'attaque", isCorrect: false },
          { id: "a4", text: "Une technique d'entraînement", isCorrect: false },
        ],
        explanation: "Une hallucination se produit quand l'IA génère des informations plausibles mais factuellement incorrectes, avec une grande confiance apparente.",
      },
      {
        id: "q3",
        question: "Que signifie RAG dans le contexte de l'IA ?",
        answers: [
          { id: "a1", text: "Random Access Generation", isCorrect: false },
          { id: "a2", text: "Retrieval-Augmented Generation", isCorrect: true },
          { id: "a3", text: "Recursive Algorithm Gateway", isCorrect: false },
          { id: "a4", text: "Real-time AI Generator", isCorrect: false },
        ],
        explanation: "Le RAG (Retrieval-Augmented Generation) combine la recherche de documents pertinents avec la génération de texte pour des réponses plus précises.",
      },
      {
        id: "q4",
        question: "Quel est le principal risque lié à l'utilisation de données personnelles dans les prompts IA ?",
        answers: [
          { id: "a1", text: "Ralentissement du modèle", isCorrect: false },
          { id: "a2", text: "Fuite de données et non-conformité RGPD", isCorrect: true },
          { id: "a3", text: "Augmentation des coûts", isCorrect: false },
          { id: "a4", text: "Perte de qualité des réponses", isCorrect: false },
        ],
        explanation: "Les données saisies dans les prompts peuvent être stockées et utilisées pour l'entraînement, posant des risques de fuite et de non-conformité réglementaire.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 50, title: "Découverte 🌱", message: "L'IA générative est un domaine vaste. Ce quiz est un bon point de départ pour approfondir vos connaissances." },
      { minScore: 51, maxScore: 80, title: "Bien informé 💡", message: "Vous avez une bonne compréhension des concepts clés. Continuez à expérimenter avec ces outils." },
      { minScore: 81, maxScore: 100, title: "Passionné d'IA ! 🚀", message: "Excellent ! Vous maîtrisez les fondamentaux de l'IA générative. Vous êtes prêt pour les sujets avancés." },
    ],
  },
];
