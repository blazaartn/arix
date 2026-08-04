// data.ts - PHP Course Data (Full Curriculum)

export type ContentBlock =
  | { type: 'theory'; title?: string; text: string; visualSuggestion?: string; }
  | { type: 'code-block'; language: 'php' | 'html' | 'sql'; code: string; title?: string; }
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
  id: 'php-full-course',
  title: 'PHP : Le Guide Complet',
  subtitle: 'De la programmation serveur aux bases de données',
  description: 'Maîtrisez PHP de zéro. Apprenez la programmation côté serveur, la gestion des formulaires, l\'interaction avec les bases de données et la création de sites dynamiques.',
  chapters: [
    {
      id: 'ch-php-01',
      title: 'Introduction & Bases du langage',
      description: 'Découvrez PHP et apprenez les bases du langage.',
      lessonIds: ['lesson-php-01', 'lesson-php-02']
    },
    {
      id: 'ch-php-02',
      title: 'Structures de contrôle & Fonctions',
      description: 'Maîtrisez les conditions, les boucles et les fonctions.',
      lessonIds: ['lesson-php-03', 'lesson-php-04']
    },
    {
      id: 'ch-php-03',
      title: 'Formulaires & Transmission de données',
      description: 'Apprenez à gérer les formulaires et les données utilisateur.',
      lessonIds: ['lesson-php-05']
    },
    {
      id: 'ch-php-04',
      title: 'MySQL & PHP',
      description: 'Connectez PHP à MySQL et interagissez avec les bases de données.',
      lessonIds: ['lesson-php-06']
    }
  ]
};

// ============================================================
// LESSON CONTENT
// ============================================================

