// ================================================================
// data.ts - Module HTML (Programme Complet en Français)
// ================================================================

// ================================================================
// 1. TYPES & INTERFACES (Noyau flexible)
// ================================================================

export type ContentBlock =
  | { type: 'theory'; title?: string; text: string; visualSuggestion?: string; }
  | { type: 'code-block'; language: 'html' | 'css' | 'js' | 'sql' | 'bash'; code: string; title?: string; }
  | { type: 'table-comparison'; headers: string[]; rows: (string | string[])[][]; caption?: string; }
  | { type: 'image-placeholder'; description: string; caption?: string; }
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

// ================================================================
// 2. STRUCTURE DU COURS (Feuille de route)
// ================================================================

export const courseStructure: CourseData = {
  id: 'html-full-course',
  title: 'HTML5 : Le Guide Complet',
  subtitle: 'Du squelette au web sémantique',
  description: 'Maîtrisez HTML5 de zéro. Apprenez tout, de la structure du document, au formatage du texte, en passant par le multimédia, les tableaux, les formulaires et la mise en page sémantique. Tous les concepts sont expliqués avec des exemples modernes et des exercices interactifs.',
  chapters: [
    {
      id: 'ch-html-01',
      title: 'Introduction & Structure du document',
      description: 'Comprenez ce qu\'est HTML, le squelette HTML5, les attributs globaux et les éléments d\'en-tête.',
      lessonIds: ['lesson-html-01', 'lesson-html-02']
    },
    {
      id: 'ch-html-02',
      title: 'Texte, Liens & Listes',
      description: 'Structurez votre contenu à l\'aide de titres, paragraphes, listes et liens de navigation.',
      lessonIds: ['lesson-html-03', 'lesson-html-04', 'lesson-html-05']
    },
    {
      id: 'ch-html-03',
      title: 'Multimédia & Conteneurs',
      description: 'Intégrez des images, vidéos, audios et organisez votre mise en page avec div, span et iframe.',
      lessonIds: ['lesson-html-06', 'lesson-html-07', 'lesson-html-08']
    },
    {
      id: 'ch-html-04',
      title: 'Données tabulaires & Formulaires',
      description: 'Affichez des données structurées dans des tableaux et collectez des saisies utilisateur avec des formulaires puissants.',
      lessonIds: ['lesson-html-09', 'lesson-html-10', 'lesson-html-11']
    },
    {
      id: 'ch-html-05',
      title: 'Layout sémantique & Événements',
      description: 'Construisez des pages accessibles et optimisées pour le référencement avec les balises sémantiques et gérez les interactions utilisateur.',
      lessonIds: ['lesson-html-12']
    }
  ]
};

// ================================================================
// 3. CONTENU DES LEÇONS (Données détaillées)
// ================================================================

