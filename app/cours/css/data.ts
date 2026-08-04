// data-css.ts
// CSS Course Data — Full Curriculum

export type ContentBlock = 
  | { type: 'theory'; title?: string; text: string; visualSuggestion?: string; }
  | { type: 'code-block'; language: 'css' | 'html' | 'js'; code: string; title?: string; }
  | { type: 'interactive-demo'; title: string; description: string; initialCSS: string; initialHTML: string; }
  | { type: 'table-comparison'; headers: string[]; rows: (string | string[])[][]; caption?: string; }
  | { type: 'note'; text: string; style?: 'info' | 'warning' | 'tip'; }
  | { type: 'color-demo'; title: string; description: string; property: string; initialValue: string; }
  | { type: 'example-box'; title: string; description: string; code: string; result?: string; };

export type Exercise = {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code-practice' | 'color-picker';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  explanation: string;
  codeSnippet?: string;
  expectedCSS?: string;
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
  id: 'css-full-course',
  title: 'CSS : Le Guide Complet',
  subtitle: 'Du style de base aux animations',
  description: 'Maîtrisez CSS de zéro. Apprenez les sélecteurs, les propriétés de texte, les couleurs, les mises en page, les transformations, les transitions et les animations.',
  chapters: [
    {
      id: 'ch-css-01',
      title: 'Introduction & Sélecteurs',
      description: 'Comprenez ce qu\'est CSS et apprenez les différents types de sélecteurs.',
      lessonIds: ['lesson-css-01', 'lesson-css-02']
    },
    {
      id: 'ch-css-02',
      title: 'Couleurs & Arrière-plans',
      description: 'Explorez les couleurs, les arrière-plans et les bordures.',
      lessonIds: ['lesson-css-03', 'lesson-css-04']
    },
    {
      id: 'ch-css-03',
      title: 'Mise en page & Positionnement',
      description: 'Apprenez à structurer vos pages avec les propriétés de boîte et de positionnement.',
      lessonIds: ['lesson-css-05', 'lesson-css-06']
    },
    {
      id: 'ch-css-04',
      title: 'Transformations & Animations',
      description: 'Donnez vie à vos pages avec les transformations et les animations.',
      lessonIds: ['lesson-css-07', 'lesson-css-08']
    }
  ]
};

// ============================================================
// LESSON CONTENT
// ============================================================