export const lessonContent: Record<string, Lesson> = {

  // --------------------------------------------------------------
  // LEÇON 1: Introduction à PHP & Intégration
  // --------------------------------------------------------------
  'lesson-php-01': {
    id: 'lesson-php-01',
    title: 'Introduction à PHP & Intégration',
    description: 'Découvrez PHP, son fonctionnement et comment l\'intégrer dans des pages web.',
    estimatedMinutes: 15,
    difficulty: 'beginner',
    dependencies: [],
    content: [
      {
        type: 'theory',
        text: 'PHP (Hypertext Preprocessor) est un langage de programmation côté serveur, spécialement conçu pour le développement web.\n\nLes principales utilisations de PHP :\n\n• Création de sites dynamiques : génération de contenu en fonction des préférences des utilisateurs\n• Gestion des formulaires : collecte, validation et traitement des données saisies\n• Interaction avec des bases de données : gestion des données stockées (utilisateurs, produits, articles)'
      },
      {
        type: 'theory',
        title: 'Fonctionnement d\'un site web dynamique en PHP',
        text: '1. Requête de l\'utilisateur : l\'utilisateur envoie une requête HTTP (URL ou formulaire)\n\n2. Traitement par le serveur web : Apache identifie le fichier PHP correspondant et le transmet à l\'interpréteur PHP\n\n3. Exécution du script PHP : le script peut récupérer des données de MySQL, traiter les données utilisateur, effectuer des calculs, et générer du HTML dynamique\n\n4. Réponse envoyée au navigateur : le serveur renvoie le résultat HTML'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Structure d\'un script PHP',
        code: `<?php
// Code PHP ici
echo 'Bonjour !';
?>`
      },
      {
        type: 'note',
        text: 'Les instructions PHP terminent par un point-virgule (;). Les commentaires se font avec // ou /* */.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'PHP est un langage côté serveur.',
      'Les balises PHP sont <?php et ?>.',
      'echo affiche du texte.',
      'PHP génère du HTML dynamique.'
    ],
    exercises: [
      {
        id: 'ex-php-01-01',
        type: 'multiple-choice',
        question: 'Quelle est la balise d\'ouverture d\'un script PHP ?',
        options: ['<?', '<?php', '<php', '<%'],
        correctAnswer: '<?php',
        hint: 'La balise standard d\'ouverture en PHP.',
        explanation: '<?php est la balise d\'ouverture standard pour le code PHP.'
      },
      {
        id: 'ex-php-01-02',
        type: 'true-false',
        question: 'PHP est exécuté côté client (dans le navigateur).',
        correctAnswer: 'false',
        hint: 'PHP s\'exécute sur le serveur.',
        explanation: 'PHP est un langage côté serveur, exécuté sur le serveur avant d\'envoyer le HTML au navigateur.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 2: Variables, Types, Opérateurs
  // --------------------------------------------------------------
  'lesson-php-02': {
    id: 'lesson-php-02',
    title: 'Variables, Types & Opérateurs',
    description: 'Apprenez à déclarer des variables et à utiliser les types de données en PHP.',
    estimatedMinutes: 20,
    difficulty: 'beginner',
    dependencies: ['lesson-php-01'],
    content: [
      {
        type: 'theory',
        title: 'Les variables',
        text: 'En PHP, les variables commencent par le symbole $ et servent à stocker des données.\n\nExemple :\n$nom = "Mohamed";\n$age = 25;'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Déclaration de variables',
        code: `<?php
$nom = "Mohamed";  // Chaîne de caractères
$age = 25;          // Entier
$prix = 19.99;      // Nombre à virgule flottante
$estVrai = true;    // Booléen
$rien = null;       // Null
?>`
      },
      {
        type: 'theory',
        title: 'Les nombres',
        text: 'PHP distingue deux types de nombres :\n\n• int : nombres entiers\n• float : nombres à virgule flottante'
      },
      {
        type: 'table-comparison',
        headers: ['Opération', 'Opérateur', 'Exemple', 'Résultat'],
        rows: [
          ['Addition', '+', '5 + 3', '8'],
          ['Soustraction', '-', '5 - 3', '2'],
          ['Multiplication', '*', '5 * 3', '15'],
          ['Division', '/', '6 / 2', '3'],
          ['Modulo', '%', '7 % 3', '1']
        ],
        caption: 'Opérations arithmétiques'
      },
      {
        type: 'table-comparison',
        headers: ['Fonction', 'Description', 'Exemple', 'Résultat'],
        rows: [
          ['abs()', 'Valeur absolue', 'abs(-15)', '15'],
          ['sqrt()', 'Racine carrée', 'sqrt(16)', '4'],
          ['rand()', 'Nombre aléatoire', 'rand(1, 100)', 'Entre 1 et 100'],
          ['round()', 'Arrondi', 'round(3.14159, 2)', '3.14']
        ],
        caption: 'Fonctions mathématiques'
      },
      {
        type: 'theory',
        title: 'Les chaînes de caractères',
        text: 'Les chaînes de caractères en PHP se délimitent avec des guillemets simples (\') ou doubles (").\n\nLa concaténation se fait avec l\'opérateur "."'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Opérations sur les chaînes',
        code: `<?php
$prenom = "Amine";
$nom = "Tounsi";
$nom_complet = $prenom . " " . $nom;
echo $nom_complet; // Affiche : Amine Tounsi

// Fonctions sur les chaînes
echo strlen("Hello");     // 5
echo substr("Hello", 1, 3); // ell
echo strpos("Hello", "e");  // 1
echo chr(65);            // A
echo ord("A");           // 65
?>`
      },
      {
        type: 'theory',
        title: 'Les booléens et opérateurs',
        text: 'Les booléens (true/false) sont utilisés dans les conditions et les boucles.'
      },
      {
        type: 'table-comparison',
        headers: ['Opérateur', 'Description', 'Exemple', 'Résultat'],
        rows: [
          ['==', 'Égalité (valeur)', '5 == "5"', 'true'],
          ['!=', 'Différent', '5 != 3', 'true'],
          ['>', 'Supérieur', '5 > 3', 'true'],
          ['<', 'Inférieur', '5 < 3', 'false'],
          ['>=', 'Supérieur ou égal', '5 >= 5', 'true'],
          ['<=', 'Inférieur ou égal', '3 <= 5', 'true']
        ],
        caption: 'Opérateurs de comparaison'
      },
      {
        type: 'table-comparison',
        headers: ['Opérateur', 'Description', 'Exemple', 'Résultat'],
        rows: [
          ['&&', 'ET logique', '(5 > 3) && (8 < 10)', 'true'],
          ['||', 'OU logique', '5 == 2 || 4 > 3', 'true'],
          ['!', 'NON logique', '!(5 > 3)', 'false']
        ],
        caption: 'Opérateurs logiques'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Transtypage (conversion de types)',
        code: `<?php
$x = (int)"123";    // 123
$y = (float)"12.3"; // 12.3
$z = (string)123;   // "123"
$b = (bool)0;       // false
$arr = (array)"texte"; // ["texte"]
?>`
      },
      {
        type: 'note',
        text: 'Le transtypage permet de convertir explicitement une variable d\'un type à un autre.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'Les variables commencent par $.',
      'PHP a des types : int, float, string, bool, array, null.',
      'La concaténation se fait avec ".".',
      'Les opérateurs logiques sont &&, ||, !.'
    ],
    exercises: [
      {
        id: 'ex-php-02-01',
        type: 'multiple-choice',
        question: 'Quel opérateur permet de concaténer des chaînes en PHP ?',
        options: ['+', '.', '&', '||'],
        correctAnswer: '.',
        hint: 'Le point est l\'opérateur de concaténation.',
        explanation: 'En PHP, l\'opérateur "." est utilisé pour concaténer des chaînes de caractères.'
      },
      {
        id: 'ex-php-02-02',
        type: 'code-practice',
        question: 'Écrivez du code PHP qui déclare une variable $age avec la valeur 25 et affiche "J\'ai 25 ans".',
        correctAnswer: '$age = 25; echo "J\'ai " . $age . " ans";',
        hint: 'Utilisez la concaténation avec .',
        explanation: '$age = 25; echo "J\'ai " . $age . " ans";',
        codeSnippet: '<?php\n// Écrivez votre code ici\n?>'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 3: Structures de contrôle (if, else, switch)
  // --------------------------------------------------------------
  'lesson-php-03': {
    id: 'lesson-php-03',
    title: 'Structures de contrôle (if, else, switch)',
    description: 'Apprenez à contrôler le flux d\'exécution avec les conditions.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-php-02'],
    content: [
      {
        type: 'theory',
        title: 'Les conditions',
        text: 'Les structures conditionnelles permettent d\'exécuter du code selon des conditions.'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'if, else, elseif',
        code: `<?php
$x = 10;

// if simple
if ($x > 0) {
    echo "Positif";
}

// if...else
if ($x > 0) {
    echo "Positif";
} else {
    echo "Non positif";
}

// if...elseif...else
if ($x > 0) {
    echo "Positif";
} elseif ($x < 0) {
    echo "Négatif";
} else {
    echo "Zéro";
}
?>`
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'switch',
        code: `<?php
$mois = 1;

switch ($mois) {
    case 1:
        echo "Janvier";
        break;
    case 2:
        echo "Février";
        break;
    case 3:
        echo "Mars";
        break;
    default:
        echo "Autre mois";
}
?>`
      },
      {
        type: 'note',
        text: 'Le break dans switch empêche l\'exécution des cas suivants.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'if exécute du code si la condition est vraie.',
      'else exécute du code si la condition est fausse.',
      'elseif permet de tester plusieurs conditions.',
      'switch compare une valeur à plusieurs cas.'
    ],
    exercises: [
      {
        id: 'ex-php-03-01',
        type: 'multiple-choice',
        question: 'Que fait le mot-clé break dans un switch ?',
        options: ['Il arrête le programme', 'Il sort du switch', 'Il passe au cas suivant', 'Il affiche une erreur'],
        correctAnswer: 'Il sort du switch',
        hint: 'Break interrompt l\'exécution.',
        explanation: 'break interrompt l\'exécution du switch et sort du bloc.'
      },
      {
        id: 'ex-php-03-02',
        type: 'code-practice',
        question: 'Écrivez une condition if qui vérifie si $note est supérieure ou égale à 10.',
        correctAnswer: 'if ($note >= 10) { echo "Validé"; }',
        hint: 'Utilisez >= pour la comparaison.',
        explanation: 'if ($note >= 10) { echo "Validé"; }',
        codeSnippet: '<?php\n// Écrivez votre code ici\n?>'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 4: Boucles (for, while, do...while) & Fonctions
  // --------------------------------------------------------------
  'lesson-php-04': {
    id: 'lesson-php-04',
    title: 'Boucles & Fonctions',
    description: 'Apprenez à répéter du code avec les boucles et à créer des fonctions.',
    estimatedMinutes: 18,
    difficulty: 'intermediate',
    dependencies: ['lesson-php-03'],
    content: [
      {
        type: 'theory',
        title: 'Les boucles',
        text: 'Les boucles permettent d\'exécuter un bloc de code plusieurs fois.'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'for, while, do...while',
        code: `<?php
// for - nombre déterminé de fois
for ($i = 1; $i <= 5; $i++) {
    echo $i . "<br>";
}

// while - tant que condition vraie
$i = 1;
while ($i <= 5) {
    echo $i . "<br>";
    $i++;
}

// do...while - exécute au moins une fois
$i = 1;
do {
    echo $i . "<br>";
    $i++;
} while ($i <= 5);
?>`
      },
      {
        type: 'theory',
        title: 'Les fonctions',
        text: 'Une fonction est un bloc de code réutilisable qui peut prendre des paramètres et retourner une valeur.'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Création de fonctions',
        code: `<?php
// Fonction simple
function direBonjour() {
    echo "Bonjour !";
}
direBonjour(); // Bonjour !

// Fonction avec paramètres
function addition($a, $b) {
    return $a + $b;
}
echo addition(4, 6); // 10

// Fonction avec paramètres optionnels
function saluer($nom = "Visiteur") {
    return "Bonjour $nom !";
}
echo saluer();      // Bonjour Visiteur !
echo saluer("Ali"); // Bonjour Ali !
?>`
      },
      {
        type: 'table-comparison',
        headers: ['Structure', 'Description', 'Utilisation'],
        rows: [
          ['for', 'Nombre déterminé de fois', 'for ($i=1; $i<=5; $i++)'],
          ['while', 'Tant que condition vraie', 'while ($i<=5)'],
          ['do...while', 'Au moins une fois', 'do { ... } while ($i<=5)']
        ],
        caption: 'Structures itératives'
      },
      {
        type: 'note',
        text: 'Les fonctions permettent de structurer le code et d\'éviter les répétitions.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'for : boucle avec compteur.',
      'while : boucle tant que condition vraie.',
      'do...while : exécute au moins une fois.',
      'function permet de créer des fonctions réutilisables.'
    ],
    exercises: [
      {
        id: 'ex-php-04-01',
        type: 'multiple-choice',
        question: 'Quelle boucle exécute le code au moins une fois ?',
        options: ['for', 'while', 'do...while', 'foreach'],
        correctAnswer: 'do...while',
        hint: 'Elle vérifie la condition après l\'exécution.',
        explanation: 'do...while exécute le code une première fois, puis vérifie la condition.'
      },
      {
        id: 'ex-php-04-02',
        type: 'code-practice',
        question: 'Écrivez une fonction qui retourne le produit de deux nombres.',
        correctAnswer: 'function produit($a, $b) { return $a * $b; }',
        hint: 'Utilisez function, return et l\'opérateur *.',
        explanation: 'function produit($a, $b) { return $a * $b; }',
        codeSnippet: '<?php\n// Écrivez votre code ici\n?>'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 5: Formulaires, GET, POST, Fonctions diverses
  // --------------------------------------------------------------
  'lesson-php-05': {
    id: 'lesson-php-05',
    title: 'Formulaires, GET, POST & Fonctions diverses',
    description: 'Apprenez à gérer les formulaires et à transmettre des données entre pages.',
    estimatedMinutes: 20,
    difficulty: 'intermediate',
    dependencies: ['lesson-php-02'],
    content: [
      {
        type: 'theory',
        title: 'Transmission de données',
        text: 'Deux méthodes principales pour transmettre des données :\n\n• GET : les données sont dans l\'URL (visible)\n• POST : les données sont dans le corps de la requête (caché)'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Formulaire HTML avec GET',
        code: `<form action="traitement_get.php" method="get">
    Nom : <input type="text" name="nom">
    <input type="submit" value="Envoyer">
</form>

<!-- URL obtenue : traitement_get.php?nom=Ali -->`
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Traitement GET',
        code: `<?php
// Récupérer la valeur de la variable nom
$nom = $_GET['nom'];
echo "Bonjour, $nom !";
?>`
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Formulaire HTML avec POST',
        code: `<form action="traitement_post.php" method="post">
    Nom : <input type="text" name="nom">
    <input type="submit" value="Envoyer">
</form>

<!-- Les données n'apparaissent pas dans l'URL -->`
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Traitement POST',
        code: `<?php
// Récupérer la valeur de la variable nom
$nom = $_POST['nom'];
echo "Bonjour, $nom !";
?>`
      },
      {
        type: 'theory',
        title: 'Fonctions diverses',
        text: 'PHP propose plusieurs fonctions utiles pour la gestion des données.'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Fonctions die(), isset(), require()',
        code: `<?php
// die() - arrête le script
$nom = "";
if ($nom == "") {
    die("Erreur : le nom est vide !");
}

// isset() - vérifie si une variable existe et n'est pas nulle
if (isset($age)) {
    echo "La variable age existe";
} else {
    echo "La variable age n'existe pas";
}

// require() - inclut un fichier PHP
require("config.php"); // inclut le fichier config.php
?>`
      },
      {
        type: 'table-comparison',
        headers: ['Fonction', 'Description', 'Exemple'],
        rows: [
          ['die()', 'Arrête le script avec un message', 'die("Erreur !")'],
          ['isset()', 'Vérifie si une variable existe', 'isset($variable)'],
          ['require()', 'Inclut un fichier (fatal si absent)', 'require("fichier.php")']
        ],
        caption: 'Fonctions PHP utiles'
      },
      {
        type: 'note',
        text: 'GET est visible dans l\'URL (non sécurisé). POST est plus sécurisé pour les informations sensibles.',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'GET transmet les données dans l\'URL.',
      'POST transmet les données dans le corps de la requête.',
      '$_GET et $_POST récupèrent les données.',
      'die() arrête le script.',
      'isset() vérifie l\'existence d\'une variable.',
      'require() inclut un fichier.'
    ],
    exercises: [
      {
        id: 'ex-php-05-01',
        type: 'multiple-choice',
        question: 'Quelle méthode est plus sécurisée pour envoyer des mots de passe ?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 'POST',
        hint: 'POST cache les données.',
        explanation: 'POST envoie les données dans le corps de la requête, elles n\'apparaissent pas dans l\'URL.'
      },
      {
        id: 'ex-php-05-02',
        type: 'code-practice',
        question: 'Écrivez du code PHP qui récupère le champ "email" envoyé par POST.',
        correctAnswer: '$email = $_POST["email"];',
        hint: 'Utilisez $_POST.',
        explanation: '$email = $_POST["email"]; récupère la valeur du champ email envoyé par POST.',
        codeSnippet: '<?php\n// Écrivez votre code ici\n?>'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 6: MySQL avec PHP (MySQLi)
  // --------------------------------------------------------------
  'lesson-php-06': {
    id: 'lesson-php-06',
    title: 'MySQL avec PHP (MySQLi)',
    description: 'Apprenez à connecter PHP à MySQL et à exécuter des requêtes.',
    estimatedMinutes: 22,
    difficulty: 'advanced',
    dependencies: ['lesson-php-05'],
    content: [
      {
        type: 'theory',
        title: 'Fonctions MySQLi',
        text: 'L\'extension MySQLi permet d\'interagir avec une base de données MySQL.'
      },
      {
        type: 'table-comparison',
        headers: ['Fonction', 'Description'],
        rows: [
          ['mysql_connect(host, user, password, db)', 'Établit une connexion à la base de données'],
          ['mysql_query(conn, requete)', 'Exécute une requête SQL'],
          ['mysql_error(conn)', 'Retourne le message d\'erreur'],
          ['mysql_fetch_array(res)', 'Récupère une ligne (tableau associatif)'],
          ['mysql_fetch_row(res)', 'Récupère une ligne (tableau indexé)'],
          ['mysql_num_rows(res)', 'Retourne le nombre de lignes'],
          ['mysql_affected_rows(conn)', 'Nombre de lignes affectées'],
          ['mysql_close(conn)', 'Ferme la connexion']
        ],
        caption: 'Fonctions MySQLi principales'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'Connexion à MySQL',
        code: `<?php
// Connexion à la base de données
$conn = mysql_connect("localhost", "root", "", "test") 
    or die("Connexion échouée");
?>`
      },
      {
        type: 'theory',
        title: 'Insertion de données',
        text: 'Exemple d\'insertion des données d\'un formulaire dans une base de données.'
      },
      {
        type: 'code-block',
        language: 'html',
        title: 'Formulaire HTML',
        code: `<body>
<h2>Formulaire d'inscription</h2>
<form action="insertion.php" method="post">
    Nom : <input type="text" name="nom" required><br><br>
    Email : <input type="email" name="email" required><br><br>
    <input type="submit" value="S'inscrire">
</form>
</body>`
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'insertion.php',
        code: `<?php
// Connexion à la base de données
$conn = mysql_connect("localhost", "root", "", "test") 
    or die("Connexion échouée");

// Récupération des données du formulaire
$nom = $_POST['nom'];
$email = $_POST['email'];

// Insertion dans la table
$sql = "INSERT INTO utilisateurs (nom, email) VALUES ('$nom', '$email')";

if (mysql_query($conn, $sql)) {
    echo "Inscription réussie !";
} else {
    echo "Erreur : " . mysql_error($conn);
}

// Fermeture de la connexion
mysql_close($conn);
?>`
      },
      {
        type: 'theory',
        title: 'Affichage des données',
        text: 'Exemple de récupération et affichage des données dans un tableau HTML.'
      },
      {
        type: 'code-block',
        language: 'php',
        title: 'afficher.php',
        code: `<?php
// Connexion à la base de données
$conn = mysql_connect("localhost", "root", "", "test") 
    or die("Connexion échouée");

// Requête pour récupérer tous les utilisateurs
$sql = "SELECT * FROM utilisateurs";
$result = mysql_query($conn, $sql) or die(mysql_error($conn));

// Vérification des résultats
if (mysql_num_rows($result) > 0) {
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>ID</th><th>Nom</th><th>Email</th></tr>";
    
    // Parcours des lignes
    while ($row = mysql_fetch_array($result)) {
        echo "<tr>";
        echo "<td>". $row['id'] . "</td>";
        echo "<td>". $row['nom'] . "</td>";
        echo "<td>". $row['email'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "Aucun utilisateur trouvé.";
}

// Fermeture de la connexion
mysql_close($conn);
?>`
      },
      {
        type: 'note',
        text: 'mysql_fetch_array() récupère une ligne sous forme de tableau associatif. Utilisez les noms de colonnes pour accéder aux valeurs.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'mysql_connect() établit la connexion.',
      'mysql_query() exécute des requêtes SQL.',
      'mysql_fetch_array() récupère les résultats.',
      'mysql_num_rows() compte les lignes.',
      'mysql_close() ferme la connexion.',
      'Toujours vérifier les erreurs avec mysql_error().'
    ],
    exercises: [
      {
        id: 'ex-php-06-01',
        type: 'multiple-choice',
        question: 'Quelle fonction exécute une requête SQL en PHP avec MySQLi ?',
        options: ['mysql_connect()', 'mysql_query()', 'mysql_fetch()', 'mysql_error()'],
        correctAnswer: 'mysql_query()',
        hint: 'Cette fonction exécute la requête.',
        explanation: 'mysql_query() exécute une requête SQL sur la connexion donnée.'
      },
      {
        id: 'ex-php-06-02',
        type: 'code-practice',
        question: 'Écrivez une requête SQL pour insérer un utilisateur avec nom "Ali" et email "ali@mail.com".',
        correctAnswer: 'INSERT INTO utilisateurs (nom, email) VALUES ("Ali", "ali@mail.com")',
        hint: 'Utilisez INSERT INTO.',
        explanation: 'INSERT INTO utilisateurs (nom, email) VALUES ("Ali", "ali@mail.com")',
        codeSnippet: '-- Écrivez votre code ici\n'
      }
    ]
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const fullPhpCourse = {
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