export const lessonContent: Record<string, Lesson> = {

  // --------------------------------------------------------------
  // LEÇON 1 : Qu'est-ce que HTML & Le squelette
  // --------------------------------------------------------------
  'lesson-html-01': {
    id: 'lesson-html-01',
    title: 'Qu\'est-ce que HTML & Le squelette du document',
    description: 'Découvrez le rôle de HTML dans le développement web et mémorisez la structure essentielle (squelette) de toute page HTML5.',
    estimatedMinutes: 12,
    difficulty: 'beginner',
    dependencies: [],
    content: [
      {
        type: 'theory',
        text: 'HTML (HyperText Markup Language) est le langage standard utilisé pour créer et structurer le contenu sur le web. Considérez-le comme le squelette d\'un site web : il définit les titres, paragraphes, liens, images et bien plus encore. HTML5 est la dernière version, introduisant des balises sémantiques et un support multimédia natif.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Le squelette HTML5 minimal',
        code: `<!DOCTYPE html>\n<html lang="fr">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Ma première page</title>\n</head>\n<body>\n    <h1>Bienvenue en HTML5</h1>\n    <p>Ceci est un paragraphe à l'intérieur du body.</p>\n</body>\n</html>`
      },
      {
        type: 'table-comparison',
        headers: ['Balise', 'Description'],
        rows: [
          ['<!DOCTYPE html>', 'Déclare qu\'il s\'agit d\'un document HTML5.'],
          ['<html>', 'L\'élément racine contenant toute la page.'],
          ['<head>', 'Contient les métadonnées, le titre et les liens vers CSS/JS.'],
          ['<body>', 'Contient le contenu visible de la page.']
        ],
        caption: 'Balises essentielles du squelette'
      },
      {
        type: 'note',
        text: 'Toujours déclarer <!DOCTYPE html> en haut. Cela garantit que le navigateur affiche la page en mode standard (et non en "quirks mode").',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'HTML fournit la structure du contenu web.',
      'Toute page HTML5 commence par <!DOCTYPE html>.',
      '<head> contient les métadonnées cachées, tandis que <body> contient le contenu visible.'
    ],
    exercises: [
      {
        id: 'ex-html-01-01',
        type: 'multiple-choice',
        question: 'Où va le contenu visible d\'une page web ?',
        options: ['À l\'intérieur de la balise <head>', 'À l\'intérieur de la balise <body>', 'À l\'intérieur de la balise <title>', 'À l\'intérieur de la balise <meta>'],
        correctAnswer: 'À l\'intérieur de la balise <body>',
        hint: 'Pensez à ce que l\'utilisateur voit réellement dans la fenêtre du navigateur.',
        explanation: 'L\'élément <body> contient tout le contenu affiché aux utilisateurs, tel que le texte, les images et les liens.'
      },
      {
        id: 'ex-html-01-02',
        type: 'true-false',
        question: 'La balise <meta charset="UTF-8"> est facultative dans le HTML moderne.',
        correctAnswer: 'Faux',
        hint: 'Les navigateurs ont besoin de connaître l\'encodage des caractères pour afficher correctement les caractères spéciaux.',
        explanation: 'Bien que les navigateurs puissent deviner, il est fortement recommandé de toujours spécifier UTF-8 pour éviter les problèmes d\'encodage.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 2 : Éléments d'en-tête & Attributs globaux
  // --------------------------------------------------------------
  'lesson-html-02': {
    id: 'lesson-html-02',
    title: 'Éléments d\'en-tête & Attributs globaux',
    description: 'Apprenez à configurer votre page via <head> et découvrez les puissants attributs globaux disponibles pour toutes les balises HTML.',
    estimatedMinutes: 15,
    difficulty: 'beginner',
    dependencies: ['lesson-html-01'],
    content: [
      {
        type: 'theory',
        text: 'La section <head> est le centre de contrôle de votre page web. Elle contient des ressources comme les feuilles de style, les scripts et les métadonnées qui décrivent le document aux navigateurs et aux moteurs de recherche. Les attributs globaux comme id, class et style peuvent être appliqués à TOUS les éléments HTML.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Une section <head> complète',
        code: `<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta name="description" content="Apprenez HTML5 avec des exemples interactifs.">\n    <meta name="keywords" content="HTML, CSS, JavaScript, Développement Web">\n    <meta name="author" content="Académie Tech">\n    <title>Plateforme d'apprentissage</title>\n    <link rel="stylesheet" href="styles.css">\n    <style>\n        body { font-family: Arial; }\n    </style>\n    <script src="app.js" defer></script>\n</head>`
      },
      {
        type: 'table-comparison',
        headers: ['Balise / Attribut', 'Rôle', 'Exemple'],
        rows: [
          ['<title>', 'Définit le titre de l\'onglet du navigateur.', '<title>Mon portfolio</title>'],
          ['<meta description>', 'Utilisé par les moteurs de recherche pour le résumé.', '<meta name="description" content="...">'],
          ['<link>', 'Lie une feuille de style CSS externe (ou une icône).', '<link rel="stylesheet" href="style.css">'],
          ['<style>', 'Intègre du CSS directement.', '<style> h1 { color: red; } </style>'],
          ['<script>', 'Intègre ou lie un script JavaScript externe.', '<script src="main.js"></script>']
        ],
        caption: 'Éléments essentiels de l\'en-tête'
      },
      {
        type: 'table-comparison',
        headers: ['Attribut global', 'Description', 'Exemple d\'utilisation'],
        rows: [
          ['class', 'Regroupe des éléments pour le CSS ou JS.', '<div class="conteneur">'],
          ['id', 'Identifiant unique pour un seul élément.', '<h1 id="titre-principal">'],
          ['style', 'CSS en ligne (à utiliser avec parcimonie).', '<p style="color:blue;">'],
          ['title', 'Affiche une infobulle au survol.', '<abbr title="World Wide Web">WWW</abbr>'],
          ['hidden', 'Rend l\'élément invisible.', '<p hidden>Message secret</p>'],
          ['lang', 'Spécifie la langue du contenu.', '<html lang="fr">']
        ],
        caption: 'Attributs globaux couramment utilisés'
      }
    ],
    keyTakeaways: [
      '<title> est crucial pour le référencement et l\'expérience utilisateur.',
      'Les balises <meta> aident les moteurs de recherche et les réseaux sociaux à comprendre votre contenu.',
      'Utilisez <link> pour les styles externes et <script> pour JavaScript.',
      'id doit être unique ; class peut être réutilisée sur plusieurs éléments.'
    ],
    exercises: [
      {
        id: 'ex-html-02-01',
        type: 'multiple-choice',
        question: 'Quel attribut global permet de fournir un identifiant unique à un élément ?',
        options: ['class', 'style', 'id', 'title'],
        correctAnswer: 'id',
        hint: 'Vous l\'utilisez pour créer un lien vers un élément via un fragment d\'URL (ex: #contact).',
        explanation: 'L\'attribut "id" doit être unique dans la page. Il peut être utilisé pour le CSS, JavaScript et les liens d\'ancrage.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 3 : Structuration du texte (titres, paragraphes, etc.)
  // --------------------------------------------------------------
  'lesson-html-03': {
    id: 'lesson-html-03',
    title: 'Structuration du texte : Titres, paragraphes & éléments en ligne',
    description: 'Organisez votre contenu de manière hiérarchique à l\'aide de titres (h1-h6), de paragraphes et de balises en ligne spécialisées pour les citations, adresses et mises en évidence.',
    estimatedMinutes: 14,
    difficulty: 'beginner',
    dependencies: ['lesson-html-01'],
    content: [
      {
        type: 'theory',
        text: 'Une structure de texte appropriée améliore la lisibilité et le référencement. Les titres définissent le plan de votre contenu (comme les chapitres d\'un livre). Utilisez <p> pour les paragraphes, <br> pour les sauts de ligne et <hr> pour les séparateurs thématiques.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Titres & Structure du texte',
        code: `<h1>Titre principal : Introduction au Web</h1>\n<h2>Chapitre 1 : Les bases de HTML</h2>\n<h3>1.1 Qu'est-ce qu'une balise ?</h3>\n<p>Une balise est un élément constitutif de HTML. <br> Elle se présente généralement par paire : ouvrante et fermante.</p>\n<hr>\n<h2>Chapitre 2 : Les bases de CSS</h2>\n<p>CSS permet de styliser la structure HTML.</p>`
      },
      {
        type: 'theory',
        title: 'Balises en ligne spécialisées',
        text: 'Utilisez ces balises pour donner un sens spécifique à votre texte : <cite> pour les œuvres (livres, films), <address> pour les coordonnées, <mark> pour surligner et <output> pour les résultats de calculs (généralement avec JS).'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Conteneurs de texte en action',
        code: `<p>Mon livre préféré est <cite>L'Art de l'apprentissage</cite>.</p>\n<address>\n    Contactez-nous : <a href="mailto:info@academie.fr">info@academie.fr</a>\n</address>\n<p>N'oubliez pas l'<mark>examen de mi-session</mark> la semaine prochaine !</p>\n<form oninput="resultat.value=parseInt(a.value)+parseInt(b.value)">\n    <input type="range" id="a" value="5"> +\n    <input type="number" id="b" value="10"> =\n    <output name="resultat" for="a b">15</output>\n</form>`
      }
    ],
    keyTakeaways: [
      'Utilisez un seul <h1> par page pour le titre principal.',
      'Les titres doivent suivre une hiérarchie logique (h1 -> h2 -> h3).',
      'Utilisez <br> avec parcimonie et <hr> pour marquer une rupture thématique.'
    ],
    exercises: [
      {
        id: 'ex-html-03-01',
        type: 'fill-blank',
        question: 'Pour créer une rupture thématique (ligne horizontale) en HTML, utilisez la balise ______.',
        correctAnswer: '<hr>',
        hint: 'C\'est une balise auto-fermante qui signifie "règle horizontale".',
        explanation: '<hr> signifie "Horizontal Rule". Elle crée un séparateur visuel entre les sections de contenu.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 4 : Hyperliens (navigation)
  // --------------------------------------------------------------
  'lesson-html-04': {
    id: 'lesson-html-04',
    title: 'Hyperliens : Connecter le web',
    description: 'Maîtrisez la balise ancre <a> pour naviguer entre les pages, ouvrir de nouveaux onglets et sauter vers des sections spécifiques de la même page.',
    estimatedMinutes: 12,
    difficulty: 'beginner',
    dependencies: ['lesson-html-03'],
    content: [
      {
        type: 'theory',
        text: 'Les liens sont l\'âme du web. La balise <a> (ancre) crée des hyperliens. L\'attribut href définit la destination et target contrôle où le lien s\'ouvre.'
      },
      {
        type: 'table-comparison',
        headers: ['Valeur de target', 'Comportement'],
        rows: [
          ['_self', '(Par défaut) S\'ouvre dans le même onglet/fenêtre.'],
          ['_blank', 'S\'ouvre dans un nouvel onglet ou une nouvelle fenêtre.'],
          ['_parent', 'S\'ouvre dans le cadre parent (utilisé avec les iframes).'],
          ['_top', 'S\'ouvre dans le corps complet de la fenêtre.']
        ],
        caption: 'Valeurs de l\'attribut target'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Liens externes & internes',
        code: `<!-- Lien externe (s'ouvre dans un nouvel onglet) -->\n<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">\n    Visitez MDN Web Docs\n</a>\n\n<!-- Lien d'ancrage interne -->\n<a href="#section-faq">Aller à la section FAQ</a>\n\n<!-- Contenu long... -->\n<h2 id="section-faq">Foire aux questions</h2>\n<p>Voici les réponses à vos questions...</p>`
      },
      {
        type: 'note',
        text: 'Lorsque vous utilisez # dans href, le navigateur recherche un élément avec cet id. Pour la sécurité, ajoutez toujours rel="noopener noreferrer" avec target="_blank" pour empêcher la nouvelle page d\'accéder à la page d\'origine (tab-nabbing).',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'Utilisez <a href="..."> pour créer un lien.',
      'Utilisez target="_blank" pour ouvrir dans un nouvel onglet.',
      'Utilisez #id pour créer un lien vers une section de la même page.'
    ],
    exercises: [
      {
        id: 'ex-html-04-01',
        type: 'multiple-choice',
        question: 'Quel attribut est utilisé pour spécifier l\'URL d\'un hyperlien ?',
        options: ['src', 'link', 'ref', 'href'],
        correctAnswer: 'href',
        hint: 'Il signifie "Hypertext REFerence".',
        explanation: 'L\'attribut href contient l\'URL de destination pour la balise ancre.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 5 : Listes
  // --------------------------------------------------------------
  'lesson-html-05': {
    id: 'lesson-html-05',
    title: 'Listes : Organiser les données efficacement',
    description: 'Apprenez à présenter des éléments de manière structurée à l\'aide de listes non ordonnées (puce), ordonnées (numérotées) et imbriquées.',
    estimatedMinutes: 14,
    difficulty: 'beginner',
    dependencies: ['lesson-html-03'],
    content: [
      {
        type: 'theory',
        text: 'Les listes sont essentielles pour regrouper des éléments connexes. Utilisez <ul> pour les listes à puces (non ordonnées) et <ol> pour les listes numérotées (ordonnées). Chaque élément est encapsulé dans <li>.'
      },
      {
        type: 'table-comparison',
        headers: ['Type de liste', 'Balise HTML', 'Style par défaut'],
        rows: [
          ['Non ordonnée', '<ul>', 'Puce (disque, cercle, carré)'],
          ['Ordonnée', '<ol>', 'Numéros (1, A, I)'],
          ['Description (utile) <dl>', 'Termes et définitions (non inclus dans le PDF mais utile)']
        ],
        caption: 'Types de listes'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Attributs de liste & Imbrication',
        code: `<!-- Liste ordonnée avec chiffres romains, démarrant à 5, inversée -->\n<ol type="I" start="5" reversed>\n    <li>Introduction</li>\n    <li>Concepts clés\n        <ul type="circle">\n            <li>Sous-thème A</li>\n            <li>Sous-thème B</li>\n        </ul>\n    </li>\n    <li>Conclusion</li>\n</ol>\n\n<!-- Liste non ordonnée avec des puces carrées -->\n<ul type="square">\n    <li>Élément 1</li>\n    <li>Élément 2</li>\n</ul>`
      }
    ],
    keyTakeaways: [
      'Utilisez <ol> pour les étapes ou classements.',
      'Utilisez <ul> pour les fonctionnalités ou regroupements.',
      'Les listes imbriquées sont idéales pour les hiérarchies complexes.'
    ],
    exercises: [
      {
        id: 'ex-html-05-01',
        type: 'fill-blank',
        question: 'L\'attribut utilisé pour changer le style de numérotation d\'une liste ordonnée (par exemple, en lettres) est ______.',
        correctAnswer: 'type',
        hint: 'C\'est le même nom d\'attribut utilisé pour les listes non ordonnées afin de changer les puces.',
        explanation: 'type="A" donne des lettres majuscules, type="I" donne des chiffres romains, etc.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 6 : Images & Figures
  // --------------------------------------------------------------
  'lesson-html-06': {
    id: 'lesson-html-06',
    title: 'Images & Figures',
    description: 'Ajoutez un impact visuel à vos pages avec des images, et regroupez-les avec des légendes à l\'aide de figure et figcaption.',
    estimatedMinutes: 10,
    difficulty: 'beginner',
    dependencies: ['lesson-html-01'],
    content: [
      {
        type: 'theory',
        text: 'La balise <img> est auto-fermante. Elle nécessite les attributs src (chemin de la source) et alt (texte alternatif). L\'élément <figure> regroupe l\'image avec une <figcaption> pour former une unité visuelle complète.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Image avec légende (figure)',
        code: `<figure>\n    <img src="images/photo-equipe.jpg" alt="L'équipe de développement principale" width="400" height="300">\n    <figcaption>Notre formidable équipe de développement lors de la retraite annuelle.</figcaption>\n</figure>`
      },
      {
        type: 'note',
        text: 'Toujours inclure un texte alt. Il aide les malvoyants (lecteurs d\'écran) et s\'affiche si l\'image ne se charge pas.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'Utilisez src pour pointer vers le fichier image.',
      'Utilisez alt pour l\'accessibilité et le fallback.',
      'Utilisez figure et figcaption pour regrouper sémantiquement les médias.'
    ],
    exercises: []
  },

  // --------------------------------------------------------------
  // LEÇON 7 : Vidéo & Audio
  // --------------------------------------------------------------
  'lesson-html-07': {
    id: 'lesson-html-07',
    title: 'Intégration de vidéo & audio',
    description: 'Intégrez de la vidéo et de l\'audio natifs directement dans votre page sans plugins tiers. Fournissez des solutions de repli pour les formats non pris en charge à l\'aide de la balise <source>.',
    estimatedMinutes: 12,
    difficulty: 'intermediate',
    dependencies: ['lesson-html-06'],
    content: [
      {
        type: 'theory',
        text: 'Les éléments <video> et <audio> permettent une lecture native. L\'attribut controls ajoute des boutons de lecture. Utilisez la balise <source> à l\'intérieur pour fournir plusieurs formats (ex : MP4, WebM, Ogg) pour une compatibilité maximale entre navigateurs.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Exemples de vidéo et audio',
        code: `<!-- Vidéo avec contrôles -->\n<video width="640" height="360" controls poster="affiche.jpg">\n    <source src="media/intro.mp4" type="video/mp4">\n    <source src="media/intro.webm" type="video/webm">\n    Votre navigateur ne prend pas en charge la balise vidéo.\n</video>\n\n<!-- Audio avec contrôles -->\n<audio controls>\n    <source src="media/theme.mp3" type="audio/mpeg">\n    <source src="media/theme.ogg" type="audio/ogg">\n    Votre navigateur ne prend pas en charge l'élément audio.\n</audio>`
      },
      {
        type: 'note',
        text: 'MP4 (H.264) et WebM sont largement pris en charge. Le texte entre les balises <video> s\'affiche si le navigateur ne prend pas en charge l\'élément.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'controls est essentiel pour l\'interaction utilisateur (lecture/pause).',
      'Fournissez plusieurs formats <source> pour une compatibilité maximale.'
    ],
    exercises: [
      {
        id: 'ex-html-07-01',
        type: 'multiple-choice',
        question: 'Quel attribut doit être ajouté à une balise <video> pour afficher les boutons de lecture ?',
        options: ['src', 'autoplay', 'controls', 'loop'],
        correctAnswer: 'controls',
        hint: 'Il affiche les boutons de lecture, pause et le curseur de volume.',
        explanation: 'L\'attribut controls ajoute l\'interface de contrôle native du navigateur au lecteur vidéo.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 8 : Conteneurs (Div, Span, Iframe, Details)
  // --------------------------------------------------------------
  'lesson-html-08': {
    id: 'lesson-html-08',
    title: 'Conteneurs : Div, Span, Iframe & Details',
    description: 'Maîtrisez les conteneurs génériques pour la mise en page (div, span), le contenu intégré (iframe) et les sections repliables (details).',
    estimatedMinutes: 14,
    difficulty: 'intermediate',
    dependencies: ['lesson-html-03'],
    content: [
      {
        type: 'table-comparison',
        headers: ['Balise', 'Type', 'Cas d\'utilisation'],
        rows: [
          ['<div>', 'Bloc', 'Encapsule de grandes sections (en-têtes, pieds de page, articles) pour la mise en page CSS.'],
          ['<span>', 'En ligne', 'Encapsule un morceau de texte à l\'intérieur d\'une phrase pour un style spécifique.'],
          ['<iframe>', 'Cadre en ligne', 'Intègre une autre page HTML dans la page actuelle.'],
          ['<details> / <summary>', 'Bloc', 'Crée un widget à bascule (contenu repliable).']
        ],
        caption: 'Conteneurs génériques et utilitaires'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Conteneurs en action',
        code: `<!-- Div & Span -->\n<div class="annonce">\n    <h2>Actualités</h2>\n    <p>Bienvenue sur notre nouveau tableau de bord <span style="color: green;">interactif</span>.</p>\n</div>\n\n<!-- Iframe -->\n<iframe src="https://example.com/carte" name="cadre-carte" width="600" height="400"></iframe>\n<a href="details.html" target="cadre-carte">Charger les détails</a>\n\n<!-- Details / Summary -->\n<details>\n    <summary>Cliquez pour voir la réponse</summary>\n    <p>La réponse est 42.</p>\n</details>`
      },
      {
        type: 'note',
        text: 'Vous pouvez cibler un iframe par son attribut name à l\'aide de l\'attribut target d\'un lien (comme montré ci-dessus). Cela met à jour l\'iframe sans recharger toute la page.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'Utilisez <div> pour la structure en bloc.',
      'Utilisez <span> pour le style de texte en ligne.',
      'Utilisez <iframe> pour intégrer du contenu externe.',
      'Utilisez <details> pour masquer/afficher des informations supplémentaires.'
    ],
    exercises: []
  },

  // --------------------------------------------------------------
  // LEÇON 9 : Tableaux
  // --------------------------------------------------------------
  'lesson-html-09': {
    id: 'lesson-html-09',
    title: 'Données tabulaires avec les tableaux',
    description: 'Construisez des tableaux accessibles et bien structurés à l\'aide de thead, tbody, tfoot et gérez les cellules fusionnées avec colspan et rowspan.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-html-03'],
    content: [
      {
        type: 'theory',
        text: 'Les tableaux sont destinés aux données tabulaires (de type tableur). Utilisez <thead> pour les en-têtes, <tbody> pour les données principales et <tfoot> pour les résumés. <tr> définit une ligne, <th> définit une cellule d\'en-tête et <td> définit une cellule de données.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Tableau avancé avec fusions',
        code: `<table border="1">\n    <caption>Résumé des notes des étudiants</caption>\n    <thead>\n        <tr>\n            <th rowspan="2">Nom</th>\n            <th colspan="2">Matières</th>\n            <th rowspan="2">Total</th>\n        </tr>\n        <tr>\n            <th>Maths</th>\n            <th>Sciences</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr><td>Alex</td><td>85</td><td>90</td><td>175</td></tr>\n        <tr><td>Taylor</td><td>78</td><td>82</td><td>160</td></tr>\n    </tbody>\n    <tfoot>\n        <tr><td colspan="3">Moyenne</td><td>167.5</td></tr>\n    </tfoot>\n</table>`
      }
    ],
    keyTakeaways: [
      'Utilisez <thead> pour les en-têtes de colonnes, <tbody> pour les données, <tfoot> pour les résumés.',
      'colspan fusionne les colonnes horizontalement.',
      'rowspan fusionne les cellules verticalement.'
    ],
    exercises: [
      {
        id: 'ex-html-09-01',
        type: 'fill-blank',
        question: 'Pour faire fusionner une cellule d\'en-tête sur 3 colonnes, utilisez l\'attribut ______.',
        correctAnswer: 'colspan',
        hint: 'Il signifie "column span".',
        explanation: 'colspan="3" permet à la cellule d\'occuper l\'espace de 3 colonnes.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 10 : Formulaires - Champs de base
  // --------------------------------------------------------------
  'lesson-html-10': {
    id: 'lesson-html-10',
    title: 'Formulaires : Champs & Libellés',
    description: 'Commencez à construire des formulaires avec les types de champs de base (texte, email, mot de passe, nombre, date) et associez correctement les libellés pour l\'accessibilité.',
    estimatedMinutes: 18,
    difficulty: 'intermediate',
    dependencies: ['lesson-html-01'],
    content: [
      {
        type: 'theory',
        text: 'L\'élément <form> encapsule tous les champs. L\'attribut action définit où envoyer les données et method (GET ou POST) définit comment. La balise <label> améliore l\'accessibilité ; son attribut "for" doit correspondre à l\'"id" du champ.'
      },
      {
        type: 'table-comparison',
        headers: ['Type d\'input', 'Description', 'Attributs courants'],
        rows: [
          ['text', 'Texte sur une ligne', 'placeholder, required, readonly, value'],
          ['email', 'Validation d\'adresse email', 'placeholder, required, readonly'],
          ['password', 'Saisie masquée', 'placeholder, required, readonly'],
          ['number', 'Saisie numérique', 'min, max, required'],
          ['date', 'Sélecteur de date', 'min, max, required'],
          ['checkbox', 'Sélection multiple', 'checked, disabled'],
          ['radio', 'Sélection unique dans un groupe', 'name (partagé), checked, disabled']
        ],
        caption: 'Types de champs courants'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Formulaire de base avec libellés',
        code: `<form action="/inscription" method="POST">\n    <label for="username">Nom d'utilisateur :</label>\n    <input type="text" id="username" name="username" placeholder="johndoe" required>\n    <br>\n    \n    <label for="email">Email :</label>\n    <input type="email" id="email" name="email" placeholder="john@exemple.fr" required>\n    <br>\n\n    <label for="age">Âge (18-99) :</label>\n    <input type="number" id="age" name="age" min="18" max="99" required>\n    <br>\n\n    <label for="dob">Date de naissance :</label>\n    <input type="date" id="dob" name="dob" max="2010-01-01">\n    <br>\n\n    <label for="newsletter">S'abonner :</label>\n    <input type="checkbox" id="newsletter" name="newsletter" checked>\n    <br>\n\n    <label>Genre :</label>\n    <input type="radio" id="homme" name="genre" value="homme"> <label for="homme">Homme</label>\n    <input type="radio" id="femme" name="genre" value="femme"> <label for="femme">Femme</label>\n    <br>\n\n    <input type="submit" value="S'inscrire">\n</form>`
      }
    ],
    keyTakeaways: [
      'Utilisez toujours <label> avec "for" pointant vers l\'"id" du champ.',
      'Utilisez POST pour les données sensibles (mots de passe).',
      'Les boutons radio doivent partager le même "name" pour fonctionner en groupe.'
    ],
    exercises: [
      {
        id: 'ex-html-10-01',
        type: 'multiple-choice',
        question: 'Quel est l\'objectif de l\'attribut "for" dans une balise <label> ?',
        options: ['Styliser le libellé', 'Lier le libellé à un champ par son ID', 'Définir la valeur du champ', 'Désactiver le champ'],
        correctAnswer: 'Lier le libellé à un champ par son ID',
        hint: 'Cela rend le libellé cliquable pour le champ associé.',
        explanation: 'L\'attribut "for" correspond à l\'"id" du champ, associant ainsi le libellé à ce champ spécifique.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 11 : Formulaires - Contrôles avancés
  // --------------------------------------------------------------
  'lesson-html-11': {
    id: 'lesson-html-11',
    title: 'Formulaires : Contrôles avancés (Textarea, Select, Datalist)',
    description: 'Gérez les zones de texte multi-lignes, les listes déroulantes, les suggestions de saisie automatique et regroupez les champs connexes avec fieldset.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-html-10'],
    content: [
      {
        type: 'theory',
        text: 'Au-delà des champs de base, HTML propose <textarea> pour le texte multi-lignes, <select> pour les listes déroulantes, <datalist> pour les suggestions automatiques et <fieldset> avec <legend> pour regrouper des sections de votre formulaire.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Contrôles avancés de formulaire',
        code: `<form>\n    <fieldset>\n        <legend>Informations de contact</legend>\n        \n        <label for="msg">Message :</label><br>\n        <textarea id="msg" name="message" rows="4" cols="50" maxlength="200" placeholder="Écrivez votre message..."></textarea>\n        <br><br>\n\n        <label for="country">Pays :</label>\n        <select id="country" name="country">\n            <option value="fr" selected>France</option>\n            <option value="uk">Royaume-Uni</option>\n            <option value="us">États-Unis</option>\n        </select>\n        <br><br>\n\n        <label for="city">Ville (auto-complétion) :</label>\n        <input list="cities" id="city" name="city">\n        <datalist id="cities">\n            <option value="Paris">\n            <option value="Londres">\n            <option value="New York">\n        </datalist>\n        <br><br>\n\n        <input type="submit" value="Envoyer">\n        <input type="reset" value="Effacer">\n        <button type="button" onclick="alert('Bonjour !')">Cliquez-moi</button>\n    </fieldset>\n</form>`
      }
    ],
    keyTakeaways: [
      'Utilisez cols et rows pour dimensionner un textarea.',
      'Utilisez <select> pour des options strictes.',
      'Utilisez <datalist> pour des suggestions flexibles lors de la saisie.',
      'Utilisez <fieldset> et <legend> pour organiser les grands formulaires.'
    ],
    exercises: [
      {
        id: 'ex-html-11-01',
        type: 'true-false',
        question: 'L\'élément <datalist> force l\'utilisateur à choisir l\'une des options proposées.',
        correctAnswer: 'Faux',
        hint: 'Il propose des suggestions, mais l\'utilisateur peut toujours saisir sa propre valeur.',
        explanation: 'datalist fournit des suggestions de saisie automatique mais ne restreint pas l\'utilisateur à ces seuls choix (contrairement à select).'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 12 : Éléments sémantiques & Événements
  // --------------------------------------------------------------
  'lesson-html-12': {
    id: 'lesson-html-12',
    title: 'Mise en page sémantique & Introduction aux événements',
    description: 'Construisez des pages modernes et optimisées pour le référencement à l\'aide d\'éléments sémantiques (header, nav, main, section, article, aside, footer) et comprenez comment gérer des événements de base comme onclick et onchange.',
    estimatedMinutes: 18,
    difficulty: 'intermediate',
    dependencies: ['lesson-html-08', 'lesson-html-10'],
    content: [
      {
        type: 'theory',
        text: 'Les balises HTML sémantiques décrivent clairement leur signification, tant pour le navigateur que pour le développeur. Elles améliorent l\'accessibilité, le référencement et la maintenabilité du code. Les événements (comme onclick, oninput, onchange) permettent d\'écouter les interactions utilisateur et d\'exécuter du code JavaScript.'
      },
      {
        type: 'table-comparison',
        headers: ['Balise sémantique', 'Rôle', 'Cas d\'utilisation'],
        rows: [
          ['<header>', 'Contenu d\'introduction', 'Logo du site, navigation principale, titre.'],
          ['<nav>', 'Liens de navigation', 'Menu principal, menu latéral.'],
          ['<main>', 'Contenu principal de la page', 'Un seul par page, exclut les barres latérales.'],
          ['<section>', 'Regroupement thématique', 'Chapitre, introduction, services.'],
          ['<article>', 'Contenu autonome', 'Article de blog, actualité, fiche produit.'],
          ['<aside>', 'Contenu indirectement lié', 'Barre latérale, publicités, citations.'],
          ['<footer>', 'Contenu de clôture', 'Copyright, coordonnées, liens de plan du site.']
        ],
        caption: 'Balises sémantiques de structure de page'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Structure sémantique & Gestion d\'événements',
        code: `<!DOCTYPE html>\n<html lang="fr">\n<head>\n    <meta charset="UTF-8">\n    <title>Page sémantique</title>\n</head>\n<body>\n    <header>\n        <h1>Académie Tech</h1>\n        <nav>\n            <a href="#">Accueil</a> | <a href="#">Cours</a>\n        </nav>\n    </header>\n\n    <main>\n        <section>\n            <h2>Nos cours</h2>\n            <article>\n                <h3>Les bases de HTML</h3>\n                <p>Apprenez les fondamentaux de HTML.</p>\n            </article>\n        </section>\n        <aside>\n            <h4>Offre spéciale</h4>\n            <p>Bénéficiez de 20% de réduction aujourd'hui !</p>\n        </aside>\n    </main>\n\n    <footer>\n        <p>&copy; 2023 Académie Tech</p>\n    </footer>\n\n    <!-- Exemple d'événements -->\n    <div style="margin: 20px; padding: 10px; border: 1px solid #ccc;">\n        <h3>Démo d'événements</h3>\n        <input type="text" id="myInput" oninput="document.getElementById('affichage').innerHTML = this.value;" placeholder="Tapez quelque chose...">\n        <p>Vous avez saisi : <span id="affichage"></span></p>\n        <button onclick="alert('Le bouton a été cliqué !')">Cliquez-moi</button>\n        <br>\n        <select onchange="alert('Sélectionné : ' + this.value)">\n            <option value="A">Option A</option>\n            <option value="B">Option B</option>\n        </select>\n    </div>\n\n    <script>\n        // Le code JavaScript peut également être séparé.\n        console.log('Page chargée !');\n    </script>\n</body>\n</html>`
      },
      {
        type: 'table-comparison',
        headers: ['Événement', 'Se déclenche quand...', 'Exemple d\'attribut'],
        rows: [
          ['onclick', 'L\'utilisateur clique sur un élément.', '<button onclick="fn()">'],
          ['onchange', 'L\'utilisateur modifie la valeur d\'un champ et le quitte.', '<select onchange="fn()">'],
          ['onfocus', 'L\'utilisateur clique dans (se concentre sur) un champ.', '<input onfocus="fn()">'],
          ['onblur', 'L\'utilisateur clique en dehors (quitte) un champ.', '<input onblur="fn()">'],
          ['oninput', 'L\'utilisateur tape ou modifie la valeur en temps réel.', '<input oninput="fn()">'],
          ['onload', 'La page a fini de se charger.', '<body onload="fn()">']
        ],
        caption: 'Événements HTML courants'
      },
      {
        type: 'note',
        text: 'Bien que l\'utilisation de gestionnaires d\'événements en ligne (comme onclick) soit idéale pour l\'apprentissage, en production, il est préférable d\'utiliser la méthode addEventListener de JavaScript pour séparer le HTML du JS.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'Les éléments sémantiques améliorent l\'accessibilité et le référencement.',
      '<main> doit être unique par page.',
      'Les événements permettent à JavaScript de réagir aux actions des utilisateurs.'
    ],
    exercises: [
      {
        id: 'ex-html-12-01',
        type: 'multiple-choice',
        question: 'Quelle balise sémantique devez-vous utiliser pour encapsuler un article de blog qui pourrait être distribué de manière indépendante ?',
        options: ['<section>', '<article>', '<aside>', '<div>'],
        correctAnswer: '<article>',
        hint: 'Pensez à un contenu qui pourrait être un flux RSS.',
        explanation: '<article> est conçu pour un contenu autonome et distribuable, comme un article de blog, un message de forum ou une actualité.'
      },
      {
        id: 'ex-html-12-02',
        type: 'fill-blank',
        question: 'L\'attribut événementiel qui se déclenche lorsque la valeur d\'un champ de formulaire change et que l\'utilisateur le quitte est ______.',
        correctAnswer: 'onchange',
        hint: 'À ne pas confondre avec "oninput" qui se déclenche instantanément.',
        explanation: 'onchange se déclenche lorsque l\'utilisateur valide le changement (ex: sélection dans une liste déroulante ou sortie d\'un champ texte).'
      }
    ]
  }
};

// ================================================================
// 4. EXPORT - Pour une importation facile
// ================================================================

export const fullHtmlCourse = {
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

