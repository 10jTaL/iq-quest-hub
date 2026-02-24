import { Quiz } from "@/types/quiz";

const generateId = (prefix: string, n: number) => `${prefix}${n}`;

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    slug: "cybersecurite-fondamentaux",
    title: "Cybersécurité : les fondamentaux",
    description: "Testez vos connaissances sur les bases de la cybersécurité en entreprise.",
    icon: "🛡️",
    iconColor: "blue",
    questionCount: 5,
    isActive: true,
    createdBy: "admin@exemple.com",
    introduction: "Ce quiz vous permettra d'évaluer votre niveau de connaissance en matière de cybersécurité.",
    questions: [
      {
        id: "q1", question: "Quel est le principal vecteur d'attaque utilisé par les cybercriminels ?", isActive: true,
        answers: [
          { id: "a1", text: "Le phishing par email", isCorrect: true, isActive: true },
          { id: "a2", text: "Les attaques DDoS", isCorrect: false, isActive: true },
          { id: "a3", text: "L'accès physique aux serveurs", isCorrect: false, isActive: true },
          { id: "a4", text: "Les failles zero-day", isCorrect: false, isActive: true },
        ],
        explanation: "Le phishing représente plus de 80% des incidents de sécurité signalés.",
      },
      {
        id: "q2", question: "Quelle est la longueur minimale recommandée pour un mot de passe sécurisé ?", isActive: true,
        answers: [
          { id: "a1", text: "6 caractères", isCorrect: false, isActive: true },
          { id: "a2", text: "8 caractères", isCorrect: false, isActive: true },
          { id: "a3", text: "12 caractères", isCorrect: true, isActive: true },
          { id: "a4", text: "16 caractères", isCorrect: false, isActive: true },
        ],
        explanation: "L'ANSSI recommande un minimum de 12 caractères.",
      },
      {
        id: "q3", question: "Que signifie l'acronyme MFA ?", isActive: true,
        answers: [
          { id: "a1", text: "Multiple File Access", isCorrect: false, isActive: true },
          { id: "a2", text: "Multi-Factor Authentication", isCorrect: true, isActive: true },
          { id: "a3", text: "Main Firewall Application", isCorrect: false, isActive: true },
          { id: "a4", text: "Managed Function Architecture", isCorrect: false, isActive: true },
        ],
        explanation: "L'authentification multi-facteurs ajoute une couche de sécurité supplémentaire.",
      },
      {
        id: "q4", question: "Quel protocole assure le chiffrement des communications web ?", isActive: true,
        answers: [
          { id: "a1", text: "HTTP", isCorrect: false, isActive: true },
          { id: "a2", text: "FTP", isCorrect: false, isActive: true },
          { id: "a3", text: "HTTPS/TLS", isCorrect: true, isActive: true },
          { id: "a4", text: "SMTP", isCorrect: false, isActive: true },
        ],
        explanation: "HTTPS utilise le protocole TLS pour chiffrer les données échangées.",
      },
      {
        id: "q5", question: "Quelle action est la plus risquée sur un réseau Wi-Fi public ?", isActive: true,
        answers: [
          { id: "a1", text: "Consulter un site d'actualités", isCorrect: false, isActive: true },
          { id: "a2", text: "Accéder à sa banque en ligne", isCorrect: true, isActive: true },
          { id: "a3", text: "Écouter de la musique en streaming", isCorrect: false, isActive: true },
          { id: "a4", text: "Consulter la météo", isCorrect: false, isActive: true },
        ],
        explanation: "Les réseaux Wi-Fi publics ne sont pas chiffrés.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 40, title: "À renforcer 📚", message: "Vos connaissances nécessitent un approfondissement." },
      { minScore: 41, maxScore: 70, title: "Bon niveau 👍", message: "Bonnes bases ! Quelques points à consolider." },
      { minScore: 71, maxScore: 100, title: "Excellent ! 🏆", message: "Bravo ! Vous maîtrisez les fondamentaux." },
    ],
  },
  {
    id: "2",
    slug: "rgpd-essentiels",
    title: "RGPD : l'essentiel",
    description: "Vérifiez votre compréhension du RGPD.",
    icon: "📋",
    iconColor: "orange",
    questionCount: 4,
    isActive: true,
    createdBy: "admin@exemple.com",
    introduction: "Le RGPD est entré en vigueur en mai 2018. Ce quiz évalue votre compréhension des principes fondamentaux.",
    questions: [
      {
        id: "q1", question: "En quelle année le RGPD est-il entré en application ?", isActive: true,
        answers: [
          { id: "a1", text: "2016", isCorrect: false, isActive: true },
          { id: "a2", text: "2018", isCorrect: true, isActive: true },
          { id: "a3", text: "2020", isCorrect: false, isActive: true },
          { id: "a4", text: "2017", isCorrect: false, isActive: true },
        ],
        explanation: "Le RGPD est entré en application le 25 mai 2018.",
      },
      {
        id: "q2", question: "Quel est le montant maximal d'amende prévu par le RGPD ?", isActive: true,
        answers: [
          { id: "a1", text: "1 million d'euros", isCorrect: false, isActive: true },
          { id: "a2", text: "10 millions d'euros", isCorrect: false, isActive: true },
          { id: "a3", text: "20 millions d'euros ou 4% du CA mondial", isCorrect: true, isActive: true },
          { id: "a4", text: "50 millions d'euros", isCorrect: false, isActive: true },
        ],
        explanation: "Sanctions pouvant aller jusqu'à 20M€ ou 4% du CA mondial.",
      },
      {
        id: "q3", question: "Qu'est-ce qu'un DPO ?", isActive: true,
        answers: [
          { id: "a1", text: "Data Processing Officer", isCorrect: false, isActive: true },
          { id: "a2", text: "Data Protection Officer", isCorrect: true, isActive: true },
          { id: "a3", text: "Digital Privacy Operator", isCorrect: false, isActive: true },
          { id: "a4", text: "Document Privacy Officer", isCorrect: false, isActive: true },
        ],
        explanation: "Le DPO veille au respect du RGPD au sein de l'organisation.",
      },
      {
        id: "q4", question: "Quel droit permet de demander la suppression de ses données ?", isActive: true,
        answers: [
          { id: "a1", text: "Droit d'accès", isCorrect: false, isActive: true },
          { id: "a2", text: "Droit de portabilité", isCorrect: false, isActive: true },
          { id: "a3", text: "Droit à l'effacement", isCorrect: true, isActive: true },
          { id: "a4", text: "Droit de rectification", isCorrect: false, isActive: true },
        ],
        explanation: "Le droit à l'effacement (droit à l'oubli) permet la suppression des données personnelles.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 50, title: "À approfondir 📖", message: "Revoyez les principes fondamentaux." },
      { minScore: 51, maxScore: 80, title: "Bonne maîtrise 👏", message: "Vous comprenez bien les grandes lignes." },
      { minScore: 81, maxScore: 100, title: "Expert RGPD ! 🎯", message: "Parfaite maîtrise des fondamentaux." },
    ],
  },
  {
    id: "3",
    slug: "ia-generative",
    title: "IA Générative : les bases",
    description: "Explorez vos connaissances sur l'IA générative.",
    icon: "🤖",
    iconColor: "purple",
    questionCount: 4,
    isActive: true,
    createdBy: "admin@exemple.com",
    introduction: "L'IA générative révolutionne de nombreux secteurs. Testez vos connaissances !",
    questions: [
      {
        id: "q1", question: "Quel modèle est à l'origine de ChatGPT ?", isActive: true,
        answers: [
          { id: "a1", text: "BERT", isCorrect: false, isActive: true },
          { id: "a2", text: "GPT (Generative Pre-trained Transformer)", isCorrect: true, isActive: true },
          { id: "a3", text: "DALL-E", isCorrect: false, isActive: true },
          { id: "a4", text: "ResNet", isCorrect: false, isActive: true },
        ],
        explanation: "ChatGPT est basé sur l'architecture GPT développée par OpenAI.",
      },
      {
        id: "q2", question: "Qu'est-ce qu'une hallucination en IA ?", isActive: true,
        answers: [
          { id: "a1", text: "Un bug du système", isCorrect: false, isActive: true },
          { id: "a2", text: "Une génération de contenu faux présenté comme vrai", isCorrect: true, isActive: true },
          { id: "a3", text: "Un type d'attaque", isCorrect: false, isActive: true },
          { id: "a4", text: "Une technique d'entraînement", isCorrect: false, isActive: true },
        ],
        explanation: "L'IA génère des informations plausibles mais factuellement incorrectes.",
      },
      {
        id: "q3", question: "Que signifie RAG dans le contexte de l'IA ?", isActive: true,
        answers: [
          { id: "a1", text: "Random Access Generation", isCorrect: false, isActive: true },
          { id: "a2", text: "Retrieval-Augmented Generation", isCorrect: true, isActive: true },
          { id: "a3", text: "Recursive Algorithm Gateway", isCorrect: false, isActive: true },
          { id: "a4", text: "Real-time AI Generator", isCorrect: false, isActive: true },
        ],
        explanation: "Le RAG combine recherche de documents et génération de texte.",
      },
      {
        id: "q4", question: "Quel est le principal risque lié aux données personnelles dans les prompts IA ?", isActive: true,
        answers: [
          { id: "a1", text: "Ralentissement du modèle", isCorrect: false, isActive: true },
          { id: "a2", text: "Fuite de données et non-conformité RGPD", isCorrect: true, isActive: true },
          { id: "a3", text: "Augmentation des coûts", isCorrect: false, isActive: true },
          { id: "a4", text: "Perte de qualité des réponses", isCorrect: false, isActive: true },
        ],
        explanation: "Les données saisies peuvent être stockées, posant des risques de fuite.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 50, title: "Découverte 🌱", message: "Bon point de départ !" },
      { minScore: 51, maxScore: 80, title: "Bien informé 💡", message: "Bonne compréhension des concepts clés." },
      { minScore: 81, maxScore: 100, title: "Passionné d'IA ! 🚀", message: "Excellent !" },
    ],
  },
  {
    id: "4",
    slug: "culture-tech-30-questions",
    title: "Culture Tech : le grand quiz",
    description: "30 questions pour tester votre culture technologique générale, du hardware à l'IA en passant par le cloud et le dev.",
    icon: "💻",
    iconColor: "teal",
    questionCount: 30,
    isActive: true,
    createdBy: "admin@exemple.com",
    introduction: "Ce quiz de 30 questions couvre un large spectre de la culture technologique : développement, cloud, réseaux, IA, systèmes d'exploitation, bases de données et plus encore. Prêt à relever le défi ?",
    questions: [
      {
        id: "q1", question: "Quel langage est principalement utilisé pour styliser les pages web ?", isActive: true,
        answers: [
          { id: "a1", text: "JavaScript", isCorrect: false, isActive: true },
          { id: "a2", text: "CSS", isCorrect: true, isActive: true },
          { id: "a3", text: "Python", isCorrect: false, isActive: true },
          { id: "a4", text: "SQL", isCorrect: false, isActive: true },
        ],
        explanation: "CSS (Cascading Style Sheets) est le langage standard pour la mise en forme des pages web.",
      },
      {
        id: "q2", question: "Que signifie l'acronyme API ?", isActive: true,
        answers: [
          { id: "a1", text: "Application Programming Interface", isCorrect: true, isActive: true },
          { id: "a2", text: "Automated Process Integration", isCorrect: false, isActive: true },
          { id: "a3", text: "Advanced Protocol Internet", isCorrect: false, isActive: true },
          { id: "a4", text: "Application Process Interconnection", isCorrect: false, isActive: true },
        ],
        explanation: "Une API définit les interactions entre différents logiciels.",
      },
      {
        id: "q3", question: "Quel est le système de gestion de versions le plus utilisé ?", isActive: true,
        answers: [
          { id: "a1", text: "SVN", isCorrect: false, isActive: true },
          { id: "a2", text: "Mercurial", isCorrect: false, isActive: true },
          { id: "a3", text: "Git", isCorrect: true, isActive: true },
          { id: "a4", text: "CVS", isCorrect: false, isActive: true },
        ],
        explanation: "Git, créé par Linus Torvalds en 2005, domine le marché du contrôle de versions.",
      },
      {
        id: "q4", question: "Qu'est-ce que le cloud computing ?", isActive: true,
        answers: [
          { id: "a1", text: "Un type de stockage local", isCorrect: false, isActive: true },
          { id: "a2", text: "La fourniture de services informatiques via Internet", isCorrect: true, isActive: true },
          { id: "a3", text: "Un logiciel de météo", isCorrect: false, isActive: true },
          { id: "a4", text: "Un protocole réseau", isCorrect: false, isActive: true },
        ],
        explanation: "Le cloud computing permet d'accéder à des ressources informatiques à la demande via Internet.",
      },
      {
        id: "q5", question: "Quel port est utilisé par défaut par HTTPS ?", isActive: true,
        answers: [
          { id: "a1", text: "80", isCorrect: false, isActive: true },
          { id: "a2", text: "8080", isCorrect: false, isActive: true },
          { id: "a3", text: "443", isCorrect: true, isActive: true },
          { id: "a4", text: "22", isCorrect: false, isActive: true },
        ],
        explanation: "Le port 443 est le port standard pour les connexions HTTPS sécurisées.",
      },
      {
        id: "q6", question: "Que signifie SQL ?", isActive: true,
        answers: [
          { id: "a1", text: "Structured Query Language", isCorrect: true, isActive: true },
          { id: "a2", text: "Simple Question Language", isCorrect: false, isActive: true },
          { id: "a3", text: "System Query Logic", isCorrect: false, isActive: true },
          { id: "a4", text: "Standard Quality Level", isCorrect: false, isActive: true },
        ],
        explanation: "SQL est le langage standard pour interroger et manipuler les bases de données relationnelles.",
      },
      {
        id: "q7", question: "Quel est le rôle d'un pare-feu (firewall) ?", isActive: true,
        answers: [
          { id: "a1", text: "Accélérer la connexion Internet", isCorrect: false, isActive: true },
          { id: "a2", text: "Filtrer le trafic réseau entrant et sortant", isCorrect: true, isActive: true },
          { id: "a3", text: "Stocker les mots de passe", isCorrect: false, isActive: true },
          { id: "a4", text: "Compresser les fichiers", isCorrect: false, isActive: true },
        ],
        explanation: "Un pare-feu contrôle le trafic réseau selon des règles de sécurité définies.",
      },
      {
        id: "q8", question: "Qu'est-ce que Docker ?", isActive: true,
        answers: [
          { id: "a1", text: "Un langage de programmation", isCorrect: false, isActive: true },
          { id: "a2", text: "Une plateforme de conteneurisation", isCorrect: true, isActive: true },
          { id: "a3", text: "Un système d'exploitation", isCorrect: false, isActive: true },
          { id: "a4", text: "Un gestionnaire de base de données", isCorrect: false, isActive: true },
        ],
        explanation: "Docker permet d'empaqueter des applications dans des conteneurs isolés et portables.",
      },
      {
        id: "q9", question: "Quelle commande Linux affiche le contenu d'un fichier ?", isActive: true,
        answers: [
          { id: "a1", text: "ls", isCorrect: false, isActive: true },
          { id: "a2", text: "cat", isCorrect: true, isActive: true },
          { id: "a3", text: "mkdir", isCorrect: false, isActive: true },
          { id: "a4", text: "rm", isCorrect: false, isActive: true },
        ],
        explanation: "La commande 'cat' (concatenate) affiche le contenu d'un ou plusieurs fichiers.",
      },
      {
        id: "q10", question: "Que signifie SaaS ?", isActive: true,
        answers: [
          { id: "a1", text: "Software as a Service", isCorrect: true, isActive: true },
          { id: "a2", text: "System as a Solution", isCorrect: false, isActive: true },
          { id: "a3", text: "Storage as a Service", isCorrect: false, isActive: true },
          { id: "a4", text: "Security as a Standard", isCorrect: false, isActive: true },
        ],
        explanation: "Le SaaS est un modèle où le logiciel est hébergé dans le cloud et accessible via Internet.",
      },
      {
        id: "q11", question: "Quel protocole est utilisé pour envoyer des emails ?", isActive: true,
        answers: [
          { id: "a1", text: "FTP", isCorrect: false, isActive: true },
          { id: "a2", text: "SMTP", isCorrect: true, isActive: true },
          { id: "a3", text: "SSH", isCorrect: false, isActive: true },
          { id: "a4", text: "DNS", isCorrect: false, isActive: true },
        ],
        explanation: "SMTP (Simple Mail Transfer Protocol) est le protocole standard d'envoi d'emails.",
      },
      {
        id: "q12", question: "Qu'est-ce qu'une adresse IP ?", isActive: true,
        answers: [
          { id: "a1", text: "Un identifiant unique pour un appareil sur un réseau", isCorrect: true, isActive: true },
          { id: "a2", text: "Un mot de passe réseau", isCorrect: false, isActive: true },
          { id: "a3", text: "Un type de câble réseau", isCorrect: false, isActive: true },
          { id: "a4", text: "Un logiciel antivirus", isCorrect: false, isActive: true },
        ],
        explanation: "L'adresse IP (Internet Protocol) identifie de manière unique un appareil connecté.",
      },
      {
        id: "q13", question: "Quel type de base de données est MongoDB ?", isActive: true,
        answers: [
          { id: "a1", text: "Relationnelle", isCorrect: false, isActive: true },
          { id: "a2", text: "NoSQL orientée documents", isCorrect: true, isActive: true },
          { id: "a3", text: "Graphe", isCorrect: false, isActive: true },
          { id: "a4", text: "Clé-valeur", isCorrect: false, isActive: true },
        ],
        explanation: "MongoDB stocke les données sous forme de documents JSON/BSON flexibles.",
      },
      {
        id: "q14", question: "Que signifie DNS ?", isActive: true,
        answers: [
          { id: "a1", text: "Data Network System", isCorrect: false, isActive: true },
          { id: "a2", text: "Domain Name System", isCorrect: true, isActive: true },
          { id: "a3", text: "Digital Network Service", isCorrect: false, isActive: true },
          { id: "a4", text: "Dynamic Node Server", isCorrect: false, isActive: true },
        ],
        explanation: "Le DNS traduit les noms de domaine (google.com) en adresses IP.",
      },
      {
        id: "q15", question: "Qu'est-ce que le responsive design ?", isActive: true,
        answers: [
          { id: "a1", text: "Un design qui répond rapidement", isCorrect: false, isActive: true },
          { id: "a2", text: "Un design qui s'adapte à toutes les tailles d'écran", isCorrect: true, isActive: true },
          { id: "a3", text: "Un design en temps réel", isCorrect: false, isActive: true },
          { id: "a4", text: "Un design animé", isCorrect: false, isActive: true },
        ],
        explanation: "Le responsive design assure une expérience optimale sur mobile, tablette et desktop.",
      },
      {
        id: "q16", question: "Quel framework JavaScript est développé par Meta (Facebook) ?", isActive: true,
        answers: [
          { id: "a1", text: "Angular", isCorrect: false, isActive: true },
          { id: "a2", text: "Vue.js", isCorrect: false, isActive: true },
          { id: "a3", text: "React", isCorrect: true, isActive: true },
          { id: "a4", text: "Svelte", isCorrect: false, isActive: true },
        ],
        explanation: "React a été créé par Meta et est l'une des bibliothèques UI les plus populaires.",
      },
      {
        id: "q17", question: "Qu'est-ce que Kubernetes ?", isActive: true,
        answers: [
          { id: "a1", text: "Un langage de programmation", isCorrect: false, isActive: true },
          { id: "a2", text: "Un orchestrateur de conteneurs", isCorrect: true, isActive: true },
          { id: "a3", text: "Un navigateur web", isCorrect: false, isActive: true },
          { id: "a4", text: "Un service de messagerie", isCorrect: false, isActive: true },
        ],
        explanation: "Kubernetes (K8s) automatise le déploiement et la gestion de conteneurs à grande échelle.",
      },
      {
        id: "q18", question: "Quelle est la différence entre RAM et ROM ?", isActive: true,
        answers: [
          { id: "a1", text: "La RAM est volatile, la ROM est permanente", isCorrect: true, isActive: true },
          { id: "a2", text: "La ROM est plus rapide", isCorrect: false, isActive: true },
          { id: "a3", text: "Il n'y a aucune différence", isCorrect: false, isActive: true },
          { id: "a4", text: "La RAM est uniquement dans les serveurs", isCorrect: false, isActive: true },
        ],
        explanation: "La RAM perd ses données à l'extinction, la ROM les conserve de façon permanente.",
      },
      {
        id: "q19", question: "Que signifie CI/CD ?", isActive: true,
        answers: [
          { id: "a1", text: "Code Integration / Code Deployment", isCorrect: false, isActive: true },
          { id: "a2", text: "Continuous Integration / Continuous Delivery", isCorrect: true, isActive: true },
          { id: "a3", text: "Central Infrastructure / Cloud Data", isCorrect: false, isActive: true },
          { id: "a4", text: "Computer Interface / Computer Design", isCorrect: false, isActive: true },
        ],
        explanation: "CI/CD automatise l'intégration, les tests et le déploiement du code.",
      },
      {
        id: "q20", question: "Quel est le rôle d'un load balancer ?", isActive: true,
        answers: [
          { id: "a1", text: "Compresser les données", isCorrect: false, isActive: true },
          { id: "a2", text: "Répartir le trafic entre plusieurs serveurs", isCorrect: true, isActive: true },
          { id: "a3", text: "Chiffrer les communications", isCorrect: false, isActive: true },
          { id: "a4", text: "Sauvegarder les bases de données", isCorrect: false, isActive: true },
        ],
        explanation: "Un load balancer distribue les requêtes pour éviter la surcharge d'un seul serveur.",
      },
      {
        id: "q21", question: "Qu'est-ce que TypeScript ?", isActive: true,
        answers: [
          { id: "a1", text: "Un framework CSS", isCorrect: false, isActive: true },
          { id: "a2", text: "Un sur-ensemble typé de JavaScript", isCorrect: true, isActive: true },
          { id: "a3", text: "Un système d'exploitation", isCorrect: false, isActive: true },
          { id: "a4", text: "Un gestionnaire de paquets", isCorrect: false, isActive: true },
        ],
        explanation: "TypeScript ajoute le typage statique à JavaScript pour réduire les erreurs.",
      },
      {
        id: "q22", question: "Que fait la commande 'git merge' ?", isActive: true,
        answers: [
          { id: "a1", text: "Supprime une branche", isCorrect: false, isActive: true },
          { id: "a2", text: "Fusionne deux branches", isCorrect: true, isActive: true },
          { id: "a3", text: "Crée un nouveau dépôt", isCorrect: false, isActive: true },
          { id: "a4", text: "Annule le dernier commit", isCorrect: false, isActive: true },
        ],
        explanation: "Git merge intègre les modifications d'une branche dans une autre.",
      },
      {
        id: "q23", question: "Qu'est-ce qu'une attaque par injection SQL ?", isActive: true,
        answers: [
          { id: "a1", text: "Un virus informatique", isCorrect: false, isActive: true },
          { id: "a2", text: "L'insertion de code SQL malveillant dans une requête", isCorrect: true, isActive: true },
          { id: "a3", text: "Une panne de serveur", isCorrect: false, isActive: true },
          { id: "a4", text: "Un problème de performance", isCorrect: false, isActive: true },
        ],
        explanation: "L'injection SQL exploite les failles de validation des entrées utilisateur.",
      },
      {
        id: "q24", question: "Quel est le rôle du protocole TCP ?", isActive: true,
        answers: [
          { id: "a1", text: "Afficher les pages web", isCorrect: false, isActive: true },
          { id: "a2", text: "Assurer la transmission fiable des données", isCorrect: true, isActive: true },
          { id: "a3", text: "Crypter les fichiers", isCorrect: false, isActive: true },
          { id: "a4", text: "Gérer les adresses email", isCorrect: false, isActive: true },
        ],
        explanation: "TCP garantit que les paquets de données arrivent dans l'ordre et sans perte.",
      },
      {
        id: "q25", question: "Que signifie ORM dans le développement ?", isActive: true,
        answers: [
          { id: "a1", text: "Object-Relational Mapping", isCorrect: true, isActive: true },
          { id: "a2", text: "Online Resource Manager", isCorrect: false, isActive: true },
          { id: "a3", text: "Optimized Runtime Module", isCorrect: false, isActive: true },
          { id: "a4", text: "Operational Risk Management", isCorrect: false, isActive: true },
        ],
        explanation: "Un ORM permet de manipuler une base de données via des objets du langage de programmation.",
      },
      {
        id: "q26", question: "Qu'est-ce que le machine learning ?", isActive: true,
        answers: [
          { id: "a1", text: "Apprendre à utiliser une machine", isCorrect: false, isActive: true },
          { id: "a2", text: "Un sous-domaine de l'IA où les modèles apprennent à partir de données", isCorrect: true, isActive: true },
          { id: "a3", text: "Un type de hardware", isCorrect: false, isActive: true },
          { id: "a4", text: "Un logiciel de maintenance", isCorrect: false, isActive: true },
        ],
        explanation: "Le machine learning permet aux algorithmes de s'améliorer automatiquement grâce à l'expérience.",
      },
      {
        id: "q27", question: "Quel est l'avantage principal d'une architecture microservices ?", isActive: true,
        answers: [
          { id: "a1", text: "Plus simple à développer", isCorrect: false, isActive: true },
          { id: "a2", text: "Chaque service peut être déployé et mis à l'échelle indépendamment", isCorrect: true, isActive: true },
          { id: "a3", text: "Moins coûteux en serveurs", isCorrect: false, isActive: true },
          { id: "a4", text: "Ne nécessite pas de réseau", isCorrect: false, isActive: true },
        ],
        explanation: "Les microservices offrent modularité, résilience et scalabilité indépendante.",
      },
      {
        id: "q28", question: "Que fait la commande 'chmod 755' sous Linux ?", isActive: true,
        answers: [
          { id: "a1", text: "Supprime un fichier", isCorrect: false, isActive: true },
          { id: "a2", text: "Donne les droits rwx au propriétaire, rx aux autres", isCorrect: true, isActive: true },
          { id: "a3", text: "Change le propriétaire du fichier", isCorrect: false, isActive: true },
          { id: "a4", text: "Crée un nouveau dossier", isCorrect: false, isActive: true },
        ],
        explanation: "755 signifie : lecture/écriture/exécution pour le propriétaire, lecture/exécution pour le groupe et les autres.",
      },
      {
        id: "q29", question: "Qu'est-ce que WebSocket ?", isActive: true,
        answers: [
          { id: "a1", text: "Un type de prise électrique", isCorrect: false, isActive: true },
          { id: "a2", text: "Un protocole de communication bidirectionnelle en temps réel", isCorrect: true, isActive: true },
          { id: "a3", text: "Un navigateur web", isCorrect: false, isActive: true },
          { id: "a4", text: "Un format d'image", isCorrect: false, isActive: true },
        ],
        explanation: "WebSocket permet une communication persistante et bidirectionnelle entre client et serveur.",
      },
      {
        id: "q30", question: "Quelle est la complexité temporelle d'une recherche dans une table de hachage ?", isActive: true,
        answers: [
          { id: "a1", text: "O(n)", isCorrect: false, isActive: true },
          { id: "a2", text: "O(1) en moyenne", isCorrect: true, isActive: true },
          { id: "a3", text: "O(log n)", isCorrect: false, isActive: true },
          { id: "a4", text: "O(n²)", isCorrect: false, isActive: true },
        ],
        explanation: "Les tables de hachage offrent un accès en temps constant O(1) en moyenne grâce au hachage.",
      },
    ],
    resultMessages: [
      { minScore: 0, maxScore: 30, title: "Débutant curieux 🌱", message: "Pas mal de notions à découvrir, mais c'est un excellent début !" },
      { minScore: 31, maxScore: 50, title: "En progression 📈", message: "Vous avez des bases solides. Continuez à explorer !" },
      { minScore: 51, maxScore: 70, title: "Bon niveau tech 💡", message: "Belle culture technologique ! Quelques détails à approfondir." },
      { minScore: 71, maxScore: 85, title: "Très bon ! 🏅", message: "Impressionnant ! Vous maîtrisez bien le paysage tech." },
      { minScore: 86, maxScore: 100, title: "Expert tech ! 🚀", message: "Bravo ! Vous avez une culture tech exceptionnelle." },
    ],
  },
];
