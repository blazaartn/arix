// data.ts - JavaScript Course Data (Full Curriculum)

export type ContentBlock =
  | { type: 'theory'; title?: string; text: string; visualSuggestion?: string; }
  | { type: 'code-block'; language: 'javascript' | 'html'; code: string; title?: string; }
  | { type: 'interactive-demo'; title: string; description: string; initialHTML: string; initialJS: string; initialCSS?: string; }
  | { type: 'table-comparison'; headers: string[]; rows: (string | string[])[][]; caption?: string; }
  | { type: 'note'; text: string; style?: 'info' | 'warning' | 'tip'; }
  | { type: 'example-box'; title: string; description: string; code: string; result?: string; };

export type Exercise = {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code-practice';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  explanation: string;
  codeSnippet?: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: ContentBlock[];
  exercises: Exercise[];
  keyTakeaways: string[];
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dependencies?: string[];
};

export type Chapter = {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
};

export type CourseData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  chapters: Chapter[];
};

// ============================================================
// COURSE STRUCTURE
// ============================================================

export const courseStructure: CourseData = {
  id: 'js-full-course',
  title: 'JavaScript : Le Guide Complet',
  subtitle: 'Du DOM aux fonctions',
  description: 'Maîtrisez JavaScript de zéro. Apprenez les bases du langage, la manipulation du DOM, les événements, et créez des interactions dynamiques.',
  chapters: [
    {
      id: 'ch-js-01',
      title: 'Introduction & Variables',
      description: 'Découvrez JavaScript et apprenez à déclarer des variables.',
      lessonIds: ['lesson-js-01', 'lesson-js-02']
    },
    {
      id: 'ch-js-02',
      title: 'Types de données & Opérateurs',
      description: 'Explorez les types de données et les opérateurs en JavaScript.',
      lessonIds: ['lesson-js-03', 'lesson-js-04']
    },
    {
      id: 'ch-js-03',
      title: 'Structures de contrôle & Fonctions',
      description: 'Apprenez les conditions, les boucles et les fonctions.',
      lessonIds: ['lesson-js-05', 'lesson-js-06']
    },
    {
      id: 'ch-js-04',
      title: 'Manipulation du DOM',
      description: 'Interagissez avec les éléments HTML et modifiez le contenu dynamiquement.',
      lessonIds: ['lesson-js-07', 'lesson-js-08']
    }
  ]
};

// ============================================================
// LESSON CONTENT
// ============================================================