export const lessonContent: Record<string, Lesson> = {

  // --------------------------------------------------------------
  // LEÇON 1: Introduction à CSS & Règles CSS
  // --------------------------------------------------------------
  'lesson-css-01': {
    id: 'lesson-css-01',
    title: 'Introduction à CSS & Les Règles CSS',
    description: 'Découvrez ce qu\'est CSS et comment structurer une règle CSS.',
    estimatedMinutes: 12,
    difficulty: 'beginner',
    dependencies: [],
    content: [
      {
        type: 'theory',
        text: 'CSS (Cascading Style Sheets) est un langage utilisé pour décrire la présentation visuelle des pages web. Il permet de contrôler la mise en forme des éléments HTML, comme les couleurs, les polices, les marges, et la disposition.\n\nCSS sépare le contenu (HTML) de la présentation, facilitant la maintenance et la modification de l\'apparence d\'un site web.'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Structure d\'une règle CSS',
        code: `/* Sélecteur + Déclaration */\np {\n  color: blue;\n  font-size: 16px;\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Essayez par vous-même',
        description: 'Modifiez le CSS ci-dessous et voyez le résultat en direct.',
        initialHTML: `<h1>Bonjour CSS</h1>\n<p>Ceci est un paragraphe.</p>`,
        initialCSS: `h1 {\n  color: #ff6b35;\n  text-align: center;\n}\np {\n  color: #4a4a4a;\n  font-size: 18px;\n}`
      },
      {
        type: 'table-comparison',
        headers: ['Partie', 'Description', 'Exemple'],
        rows: [
          ['Sélecteur', 'Identifie l\'élément à styliser', 'p, .classe, #id'],
          ['Propriété', 'Ce que vous voulez changer', 'color, font-size'],
          ['Valeur', 'La nouvelle valeur', 'blue, 16px']
        ],
        caption: 'Structure d\'une règle CSS'
      }
    ],
    keyTakeaways: [
      'CSS sépare le contenu (HTML) de la présentation.',
      'Une règle CSS = Sélecteur + Déclaration (propriété: valeur)',
      'Les règles CSS se placent dans <style> ou un fichier .css'
    ],
    exercises: [
      {
        id: 'ex-css-01-01',
        type: 'multiple-choice',
        question: 'Quelle est la structure correcte d\'une règle CSS ?',
        options: ['sélecteur { propriété: valeur }', 'propriété: valeur { sélecteur }', '<style> propriété: valeur </style>'],
        correctAnswer: 'sélecteur { propriété: valeur }',
        hint: 'Pensez à la structure vue dans la leçon.',
        explanation: 'Une règle CSS se compose d\'un sélecteur suivi d\'un bloc contenant des propriétés et leurs valeurs.'
      },
      {
        id: 'ex-css-01-02',
        type: 'code-practice',
        question: 'Écrivez une règle CSS qui rend tous les paragraphes rouges.',
        correctAnswer: 'p { color: red; }',
        hint: 'Utilisez le sélecteur p et la propriété color.',
        explanation: 'p { color: red; } cible tous les paragraphes et les rend rouges.',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 2: Types de Sélecteurs
  // --------------------------------------------------------------
  'lesson-css-02': {
    id: 'lesson-css-02',
    title: 'Les Sélecteurs CSS',
    description: 'Découvrez tous les types de sélecteurs : type, classe, ID, attribut, pseudo-classes.',
    estimatedMinutes: 18,
    difficulty: 'beginner',
    dependencies: ['lesson-css-01'],
    content: [
      {
        type: 'theory',
        title: 'Les différents sélecteurs',
        text: 'Les sélecteurs CSS permettent de cibler précisément les éléments HTML à styliser.\n\n• Sélecteur de type : cible par nom de balise (p, h1, div)\n• Sélecteur de classe : cible par classe (.ma-classe)\n• Sélecteur d\'ID : cible un élément unique (#mon-id)\n• Sélecteur universel : cible tous les éléments (*)\n• Sélecteur d\'attribut : cible par attribut ([type="text"])'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemples de sélecteurs',
        code: `/* Sélecteur de type */\np { color: blue; }\n\n/* Sélecteur de classe */\n.special { font-weight: bold; }\n\n/* Sélecteur d'ID */\n#header { background: black; }\n\n/* Sélecteur universel */\n* { margin: 0; }\n\n/* Sélecteur d'attribut */\ninput[type="text"] { border: 1px solid gray; }\n\n/* Pseudo-classe :hover */\nbutton:hover { background: orange; }`
      },
      {
        type: 'interactive-demo',
        title: 'Expérimentez avec les sélecteurs',
        description: 'Essayez différents sélecteurs sur ce HTML.',
        initialHTML: `<h1>Titre principal</h1>\n<p class="important">Paragraphe important</p>\n<p id="special">Paragraphe spécial</p>\n<button>Bouton</button>\n<input type="text" placeholder="Texte">`,
        initialCSS: `.important {\n  color: red;\n  font-weight: bold;\n}\n#special {\n  background: yellow;\n  padding: 10px;\n}\nbutton:hover {\n  background: #ff6b35;\n  color: white;\n}`
      },
      {
        type: 'table-comparison',
        headers: ['Sélecteur', 'Syntaxe', 'Cible'],
        rows: [
          ['Type', 'p', 'Tous les paragraphes'],
          ['Classe', '.ma-classe', 'Éléments avec class="ma-classe"'],
          ['ID', '#mon-id', 'L\'élément avec id="mon-id"'],
          ['Universel', '*', 'Tous les éléments'],
          ['Attribut', '[type="text"]', 'Éléments avec type="text"'],
          ['Pseudo-classe', 'p:hover', 'Paragraphes survolés']
        ],
        caption: 'Types de sélecteurs'
      },
      {
        type: 'note',
        text: 'Les pseudo-classes comme :hover, :active, :focus permettent de styliser les éléments selon leur état.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'Utilisez des classes (.classe) pour des styles réutilisables.',
      'Utilisez des IDs (#id) pour des éléments uniques.',
      'Les pseudo-classes permettent des styles interactifs (:hover, :focus).'
    ],
    exercises: [
      {
        id: 'ex-css-02-01',
        type: 'multiple-choice',
        question: 'Quel sélecteur cible les éléments avec class="important" ?',
        options: ['#important', '.important', 'important', '*important'],
        correctAnswer: '.important',
        hint: 'Les classes commencent par un point.',
        explanation: 'Le sélecteur .important cible tous les éléments avec la classe "important".'
      },
      {
        id: 'ex-css-02-02',
        type: 'code-practice',
        question: 'Écrivez une règle qui rend un bouton vert lorsqu\'on le survole.',
        correctAnswer: 'button:hover { background: green; }',
        hint: 'Utilisez button:hover et la propriété background.',
        explanation: 'button:hover { background: green; } rend le bouton vert au survol.',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      },
      {
        id: 'ex-css-02-03',
        type: 'color-picker',
        question: 'Choisissez la couleur de fond pour le sélecteur .highlight.',
        correctAnswer: '#ff6b35',
        hint: 'Choisissez une couleur orange.',
        explanation: '.highlight { background-color: #ff6b35; }',
        codeSnippet: '.highlight {\n  background-color: [VOTRE_COULEUR];\n}'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 3: Couleurs & Arrière-plans
  // --------------------------------------------------------------
  'lesson-css-03': {
    id: 'lesson-css-03',
    title: 'Couleurs & Arrière-plans',
    description: 'Apprenez à utiliser les couleurs, les images de fond et les bordures.',
    estimatedMinutes: 16,
    difficulty: 'beginner',
    dependencies: ['lesson-css-01'],
    content: [
      {
        type: 'theory',
        title: 'Les propriétés de couleur',
        text: 'CSS offre plusieurs façons de définir les couleurs :\n\n• Noms de couleurs : red, blue, green...\n• Hexadécimal : #ff0000, #00ff00...\n• RGB : rgb(255, 0, 0)\n• HSL : hsl(0, 100%, 50%)\n\nLes propriétés principales sont :\n• color : couleur du texte\n• background-color : couleur de fond\n• background-image : image de fond'
      },
      {
        type: 'color-demo',
        title: 'Testez les couleurs',
        description: 'Changez la couleur du texte et voyez le résultat.',
        property: 'color',
        initialValue: '#ff6b35'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemples de couleurs',
        code: `/* Différentes façons d'écrire la même couleur */\n.element {\n  color: red;\n  color: #ff0000;\n  color: rgb(255, 0, 0);\n  color: hsl(0, 100%, 50%);\n  \n  background-color: #f0f0f0;\n  background-image: url('image.jpg');\n  background-repeat: no-repeat;\n  background-size: cover;\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Expérimentez avec les couleurs',
        description: 'Modifiez les couleurs et voyez le résultat.',
        initialHTML: `<div class="box">\n  <h1>Texte coloré</h1>\n  <p>Ceci est un paragraphe avec un fond coloré.</p>\n</div>`,
        initialCSS: `.box {\n  background-color: #f0f4ff;\n  padding: 20px;\n  border-radius: 12px;\n}\nh1 {\n  color: #1a365d;\n}\np {\n  color: #4a5568;\n  background-color: #e2e8f0;\n  padding: 10px;\n  border-radius: 8px;\n}`
      },
      {
        type: 'note',
        text: 'Utilisez des sites comme Coolors ou Adobe Color pour trouver des palettes de couleurs harmonieuses.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'Les couleurs s\'écrivent en hexadécimal, RGB, HSL ou nom.',
      'background-image permet d\'utiliser des images comme fond.',
      'background-repeat et background-size contrôlent l\'affichage.'
    ],
    exercises: [
      {
        id: 'ex-css-03-01',
        type: 'color-picker',
        question: 'Choisissez une couleur bleue pour le texte du titre.',
        correctAnswer: '#2563eb',
        hint: 'Choisissez un bleu vif.',
        explanation: 'h1 { color: #2563eb; }',
        codeSnippet: 'h1 {\n  color: [VOTRE_COULEUR];\n}'
      },
      {
        id: 'ex-css-03-02',
        type: 'multiple-choice',
        question: 'Quelle propriété permet de définir une image de fond ?',
        options: ['background-image', 'background-color', 'image-background', 'bg-image'],
        correctAnswer: 'background-image',
        hint: 'La propriété contient le mot "image".',
        explanation: 'background-image: url("image.jpg"); permet de définir une image de fond.'
      },
      {
        id: 'ex-css-03-03',
        type: 'true-false',
        question: 'background-size: cover; étire l\'image pour remplir tout l\'élément sans déformation.',
        correctAnswer: 'true',
        hint: 'Pensez à ce que fait "cover" sur une image.',
        explanation: 'cover redimensionne l\'image pour qu\'elle couvre tout l\'élément tout en gardant ses proportions.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 4: Bordures & Coins Arrondis
  // --------------------------------------------------------------
  'lesson-css-04': {
    id: 'lesson-css-04',
    title: 'Bordures & Coins Arrondis',
    description: 'Apprenez à styliser les bordures et à créer des effets modernes avec border-radius.',
    estimatedMinutes: 14,
    difficulty: 'beginner',
    dependencies: ['lesson-css-01'],
    content: [
      {
        type: 'theory',
        title: 'Les bordures en CSS',
        text: 'Les bordures sont un moyen puissant de styliser les éléments.\n\nPropriétés principales :\n• border-style : solid, dashed, dotted, double...\n• border-color : la couleur\n• border-width : l\'épaisseur\n• border-radius : les coins arrondis\n• border : raccourci pour style, couleur, épaisseur'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Les différents styles de bordure',
        code: `/* Styles de bordure */\n.border-solid { border-style: solid; }\n.border-dashed { border-style: dashed; }\n.border-dotted { border-style: dotted; }\n.border-double { border-style: double; }\n\n/* Bordures arrondies */\n.rounded {\n  border: 3px solid #ff6b35;\n  border-radius: 12px;\n  padding: 20px;\n}\n\n/* Bordure personnalisée */\n.custom {\n  border: 2px solid #2563eb;\n  border-radius: 50%;\n  width: 100px;\n  height: 100px;\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Créez votre bordure',
        description: 'Expérimentez avec les bordures et les coins arrondis.',
        initialHTML: `<div class="box">\n  <p>Un élément avec une bordure</p>\n</div>`,
        initialCSS: `.box {\n  border: 4px solid #ff6b35;\n  border-radius: 16px;\n  padding: 30px;\n  background: #fafafa;\n  text-align: center;\n}`
      },
      {
        type: 'example-box',
        title: 'Créer un cercle parfait',
        description: 'Utilisez border-radius: 50% pour créer un cercle.',
        code: `div {\n  width: 150px;\n  height: 150px;\n  background: #ff6b35;\n  border-radius: 50%;\n}`,
        result: 'Un cercle orange de 150px de diamètre'
      }
    ],
    keyTakeaways: [
      'border-style peut être solid, dashed, dotted, double...',
      'border-radius arrondit les coins.',
      'border-radius: 50% crée un cercle parfait.'
    ],
    exercises: [
      {
        id: 'ex-css-04-01',
        type: 'multiple-choice',
        question: 'Quelle propriété crée des coins arrondis ?',
        options: ['border-round', 'border-radius', 'border-corners', 'rounded-border'],
        correctAnswer: 'border-radius',
        hint: 'Le mot-clé est "radius" comme en géométrie.',
        explanation: 'border-radius: 10px; arrondit les coins de l\'élément.'
      },
      {
        id: 'ex-css-04-02',
        type: 'code-practice',
        question: 'Écrivez une règle qui crée un cercle parfait de 100px avec un fond bleu.',
        correctAnswer: 'div { width: 100px; height: 100px; background: blue; border-radius: 50%; }',
        hint: 'Utilisez width, height, background et border-radius.',
        explanation: 'width: 100px; height: 100px; background: blue; border-radius: 50%;',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 5: Box Model & Display
  // --------------------------------------------------------------
  'lesson-css-05': {
    id: 'lesson-css-05',
    title: 'Box Model & Display',
    description: 'Comprenez le modèle de boîte et les différents types d\'affichage.',
    estimatedMinutes: 18,
    difficulty: 'intermediate',
    dependencies: ['lesson-css-01'],
    content: [
      {
        type: 'theory',
        title: 'Le modèle de boîte (Box Model)',
        text: 'Chaque élément HTML est une boîte. Le Box Model définit comment cette boîte est construite :\n\n• Content : le contenu (texte, image...)\n• Padding : l\'espace entre le contenu et la bordure\n• Border : la bordure\n• Margin : l\'espace entre les boîtes\n\nPropriétés : margin, padding, border, width, height'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemple de Box Model',
        code: `.box {\n  width: 200px;\n  height: 100px;\n  padding: 20px;\n  border: 2px solid #333;\n  margin: 15px;\n  background: #f0f4ff;\n}`
      },
      {
        type: 'theory',
        title: 'La propriété display',
        text: 'display détermine comment l\'élément est affiché :\n\n• block : prend toute la largeur, nouvelle ligne\n• inline : ne prend que la place nécessaire, en ligne\n• inline-block : en ligne mais peut avoir width/height\n• none : l\'élément est caché'
      },
      {
        type: 'interactive-demo',
        title: 'Expérimentez avec le Box Model',
        description: 'Modifiez les propriétés pour voir l\'impact visuel.',
        initialHTML: `<div class="box">\n  <p>Box Model</p>\n</div>`,
        initialCSS: `.box {\n  width: 200px;\n  height: 100px;\n  padding: 20px;\n  border: 4px solid #ff6b35;\n  margin: 20px;\n  background: #f0f4ff;\n  display: block;\n}`
      },
      {
        type: 'note',
        text: 'Le padding et le margin peuvent être définis individuellement (padding-top, margin-left) ou en raccourci (padding: 10px 20px;).',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'Chaque élément est une boîte avec margin, border, padding et content.',
      'display: block prend toute la largeur.',
      'display: inline ne prend que l\'espace nécessaire.',
      'display: none cache l\'élément.'
    ],
    exercises: [
      {
        id: 'ex-css-05-01',
        type: 'multiple-choice',
        question: 'Quelle propriété ajoute de l\'espace à l\'intérieur de la boîte ?',
        options: ['margin', 'padding', 'border', 'spacing'],
        correctAnswer: 'padding',
        hint: 'Pensez à l\'espace entre le contenu et la bordure.',
        explanation: 'Le padding est l\'espace entre le contenu et la bordure, à l\'intérieur de la boîte.'
      },
      {
        id: 'ex-css-05-02',
        type: 'true-false',
        question: 'display: none cache l\'élément mais il occupe toujours de l\'espace.',
        correctAnswer: 'false',
        hint: 'Un élément caché n\'occupe pas de place.',
        explanation: 'display: none cache complètement l\'élément, il n\'occupe plus aucun espace.'
      },
      {
        id: 'ex-css-05-03',
        type: 'code-practice',
        question: 'Écrivez du CSS pour qu\'un élément devienne invisible mais garde sa place.',
        correctAnswer: 'div { visibility: hidden; }',
        hint: 'Utilisez visibility au lieu de display.',
        explanation: 'visibility: hidden; cache l\'élément mais garde sa place dans la page.',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 6: Position & Float
  // --------------------------------------------------------------
  'lesson-css-06': {
    id: 'lesson-css-06',
    title: 'Position & Float',
    description: 'Maîtrisez le positionnement des éléments avec position et float.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-css-05'],
    content: [
      {
        type: 'theory',
        title: 'La propriété position',
        text: 'position contrôle le positionnement de l\'élément :\n\n• static : position normale (par défaut)\n• relative : positionné par rapport à sa position normale\n• absolute : retiré du flux, positionné par rapport au parent le plus proche\n• fixed : positionné par rapport à la fenêtre\n• sticky : alterne entre relative et fixed'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemples de position',
        code: `.static {\n  position: static;\n}\n\n.relative {\n  position: relative;\n  top: 10px;\n  left: 20px;\n}\n\n.absolute {\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n\n.fixed {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n}\n\n.sticky {\n  position: sticky;\n  top: 0;\n}`
      },
      {
        type: 'theory',
        title: 'La propriété float',
        text: 'float permet de faire flotter un élément à gauche ou à droite :\n\n• left : flotte à gauche\n• right : flotte à droite\n• none : pas de flottement\n\nLe texte et les autres éléments s\'enroulent autour.'
      },
      {
        type: 'interactive-demo',
        title: 'Expérimentez avec le positionnement',
        description: 'Jouez avec les différentes valeurs de position.',
        initialHTML: `<div class="container">\n  <div class="box absolute">Absolue</div>\n  <div class="box relative">Relative</div>\n  <div class="box fixed">Fixée</div>\n</div>`,
        initialCSS: `.container {\n  position: relative;\n  height: 200px;\n  background: #f0f4ff;\n  border: 2px solid #ddd;\n  padding: 10px;\n}\n.box {\n  padding: 10px;\n  background: #ff6b35;\n  color: white;\n  border-radius: 8px;\n  margin: 5px;\n}\n.absolute {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n.relative {\n  position: relative;\n  top: 20px;\n}\n.fixed {\n  position: fixed;\n  bottom: 100px;\n  right: 50px;\n  background: #2563eb;\n}`
      },
      {
        type: 'note',
        text: 'top, right, bottom, left fonctionnent uniquement si position n\'est pas static.',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'position: relative déplace l\'élément par rapport à sa position normale.',
      'position: absolute retire l\'élément du flux.',
      'position: fixed le fixe par rapport à la fenêtre.',
      'float fait flotter l\'élément à gauche ou à droite.'
    ],
    exercises: [
      {
        id: 'ex-css-06-01',
        type: 'multiple-choice',
        question: 'Quelle valeur de position retire l\'élément du flux normal ?',
        options: ['relative', 'static', 'absolute', 'sticky'],
        correctAnswer: 'absolute',
        hint: 'L\'élément est "absolu" par rapport au document.',
        explanation: 'position: absolute retire l\'élément du flux normal et le positionne par rapport au parent le plus proche.'
      },
      {
        id: 'ex-css-06-02',
        type: 'code-practice',
        question: 'Écrivez une règle pour qu\'un élément reste en bas à droite de la fenêtre même en défilant.',
        correctAnswer: 'div { position: fixed; bottom: 20px; right: 20px; }',
        hint: 'Utilisez position: fixed.',
        explanation: 'position: fixed; bottom: 20px; right: 20px; fixe l\'élément en bas à droite.',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 7: Transformations
  // --------------------------------------------------------------
  'lesson-css-07': {
    id: 'lesson-css-07',
    title: 'Transformations (rotate, scale, translate, skew)',
    description: 'Apprenez à transformer vos éléments avec rotate, scale, translate et skew.',
    estimatedMinutes: 14,
    difficulty: 'intermediate',
    dependencies: ['lesson-css-01'],
    content: [
      {
        type: 'theory',
        title: 'Les transformations CSS',
        text: 'Les transformations permettent de modifier l\'apparence des éléments :\n\n• rotate(deg) : rotation\n• scale(x, y) : redimensionnement\n• translate(x, y) : déplacement\n• skew(xdeg, ydeg) : inclinaison\n\nElles s\'utilisent avec la propriété transform.'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemples de transformations',
        code: `.rotate {\n  transform: rotate(45deg);\n}\n\n.scale {\n  transform: scale(1.5);\n}\n\n.translate {\n  transform: translate(50px, 30px);\n}\n\n.skew {\n  transform: skew(20deg, 10deg);\n}\n\n.combined {\n  transform: rotate(45deg) scale(1.2) translate(20px, 10px);\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Expérimentez avec les transformations',
        description: 'Modifiez les valeurs pour voir l\'effet.',
        initialHTML: `<div class="box">\n  Transformations\n</div>`,
        initialCSS: `.box {\n  width: 150px;\n  height: 150px;\n  background: linear-gradient(135deg, #ff6b35, #ff9a56);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  border-radius: 12px;\n  margin: 50px auto;\n  transform: rotate(15deg);\n  transition: transform 0.5s ease;\n}\n\n.box:hover {\n  transform: rotate(45deg) scale(1.2);\n}`
      },
      {
        type: 'note',
        text: 'Les transformations peuvent être combinées en une seule déclaration transform: rotate(45deg) scale(1.2);',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'transform: rotate(deg) fait pivoter l\'élément.',
      'transform: scale(x,y) redimensionne l\'élément.',
      'transform: translate(x,y) déplace l\'élément.',
      'transform: skew(x,y) incline l\'élément.'
    ],
    exercises: [
      {
        id: 'ex-css-07-01',
        type: 'multiple-choice',
        question: 'Quelle fonction permet de faire pivoter un élément ?',
        options: ['scale', 'rotate', 'translate', 'skew'],
        correctAnswer: 'rotate',
        hint: 'Cette fonction concerne la rotation.',
        explanation: 'transform: rotate(45deg); fait pivoter l\'élément de 45 degrés.'
      },
      {
        id: 'ex-css-07-02',
        type: 'code-practice',
        question: 'Écrivez une règle qui agrandit un élément de 50% au survol.',
        correctAnswer: 'div:hover { transform: scale(1.5); }',
        hint: 'Utilisez :hover et scale.',
        explanation: 'div:hover { transform: scale(1.5); } agrandit l\'élément de 50% au survol.',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 8: Transitions & Animations
  // --------------------------------------------------------------
  'lesson-css-08': {
    id: 'lesson-css-08',
    title: 'Transitions & Animations',
    description: 'Donnez vie à vos pages avec des transitions fluides et des animations.',
    estimatedMinutes: 18,
    difficulty: 'advanced',
    dependencies: ['lesson-css-01'],
    content: [
      {
        type: 'theory',
        title: 'Les transitions CSS',
        text: 'Les transitions permettent des changements progressifs entre états :\n\n• transition-property : la propriété à animer\n• transition-duration : la durée de l\'animation\n• transition-delay : le délai avant le début\n• transition : raccourci pour les 3 propriétés'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemple de transition',
        code: `.box {\n  width: 100px;\n  height: 100px;\n  background: blue;\n  transition: background-color 0.5s ease, transform 0.3s ease;\n}\n\n.box:hover {\n  background: red;\n  transform: scale(1.2);\n}`
      },
      {
        type: 'theory',
        title: 'Les animations CSS',
        text: 'Les animations permettent des mouvements complexes et continus :\n\n• @keyframes : définit les étapes\n• animation-name : nom de l\'animation\n• animation-duration : durée\n• animation-iteration-count : nombre de répétitions\n• animation-direction : sens (normal, reverse, alternate)'
      },
      {
        type: 'code-block',
        language: 'css',
        title: 'Exemple d\'animation',
        code: `@keyframes bounce {\n  0% { transform: translateY(0); }\n  50% { transform: translateY(-30px); }\n  100% { transform: translateY(0); }\n}\n\n.box {\n  animation: bounce 1s ease-in-out infinite;\n}`
      },
      {
        type: 'interactive-demo',
        title: 'Créez votre animation',
        description: 'Expérimentez avec les transitions et animations.',
        initialHTML: `<div class="box">\n  Animation\n</div>\n<button onclick="toggleAnimation()">Basculer</button>`,
        initialCSS: `.box {\n  width: 150px;\n  height: 150px;\n  background: linear-gradient(135deg, #ff6b35, #ff9a56);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  border-radius: 12px;\n  margin: 20px auto;\n  transition: all 0.5s ease;\n}\n\n.box.animate {\n  animation: slideAndRotate 2s ease-in-out infinite;\n}\n\n@keyframes slideAndRotate {\n  0% { transform: translateX(0) rotate(0deg); }\n  50% { transform: translateX(100px) rotate(180deg); }\n  100% { transform: translateX(0) rotate(360deg); }\n}\n\nbutton {\n  display: block;\n  margin: 10px auto;\n  padding: 10px 20px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: background 0.3s;\n}\n\nbutton:hover {\n  background: #1d4ed8;\n}`
      },
      {
        type: 'note',
        text: 'Les animations peuvent être infinies avec animation-iteration-count: infinite;',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'Les transitions rendent les changements fluides.',
      'Les animations créent des mouvements répétitifs.',
      '@keyframes définit les étapes de l\'animation.',
      'animation-iteration-count: infinite; pour une animation continue.'
    ],
    exercises: [
      {
        id: 'ex-css-08-01',
        type: 'multiple-choice',
        question: 'Quelle propriété définit la durée d\'une animation ?',
        options: ['animation-duration', 'animation-time', 'duration', 'animation-length'],
        correctAnswer: 'animation-duration',
        hint: 'Cette propriété commence par "animation" et se termine par "duration".',
        explanation: 'animation-duration: 2s; définit la durée de l\'animation sur 2 secondes.'
      },
      {
        id: 'ex-css-08-02',
        type: 'code-practice',
        question: 'Écrivez une animation qui fait tourner un élément en boucle.',
        correctAnswer: '@keyframes spin { 100% { transform: rotate(360deg); } } div { animation: spin 2s linear infinite; }',
        hint: 'Utilisez @keyframes, rotate, et infinite.',
        explanation: '@keyframes spin { 100% { transform: rotate(360deg); } } div { animation: spin 2s linear infinite; }',
        codeSnippet: '/* Écrivez votre code ici */\n\n'
      },
      {
        id: 'ex-css-08-03',
        type: 'true-false',
        question: 'Les transitions et les animations ne peuvent pas être utilisées ensemble.',
        correctAnswer: 'false',
        hint: 'Pensez à la flexibilité de CSS.',
        explanation: 'On peut utiliser les deux ensemble, par exemple une transition pour un effet de hover et une animation continue.'
      }
    ]
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const fullCssCourse = {
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