export const lessonContent: Record<string, Lesson> = {

  // --------------------------------------------------------------
  // LEÇON 1: Introduction à JavaScript
  // --------------------------------------------------------------
  'lesson-js-01': {
    id: 'lesson-js-01',
    title: 'Introduction à JavaScript',
    description: 'Découvrez ce qu\'est JavaScript et comment l\'intégrer dans une page HTML.',
    estimatedMinutes: 12,
    difficulty: 'beginner',
    dependencies: [],
    content: [
      {
        type: 'theory',
        text: 'JavaScript est un langage de programmation essentiel pour le développement web. Il est principalement utilisé pour ajouter de l\'interactivité aux sites web, comme les animations, la validation de formulaires, ou les mises à jour dynamiques sans recharger la page.\n\nAvec JavaScript, on peut manipuler le DOM (Document Object Model) pour modifier dynamiquement le contenu et le style d\'une page et créer des applications web interactives.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Structure HTML avec DOM',
        code: `<!DOCTYPE html>\n<html lang="fr">\n<head>\n    <meta charset="UTF-8">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>Ceci est un paragraphe.</p>\n</body>\n</html>`
      },
      {
        type: 'theory',
        title: 'Intégration de JavaScript',
        text: 'Il existe trois façons d\'intégrer JavaScript dans une page HTML :\n\n1. Intégration interne : dans une balise <script>\n2. Intégration externe : dans un fichier .js avec src\n3. Intégration en ligne : dans les attributs HTML (onclick, etc.)'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Intégration interne',
        code: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Exemple</title>\n    <script>\n        alert("Bonjour depuis JavaScript !");\n    </script>\n</head>\n<body>\n    <h1>Intégration interne</h1>\n</body>\n</html>`
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Intégration externe',
        code: `<!-- Fichier HTML -->\n<script src="script.js"></script>\n\n// script.js\nalert("Bonjour depuis un fichier externe !");`
      },
      {
        type: 'note',
        text: 'L\'intégration externe est recommandée pour séparer le contenu (HTML) du comportement (JavaScript).',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'JavaScript ajoute de l\'interactivité aux pages web.',
      'Le DOM est la représentation HTML manipulable par JavaScript.',
      'On peut intégrer JS en interne, externe ou en ligne.'
    ],
    exercises: [
      {
        id: 'ex-js-01-01',
        type: 'multiple-choice',
        question: 'Quelle est la méthode recommandée pour intégrer JavaScript ?',
        options: ['Interne (balise <script>)', 'Externe (fichier .js)', 'En ligne (onclick)', 'Toutes sont équivalentes'],
        correctAnswer: 'Externe (fichier .js)',
        hint: 'Pensez à la séparation des responsabilités.',
        explanation: 'L\'intégration externe sépare le contenu HTML du comportement JavaScript, ce qui facilite la maintenance.'
      },
      {
        id: 'ex-js-01-02',
        type: 'true-false',
        question: 'JavaScript peut être utilisé pour manipuler le contenu HTML dynamiquement.',
        correctAnswer: 'true',
        hint: 'Pensez à ce que JS fait sur les pages web.',
        explanation: 'JavaScript peut modifier le contenu, le style et la structure d\'une page HTML via le DOM.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 2: Variables (let, const) et Affichage
  // --------------------------------------------------------------
  'lesson-js-02': {
    id: 'lesson-js-02',
    title: 'Variables et Affichage',
    description: 'Apprenez à déclarer des variables avec let et const, et à afficher des données.',
    estimatedMinutes: 16,
    difficulty: 'beginner',
    dependencies: ['lesson-js-01'],
    content: [
      {
        type: 'theory',
        title: 'Déclaration des variables',
        text: 'JavaScript propose trois mots-clés pour déclarer des variables :\n\n• let : variable modifiable, portée de bloc\n• const : constante, ne peut pas être réassignée\n• var : ancienne méthode (à éviter)\n\nDifférences clés :\n• let peut être réassigné, const non\n• let peut être déclaré sans valeur, const doit être initialisé'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Exemples avec let et const',
        code: `// let - variable modifiable\nlet age = 25;\nconsole.log(age); // 25\nage = 30; // Modification autorisée\nconsole.log(age); // 30\n\n// const - constante\nconst PI = 3.14;\nconsole.log(PI); // 3.14\n// PI = 3.14159; // Erreur !\n\n// let non initialisé\nlet nom;\nconsole.log(nom); // undefined\n\n// null - valeur vide intentionnelle\nlet adresse = null;`
      },
      {
        type: 'theory',
        title: 'Affichage des données',
        text: 'JavaScript offre plusieurs méthodes pour afficher des données :\n\n• alert(message) : fenêtre modale\n• console.log(message) : dans la console du navigateur\n• document.write(message) : dans la page HTML'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Méthodes d\'affichage',
        code: `// Alert - fenêtre modale\nalert("Bienvenue sur mon site !");\n\n// Console - pour le débogage\nconsole.log("Message dans la console");\n\n// Document.write - écrit dans la page\ndocument.write("<p>Bonjour, monde !</p>");`
      },
      {
        type: 'interactive-demo',
        title: 'Essayez les variables',
        description: 'Modifiez le code et voyez le résultat.',
        initialHTML: `<h1 id="demo">Variables</h1>\n<button onclick="runCode()">Exécuter</button>\n<p id="output"></p>`,
        initialJS: `function runCode() {\n  let nom = "Jean";\n  const age = 25;\n  \n  let message = "Bonjour " + nom + ", tu as " + age + " ans !";\n  document.getElementById("output").textContent = message;\n  console.log(message);\n}`,
        initialCSS: `button {\n  padding: 10px 20px;\n  background: #ff6b35;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}\n#output {\n  margin-top: 10px;\n  padding: 10px;\n  background: #f0f4ff;\n  border-radius: 8px;\n}`
      },
      {
        type: 'table-comparison',
        headers: ['Mot-clé', 'Réassignable', 'Portée', 'Exemple'],
        rows: [
          ['let', 'Oui', 'Bloc {}', 'let x = 5; x = 10;'],
          ['const', 'Non', 'Bloc {}', 'const PI = 3.14;'],
          ['var', 'Oui', 'Fonction', 'var x = 5; (à éviter)']
        ],
        caption: 'Comparaison des mots-clés de déclaration'
      },
      {
        type: 'note',
        text: 'undefined signifie qu\'une variable a été déclarée mais n\'a pas de valeur. null est une valeur vide intentionnelle.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'Utilisez let pour les variables modifiables.',
      'Utilisez const pour les constantes.',
      'alert affiche une fenêtre modale.',
      'console.log est idéal pour le débogage.'
    ],
    exercises: [
      {
        id: 'ex-js-02-01',
        type: 'multiple-choice',
        question: 'Quel mot-clé permet de déclarer une variable qui ne peut pas être réassignée ?',
        options: ['let', 'const', 'var', 'static'],
        correctAnswer: 'const',
        hint: 'Ce mot-clé signifie "constante".',
        explanation: 'const déclare une constante qui ne peut pas être réassignée après sa déclaration initiale.'
      },
      {
        id: 'ex-js-02-02',
        type: 'code-practice',
        question: 'Écrivez une variable avec let qui stocke votre prénom, puis affichez-la dans la console.',
        correctAnswer: 'let prenom = "Jean"; console.log(prenom);',
        hint: 'Utilisez let pour déclarer et console.log pour afficher.',
        explanation: 'let prenom = "Jean"; console.log(prenom); déclare une variable et l\'affiche dans la console.',
        codeSnippet: '// Écrivez votre code ici\n'
      },
      {
        id: 'ex-js-02-03',
        type: 'fill-blank',
        question: 'La valeur d\'une variable déclarée mais non initialisée est ______.',
        correctAnswer: 'undefined',
        hint: 'C\'est la valeur par défaut d\'une variable non initialisée.',
        explanation: 'undefined est la valeur d\'une variable déclarée mais sans valeur assignée.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 3: Types de données - Number, String, Boolean
  // --------------------------------------------------------------
  'lesson-js-03': {
    id: 'lesson-js-03',
    title: 'Types de données : Number, String, Boolean',
    description: 'Découvrez les types de données fondamentaux en JavaScript.',
    estimatedMinutes: 18,
    difficulty: 'beginner',
    dependencies: ['lesson-js-02'],
    content: [
      {
        type: 'theory',
        title: 'Le type Number (Nombres)',
        text: 'JavaScript utilise le type number pour tous les nombres, entiers ou décimaux.\n\nOpérations arithmétiques :\n• + addition\n• - soustraction\n• * multiplication\n• / division\n• % modulo (reste)\n• ++ incrémentation\n• -- décrémentation'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Opérations sur les nombres',
        code: `let a = 10;\nlet b = 3;\n\nconsole.log(a + b);  // 13\nconsole.log(a - b);  // 7\nconsole.log(a * b);  // 30\nconsole.log(a / b);  // 3.333...\nconsole.log(a % b);  // 1 (reste)\n\nlet x = 5;\nx++; // incrémentation\nconsole.log(x); // 6\n\nlet y = 8;\ny--; // décrémentation\nconsole.log(y); // 7`
      },
      {
        type: 'theory',
        title: 'Le type String (Chaînes de caractères)',
        text: 'Les chaînes de caractères sont des séquences de texte, délimitées par des guillemets simples ( \' ), doubles ( " ) ou des backticks ( ` ).\n\nPropriétés et méthodes :\n• length : longueur de la chaîne\n• indexOf() : position d\'un caractère\n• lastIndexOf() : dernière position\n• + : concaténation'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Opérations sur les chaînes',
        code: `let message = "Bonjour JavaScript";\n\n// Concaténation\nlet salutation = "Bonjour" + " " + "Monde";\nconsole.log(salutation); // "Bonjour Monde"\n\n// Longueur\nconsole.log(message.length); // 20\n\n// Position d'un caractère\nconsole.log(message.indexOf("J")); // 8\nconsole.log(message.lastIndexOf("a")); // 16`
      },
      {
        type: 'theory',
        title: 'Le type Boolean (Booléens)',
        text: 'Le type booléen n\'a que deux valeurs : true (vrai) ou false (faux).\n\nIl est souvent le résultat d\'opérations de comparaison ou logiques.'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Opérations booléennes',
        code: `let estMajeure = true;\nlet aFini = false;\n\n// Comparaisons\nlet age = 20;\nlet estAdulte = age >= 18; // true\n\n// Opérateurs logiques\nlet aCarte = true;\nlet peutEntrer = estAdulte && aCarte; // true\n\nlet aPermission = false;\nlet peutPartir = aPermission || age > 18; // true (age > 18)\n\n// Négation\nlet estEnfant = !estAdulte; // false`
      },
      {
        type: 'table-comparison',
        headers: ['Opérateur', 'Description', 'Exemple', 'Résultat'],
        rows: [
          ['+', 'Addition / Concaténation', '5 + 3', '8'],
          ['-', 'Soustraction', '5 - 3', '2'],
          ['*', 'Multiplication', '5 * 3', '15'],
          ['/', 'Division', '15 / 3', '5'],
          ['%', 'Modulo (reste)', '5 % 3', '2'],
          ['++', 'Incrémentation', 'let x = 5; x++;', '6'],
          ['--', 'Décrémentation', 'let x = 5; x--;', '4']
        ],
        caption: 'Opérateurs arithmétiques'
      },
      {
        type: 'table-comparison',
        headers: ['Opérateur', 'Description', 'Exemple', 'Résultat'],
        rows: [
          ['==', 'Égalité (valeur)', '5 == "5"', 'true'],
          ['===', 'Égalité (valeur + type)', '5 === "5"', 'false'],
          ['!=', 'Différent', '5 != 3', 'true'],
          ['>', 'Supérieur', '10 > 5', 'true'],
          ['<', 'Inférieur', '5 < 10', 'true'],
          ['>=', 'Supérieur ou égal', '10 >= 10', 'true'],
          ['<=', 'Inférieur ou égal', '5 <= 10', 'true']
        ],
        caption: 'Opérateurs de comparaison'
      },
      {
        type: 'note',
        text: 'Préférez === et !== pour comparer les valeurs ET les types, évitant les conversions implicites.',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'number pour tous les nombres (entiers et décimaux).',
      'string pour le texte (guillemets simples, doubles ou backticks).',
      'boolean pour true/false.',
      '=== compare la valeur ET le type.',
      '++ incrémente de 1, -- décrémente de 1.'
    ],
    exercises: [
      {
        id: 'ex-js-03-01',
        type: 'multiple-choice',
        question: 'Quel opérateur compare la valeur ET le type ?',
        options: ['==', '===', '=', '!='],
        correctAnswer: '===',
        hint: 'Il compare aussi le type, pas seulement la valeur.',
        explanation: '=== est l\'opérateur d\'égalité stricte qui compare la valeur et le type.'
      },
      {
        id: 'ex-js-03-02',
        type: 'code-practice',
        question: 'Écrivez une expression booléenne qui vérifie si une variable age est supérieure ou égale à 18.',
        correctAnswer: 'age >= 18',
        hint: 'Utilisez l\'opérateur >=.',
        explanation: 'age >= 18 retourne true si age est supérieur ou égal à 18.',
        codeSnippet: '// Écrivez votre code ici\n'
      },
      {
        id: 'ex-js-03-03',
        type: 'true-false',
        question: 'Le résultat de 5 + "5" est 10.',
        correctAnswer: 'false',
        hint: 'Pensez à la concaténation vs l\'addition.',
        explanation: '5 + "5" donne "55" (concaténation) car l\'un des opérandes est une chaîne.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 4: Tableaux, Date et Conversion
  // --------------------------------------------------------------
  'lesson-js-04': {
    id: 'lesson-js-04',
    title: 'Tableaux, Date et Conversion',
    description: 'Apprenez à utiliser les tableaux, l\'objet Date et les conversions de types.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-js-03'],
    content: [
      {
        type: 'theory',
        title: 'Les tableaux (Array)',
        text: 'Un tableau est une collection ordonnée de valeurs. Les valeurs peuvent être de n\'importe quel type.\n\nPropriétés et méthodes :\n• length : nombre d\'éléments\n• index : position d\'un élément (commence à 0)\n• push() : ajouter à la fin\n• pop() : retirer le dernier\n• forEach() : parcourir'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Opérations sur les tableaux',
        code: `// Création d'un tableau\nlet fruits = ["pomme", "banane", "cerise"];\n\n// Accès à un élément (index 0)\nconsole.log(fruits[0]); // "pomme"\n\n// Modification\nfruits[1] = "orange";\nconsole.log(fruits); // ["pomme", "orange", "cerise"]\n\n// Longueur\nconsole.log(fruits.length); // 3\n\n// Ajout à la fin\nfruits.push("kiwi");\nconsole.log(fruits); // ["pomme", "orange", "cerise", "kiwi"]\n\n// Parcours avec forEach\nfruits.forEach(function(fruit) {\n  console.log(fruit);\n});`
      },
      {
        type: 'theory',
        title: 'L\'objet Date',
        text: 'L\'objet Date permet de travailler avec les dates et les heures.\n\nMéthodes principales :\n• new Date() : date et heure actuelles\n• getDate() : jour du mois (1-31)\n• getMonth() : mois (0-11)\n• getFullYear() : année sur 4 chiffres'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Utilisation de Date',
        code: `// Date actuelle\nlet maintenant = new Date();\nconsole.log(maintenant);\n\n// Date spécifique\nlet date = new Date("2025-08-19");\nconsole.log(date);\n\n// Récupérer les composants\nlet jour = date.getDate();\nlet mois = date.getMonth() + 1; // +1 car janvier = 0\nlet annee = date.getFullYear();\nconsole.log(jour + "/" + mois + "/" + annee); // "19/8/2025"`
      },
      {
        type: 'theory',
        title: 'Conversion de types',
        text: 'JavaScript permet de convertir des valeurs d\'un type à un autre.\n\n• Number() : convertit en nombre\n• parseInt() : convertit en entier\n• parseFloat() : convertit en nombre décimal\n• String() : convertit en chaîne'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Conversions de types',
        code: `// Conversion en nombre\nconsole.log(Number("42"));       // 42\nconsole.log(Number("42.5"));     // 42.5\nconsole.log(parseInt("42"));     // 42\nconsole.log(parseInt("42.9"));   // 42\nconsole.log(parseFloat("42.5")); // 42.5\n\n// Conversion en chaîne\nconsole.log(String(42));         // "42"\nconsole.log(String(true));       // "true"\n\n// Conversion automatique (coercition)\nconsole.log("10" + 5);    // "105" (concaténation)\nconsole.log("10" - 5);    // 5 (soustraction)`
      },
      {
        type: 'table-comparison',
        headers: ['Méthode', 'Description', 'Exemple', 'Résultat'],
        rows: [
          ['Number()', 'Convertit en nombre', 'Number("42")', '42'],
          ['parseInt()', 'Convertit en entier', 'parseInt("42.9")', '42'],
          ['parseFloat()', 'Convertit en décimal', 'parseFloat("42.5")', '42.5'],
          ['String()', 'Convertit en chaîne', 'String(42)', '"42"']
        ],
        caption: 'Méthodes de conversion'
      },
      {
        type: 'note',
        text: 'La méthode prompt(message) permet de demander une saisie à l\'utilisateur et retourne une chaîne.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'Les tableaux sont des collections ordonnées (index 0).',
      'length donne le nombre d\'éléments.',
      'Date permet de manipuler les dates.',
      'Number(), parseInt(), parseFloat() convertissent en nombres.'
    ],
    exercises: [
      {
        id: 'ex-js-04-01',
        type: 'multiple-choice',
        question: 'Quelle méthode convertit une chaîne en nombre entier ?',
        options: ['Number()', 'parseInt()', 'parseFloat()', 'String()'],
        correctAnswer: 'parseInt()',
        hint: 'Cette méthode retire les décimales.',
        explanation: 'parseInt("42.9") donne 42, elle convertit en entier.'
      },
      {
        id: 'ex-js-04-02',
        type: 'code-practice',
        question: 'Créez un tableau avec 3 fruits et affichez le dernier élément.',
        correctAnswer: 'let fruits = ["pomme", "banane", "cerise"]; console.log(fruits[2]);',
        hint: 'Les indices commencent à 0.',
        explanation: 'fruits[2] accède au troisième élément (index 2).',
        codeSnippet: '// Écrivez votre code ici\n'
      },
      {
        id: 'ex-js-04-03',
        type: 'fill-blank',
        question: 'La méthode qui ajoute un élément à la fin d\'un tableau est ______.',
        correctAnswer: 'push()',
        hint: 'Elle "pousse" un élément à la fin.',
        explanation: 'push() ajoute un élément à la fin du tableau.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 5: Structures conditionnelles
  // --------------------------------------------------------------
  'lesson-js-05': {
    id: 'lesson-js-05',
    title: 'Structures conditionnelles (if, else, switch)',
    description: 'Apprenez à exécuter du code en fonction de conditions.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-js-03'],
    content: [
      {
        type: 'theory',
        title: 'Les conditions',
        text: 'Les structures conditionnelles permettent d\'exécuter des blocs de code selon des conditions.\n\n• if : exécute si la condition est vraie\n• else : exécute si la condition est fausse\n• else if : teste une autre condition\n• switch : compare une valeur à plusieurs cas'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Structure if/else',
        code: `let age = 20;\n\nif (age >= 18) {\n  console.log("Vous êtes majeur");\n} else {\n  console.log("Vous êtes mineur");\n}\n\n// if/else if/else\nlet note = 15;\nif (note >= 16) {\n  console.log("Excellent");\n} else if (note >= 14) {\n  console.log("Très bien");\n} else if (note >= 12) {\n  console.log("Bien");\n} else if (note >= 10) {\n  console.log("Passable");\n} else {\n  console.log("Insuffisant");\n}`
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Structure switch',
        code: `let jour = "lundi";\n\nswitch (jour) {\n  case "lundi":\n    console.log("Début de semaine");\n    break;\n  case "mardi":\n  case "mercredi":\n  case "jeudi":\n    console.log("Milieu de semaine");\n    break;\n  case "vendredi":\n    console.log("Fin de semaine");\n    break;\n  case "samedi":\n  case "dimanche":\n    console.log("Week-end !");\n    break;\n  default:\n    console.log("Jour invalide");\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Testez les conditions',
        description: 'Modifiez la valeur de age et voyez le résultat.',
        initialHTML: `<h1>Test de condition</h1>\n<button onclick="tester()">Tester</button>\n<p id="resultat"></p>`,
        initialJS: `function tester() {\n  let age = 18;\n  let message;\n  \n  if (age >= 18) {\n    message = "Vous êtes majeur (âge: " + age + ")";\n  } else {\n    message = "Vous êtes mineur (âge: " + age + ")";\n  }\n  \n  document.getElementById("resultat").textContent = message;\n}`,
        initialCSS: `button {\n  padding: 10px 20px;\n  background: #ff6b35;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}\n#resultat {\n  margin-top: 10px;\n  padding: 10px;\n  background: #f0f4ff;\n  border-radius: 8px;\n  font-weight: bold;\n}`
      },
      {
        type: 'table-comparison',
        headers: ['Structure', 'Description', 'Utilisation'],
        rows: [
          ['if', 'Exécute si condition vraie', 'if (age >= 18) { ... }'],
          ['else', 'Exécute si condition fausse', 'else { ... }'],
          ['else if', 'Teste une autre condition', 'else if (note >= 14) { ... }'],
          ['switch', 'Compare à plusieurs cas', 'switch (jour) { case "lundi": ... }']
        ],
        caption: 'Structures conditionnelles'
      },
      {
        type: 'note',
        text: 'Le break dans switch empêche l\'exécution des cas suivants (fallthrough).',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'if exécute du code si la condition est vraie.',
      'else exécute du code si la condition est fausse.',
      'else if permet de tester plusieurs conditions.',
      'switch compare une valeur à plusieurs cas.'
    ],
    exercises: [
      {
        id: 'ex-js-05-01',
        type: 'multiple-choice',
        question: 'Que fait le mot-clé break dans un switch ?',
        options: ['Il arrête le programme', 'Il sort du switch', 'Il passe au cas suivant', 'Il affiche une erreur'],
        correctAnswer: 'Il sort du switch',
        hint: 'Il empêche l\'exécution des cas suivants.',
        explanation: 'break interrompt l\'exécution du switch et sort du bloc, évitant le fallthrough.'
      },
      {
        id: 'ex-js-05-02',
        type: 'code-practice',
        question: 'Écrivez une condition if/else qui vérifie si une variable note est supérieure ou égale à 10.',
        correctAnswer: 'if (note >= 10) { console.log("Validé"); } else { console.log("Non validé"); }',
        hint: 'Utilisez >= pour comparer.',
        explanation: 'if (note >= 10) { ... } else { ... } vérifie si note est >= 10.',
        codeSnippet: '// Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 6: Fonctions
  // --------------------------------------------------------------
  'lesson-js-06': {
    id: 'lesson-js-06',
    title: 'Fonctions',
    description: 'Apprenez à créer et utiliser des fonctions pour réutiliser du code.',
    estimatedMinutes: 14,
    difficulty: 'intermediate',
    dependencies: ['lesson-js-05'],
    content: [
      {
        type: 'theory',
        title: 'Les fonctions',
        text: 'Une fonction est un bloc de code réutilisable qui peut recevoir des paramètres et retourner une valeur.\n\nSyntaxe :\nfunction nom(param1, param2) {\n  // Instructions\n  return valeur;\n}\n\nAvantages :\n• Réutilisabilité du code\n• Organisation du code\n• Facilité de maintenance'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Exemples de fonctions',
        code: `// Fonction simple\nfunction direBonjour() {\n  console.log("Bonjour !");\n}\ndireBonjour();\n\n// Fonction avec paramètres\nfunction addition(a, b) {\n  return a + b;\n}\nlet resultat = addition(5, 3);\nconsole.log(resultat); // 8\n\n// Fonction avec paramètre par défaut\nfunction saluer(nom = "Visiteur") {\n  return "Bonjour " + nom + " !";\n}\nconsole.log(saluer());         // "Bonjour Visiteur !"\nconsole.log(saluer("Jean"));   // "Bonjour Jean !"\n\n// Fonction qui retourne plusieurs valeurs\nfunction calculer(x, y) {\n  return {\n    somme: x + y,\n    produit: x * y\n  };\n}\nlet resultats = calculer(4, 5);\nconsole.log(resultats.somme);   // 9\nconsole.log(resultats.produit); // 20`
      },
      {
        type: 'interactive-demo',
        title: 'Créez votre fonction',
        description: 'Modifiez la fonction et voyez le résultat.',
        initialHTML: `<h1>Fonctions</h1>\n<button onclick="utiliser()">Exécuter</button>\n<p id="resultat"></p>`,
        initialJS: `function multiplier(a, b) {\n  return a * b;\n}\n\nfunction utiliser() {\n  let x = 5;\n  let y = 3;\n  let resultat = multiplier(x, y);\n  document.getElementById("resultat").textContent = \n    x + " × " + y + " = " + resultat;\n}`,
        initialCSS: `button {\n  padding: 10px 20px;\n  background: #ff6b35;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}\n#resultat {\n  margin-top: 10px;\n  padding: 10px;\n  background: #f0f4ff;\n  border-radius: 8px;\n  font-size: 18px;\n  font-weight: bold;\n}`
      },
      {
        type: 'note',
        text: 'Les fonctions peuvent être définies avant ou après leur appel (hoisting).',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'Une fonction est un bloc de code réutilisable.',
      'function nom(paramètres) { instructions }',
      'return retourne une valeur.',
      'Les paramètres ont une valeur par défaut possible.'
    ],
    exercises: [
      {
        id: 'ex-js-06-01',
        type: 'multiple-choice',
        question: 'Quel mot-clé permet de retourner une valeur depuis une fonction ?',
        options: ['return', 'break', 'continue', 'exit'],
        correctAnswer: 'return',
        hint: 'Ce mot-clé termine la fonction et retourne une valeur.',
        explanation: 'return termine l\'exécution de la fonction et retourne une valeur au code appelant.'
      },
      {
        id: 'ex-js-06-02',
        type: 'code-practice',
        question: 'Écrivez une fonction qui prend deux nombres et retourne leur produit.',
        correctAnswer: 'function produit(a, b) { return a * b; }',
        hint: 'Utilisez function, deux paramètres, et l\'opérateur *.',
        explanation: 'function produit(a, b) { return a * b; } définit une fonction qui multiplie deux nombres.',
        codeSnippet: '// Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 7: Manipulation du DOM - Ciblage et innerHTML
  // --------------------------------------------------------------
  'lesson-js-07': {
    id: 'lesson-js-07',
    title: 'Manipulation du DOM (Ciblage et innerHTML)',
    description: 'Apprenez à cibler des éléments HTML et à modifier leur contenu.',
    estimatedMinutes: 18,
    difficulty: 'intermediate',
    dependencies: ['lesson-js-01'],
    content: [
      {
        type: 'theory',
        title: 'Ciblage des éléments',
        text: 'Pour manipuler un élément HTML, il faut d\'abord le cibler.\n\nMéthodes principales :\n• document.getElementById("id") : cible par ID (unique)\n• document.getElementsByName("nom") : cible par name (plusieurs)\n• document.querySelector("sélecteur") : cible le premier élément\n• document.querySelectorAll("sélecteur") : cible tous les éléments'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Ciblage des éléments',
        code: `// Par ID (retourne un seul élément)\nlet titre = document.getElementById("titre");\nconsole.log(titre.innerHTML);\n\n// Par Name (retourne un tableau)\nlet radios = document.getElementsByName("genre");\nconsole.log(radios[0].value);\n\n// Par sélecteur CSS (premier élément)\nlet premierParagraphe = document.querySelector(".paragraphe");\n\n// Par sélecteur CSS (tous les éléments)\nlet tousParagraphes = document.querySelectorAll("p");\nconsole.log(tousParagraphes.length);`
      },
      {
        type: 'theory',
        title: 'Modification du contenu avec innerHTML',
        text: 'innerHTML permet de lire ou modifier le contenu HTML d\'un élément.\n\n• Lire : element.innerHTML\n• Modifier : element.innerHTML = "nouveau contenu"\n\nAttention : innerHTML peut être vulnérable aux XSS (Cross-Site Scripting) si le contenu provient d\'une source non fiable. Utilisez textContent quand c\'est possible.'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Utilisation de innerHTML (sécurisé)',
        code: `// HTML\n// <p id="paragraphe">Texte original</p>\n// <button onclick="changer()">Changer</button>\n\nfunction changer() {\n  let p = document.getElementById("paragraphe");\n  \n  // Modification sécurisée (texte uniquement)\n  p.textContent = "Texte modifié avec JavaScript";\n  \n  // OU avec innerHTML (si contenu fiable)\n  p.innerHTML = "<strong>Texte en gras</strong>";\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Manipulation du DOM',
        description: 'Cliquez sur les boutons pour modifier le contenu.',
        initialHTML: `<h1 id="titre">Titre original</h1>\n<p id="paragraphe">Paragraphe original</p>\n<button onclick="modifierTitre()">Modifier titre</button>\n<button onclick="modifierParagraphe()">Modifier paragraphe</button>\n<button onclick="reinitialiser()">Réinitialiser</button>`,
        initialJS: `function modifierTitre() {\n  let titre = document.getElementById("titre");\n  titre.textContent = "Nouveau titre !";\n}\n\nfunction modifierParagraphe() {\n  let p = document.getElementById("paragraphe");\n  p.innerHTML = "Texte <strong>en gras</strong> et <em>en italique</em>";\n}\n\nfunction reinitialiser() {\n  document.getElementById("titre").textContent = "Titre original";\n  document.getElementById("paragraphe").textContent = "Paragraphe original";\n}`,
        initialCSS: `button {\n  padding: 8px 16px;\n  margin: 5px;\n  background: #ff6b35;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\nbutton:hover {\n  background: #e55a2b;\n}\n#titre, #paragraphe {\n  transition: all 0.3s;\n}`
      },
      {
        type: 'note',
        text: 'Préférez textContent à innerHTML quand vous affichez du texte simple pour éviter les risques XSS.',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'document.getElementById("id") cible un élément par son ID.',
      'document.getElementsByName("nom") cible par attribut name.',
      'innerHTML lit/modifie le contenu HTML.',
      'textContent est plus sécurisé pour du texte simple.',
      'Évitez innerHTML avec des données utilisateur non fiables (XSS).'
    ],
    exercises: [
      {
        id: 'ex-js-07-01',
        type: 'multiple-choice',
        question: 'Quelle méthode cible un élément par son ID ?',
        options: ['document.getElementById()', 'document.getElementsByClass()', 'document.getElementsByName()', 'document.querySelectorAll()'],
        correctAnswer: 'document.getElementById()',
        hint: 'L\'ID est unique dans une page.',
        explanation: 'document.getElementById("monId") retourne l\'élément avec l\'ID spécifié.'
      },
      {
        id: 'ex-js-07-02',
        type: 'true-false',
        question: 'innerHTML est toujours sûr à utiliser, même avec des données utilisateur.',
        correctAnswer: 'false',
        hint: 'Les données utilisateur peuvent contenir du code malveillant.',
        explanation: 'innerHTML peut être vulnérable aux attaques XSS si le contenu provient d\'une source non fiable. Utilisez textContent pour du texte simple.'
      },
      {
        id: 'ex-js-07-03',
        type: 'code-practice',
        question: 'Écrivez du code qui modifie le texte d\'un élément avec id="message" pour afficher "Bonjour le monde !"',
        correctAnswer: 'document.getElementById("message").textContent = "Bonjour le monde !";',
        hint: 'Utilisez getElementById et textContent.',
        explanation: 'document.getElementById("message").textContent = "Bonjour le monde !"; modifie le texte de l\'élément.',
        codeSnippet: '// Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 8: Attributs, Style et Médias
  // --------------------------------------------------------------
  'lesson-js-08': {
    id: 'lesson-js-08',
    title: 'Attributs, Style et Contrôle des médias',
    description: 'Modifiez les attributs, le style CSS et contrôlez les vidéos/audios.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-js-07'],
    content: [
      {
        type: 'theory',
        title: 'Modification des attributs',
        text: 'On peut modifier les attributs d\'un élément directement :\n\nelement.attribut = "nouvelleValeur";\n\nExemples :\n• element.src = "nouvelleImage.jpg"\n• element.href = "nouveauLien.html"\n• element.alt = "nouveau texte alternatif"'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Modification d\'attributs',
        code: `// HTML\n// <img id="photo" src="image1.jpg" alt="Image 1">\n\nfunction changerImage() {\n  let img = document.getElementById("photo");\n  img.src = "image2.jpg";\n  img.alt = "Nouvelle image";\n}`
      },
      {
        type: 'theory',
        title: 'Modification du style CSS',
        text: 'On peut modifier le style d\'un élément via la propriété style :\n\nelement.style.propriete = "valeur";\n\nAttention : les propriétés CSS avec tiret s\'écrivent en camelCase :\n• background-color → backgroundColor\n• font-size → fontSize\n• border-radius → borderRadius'
      },
      {
        type: 'code-block',
        language: 'javascript',
        title: 'Modification du style',
        code: `// HTML\n// <p id="texte">Bonjour tout le monde !</p>\n\nfunction changerCouleur() {\n  let p = document.getElementById("texte");\n  p.style.color = "red";\n  p.style.fontSize = "20px";\n  p.style.backgroundColor = "yellow";\n  p.style.borderRadius = "10px";\n  p.style.padding = "10px";\n}`
      },
      {
        type: 'theory',
        title: 'Contrôle des médias (vidéo/audio)',
        text: 'On peut contrôler la lecture des éléments vidéo et audio avec :\n\n• element.play() : démarre la lecture\n• element.pause() : met en pause\n\nLa cible doit être un élément <video> ou <audio>.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Contrôle d\'une vidéo',
        code: `<!-- HTML -->\n<video id="maVideo" width="320" height="240" controls>\n  <source src="video.mp4" type="video/mp4">\n</video>\n<br>\n<button onclick="lire()">Lire</button>\n<button onclick="pause()">Pause</button>\n\n<script>\n  let video = document.getElementById("maVideo");\n  \n  function lire() {\n    video.play();\n  }\n  \n  function pause() {\n    video.pause();\n  }\n</script>`
      },
      {
        type: 'interactive-demo',
        title: 'Manipulation du style',
        description: 'Cliquez pour changer le style de l\'élément.',
        initialHTML: `<div id="boite" style="width:200px;height:100px;background:#ff6b35;color:white;display:flex;align-items:center;justify-content:center;border-radius:12px;transition:all 0.3s;">\n  Style dynamique\n</div>\n<button onclick="changerCouleur()">Changer couleur</button>\n<button onclick="changerTaille()">Changer taille</button>\n<button onclick="reinitialiserStyle()">Réinitialiser</button>`,
        initialJS: `function changerCouleur() {\n  let boite = document.getElementById("boite");\n  const couleurs = ["#ff6b35", "#2563eb", "#10b981", "#8b5cf6", "#ef4444"];\n  const randomColor = couleurs[Math.floor(Math.random() * couleurs.length)];\n  boite.style.backgroundColor = randomColor;\n}\n\nfunction changerTaille() {\n  let boite = document.getElementById("boite");\n  boite.style.width = (Math.random() * 200 + 150) + "px";\n  boite.style.height = (Math.random() * 100 + 80) + "px";\n}\n\nfunction reinitialiserStyle() {\n  let boite = document.getElementById("boite");\n  boite.style.backgroundColor = "#ff6b35";\n  boite.style.width = "200px";\n  boite.style.height = "100px";\n}`,
        initialCSS: `button {\n  padding: 8px 16px;\n  margin: 5px;\n  background: #1a1a2e;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\nbutton:hover {\n  background: #16213e;\n}\n#boite {\n  margin-bottom: 10px;\n}`
      },
      {
        type: 'table-comparison',
        headers: ['Propriété CSS', 'JavaScript (camelCase)', 'Exemple'],
        rows: [
          ['background-color', 'backgroundColor', 'element.style.backgroundColor = "red"'],
          ['font-size', 'fontSize', 'element.style.fontSize = "20px"'],
          ['border-radius', 'borderRadius', 'element.style.borderRadius = "10px"'],
          ['margin-top', 'marginTop', 'element.style.marginTop = "10px"']
        ],
        caption: 'Conversion CSS → JavaScript'
      },
      {
        type: 'note',
        text: 'Les méthodes play() et pause() fonctionnent avec les éléments <video> et <audio>.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'element.attribut = valeur modifie les attributs.',
      'element.style.propriete = valeur modifie le style CSS.',
      'Les propriétés CSS avec tiret s\'écrivent en camelCase.',
      'play() et pause() contrôlent les médias.',
      'Toujours sécuriser les entrées utilisateur pour éviter les XSS.'
    ],
    exercises: [
      {
        id: 'ex-js-08-01',
        type: 'multiple-choice',
        question: 'Comment écrit-on font-size en JavaScript ?',
        options: ['font-size', 'fontSize', 'font_Size', 'FontSize'],
        correctAnswer: 'fontSize',
        hint: 'Le tiret est supprimé et la lettre suivante est en majuscule.',
        explanation: 'font-size devient fontSize en camelCase en JavaScript.'
      },
      {
        id: 'ex-js-08-02',
        type: 'code-practice',
        question: 'Écrivez du code qui change la couleur de fond d\'un élément avec id="boite" en bleu.',
        correctAnswer: 'document.getElementById("boite").style.backgroundColor = "blue";',
        hint: 'Utilisez getElementById et style.backgroundColor.',
        explanation: 'document.getElementById("boite").style.backgroundColor = "blue"; change la couleur de fond en bleu.',
        codeSnippet: '// Écrivez votre code ici\n'
      },
      {
        id: 'ex-js-08-03',
        type: 'true-false',
        question: 'La méthode play() est utilisée pour mettre une vidéo en pause.',
        correctAnswer: 'false',
        hint: 'play() démarre, pause() arrête.',
        explanation: 'play() démarre la lecture, pause() met en pause. C\'est l\'inverse.'
      }
    ]
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const fullJsCourse = {
  structure: courseStructure,
  lessons: lessonContent
};

export const getLessonById = (id: string): Lesson | undefined => {
  return lessonContent[id];
};

export const getLessonsByChapter = (chapterId: string): Lesson[] => {
  const chapter = courseStructure.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return [];
  return chapter.lessonIds.map(id => lessonContent[id]).filter(Boolean);
};

export const getTotalExercises = (): number => {
  let count = 0;
  for (const key in lessonContent) {
    count += lessonContent[key].exercises.length;
  }
  return count;
};

