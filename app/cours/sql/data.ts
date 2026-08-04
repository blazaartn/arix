// data.ts - SQL/BD Course Data (Full Curriculum)

export type ContentBlock =
  | { type: 'theory'; title?: string; text: string; visualSuggestion?: string; }
  | { type: 'code-block'; language: 'sql' | 'text'; code: string; title?: string; }
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
  id: 'sql-full-course',
  title: 'SQL & Bases de données',
  subtitle: 'De la modélisation aux requêtes complexes',
  description: 'Maîtrisez SQL et les bases de données relationnelles. Apprenez la modélisation, les requêtes SELECT, JOIN, GROUP BY, et la gestion des données.',
  chapters: [
    {
      id: 'ch-sql-01',
      title: 'Concepts fondamentaux & Anomalies',
      description: 'Comprenez les bases de données relationnelles et les anomalies.',
      lessonIds: ['lesson-sql-01']
    },
    {
      id: 'ch-sql-02',
      title: 'DDL - Définition des données',
      description: 'Apprenez à créer et modifier des tables avec SQL.',
      lessonIds: ['lesson-sql-02', 'lesson-sql-03']
    },
    {
      id: 'ch-sql-03',
      title: 'DML - Manipulation des données',
      description: 'Insérez, modifiez et supprimez des données.',
      lessonIds: ['lesson-sql-04']
    },
    {
      id: 'ch-sql-04',
      title: 'Requêtes SELECT avancées',
      description: 'Filtrez, joignez, groupez et triez vos données.',
      lessonIds: ['lesson-sql-05', 'lesson-sql-06', 'lesson-sql-07']
    }
  ]
};

// ============================================================
// LESSON CONTENT
// ============================================================

export const lessonContent: Record<string, Lesson> = {

  // --------------------------------------------------------------
  // LEÇON 1: Concepts fondamentaux & Anomalies
  // --------------------------------------------------------------
  'lesson-sql-01': {
    id: 'lesson-sql-01',
    title: 'Concepts fondamentaux & Anomalies',
    description: 'Découvrez les bases de données relationnelles et les anomalies à éviter.',
    estimatedMinutes: 20,
    difficulty: 'beginner',
    dependencies: [],
    content: [
      {
        type: 'theory',
        text: 'Une base de données relationnelle (BDR) est un système de gestion de données qui organise les informations sous forme de tables, où chaque table est constituée de lignes et de colonnes.\n\n• Lignes : enregistrements (tuples)\n• Colonnes : attributs (champs)\n\nLe modèle relationnel repose sur des relations définies entre ces tables, souvent par l\'intermédiaire de clés primaires et de clés étrangères.'
      },
      {
        type: 'example-box',
        title: 'Exemple de base de données',
        description: 'Tables d\'une boutique de produits IT',
        code: `client(idClient, nom, email)
article(idArticle, nomArticle, marque, prix)
achat(idClient#, idArticle#, dateAchat, quantité)

Légende:
• Les clés primaires sont soulignées
• Les clés étrangères sont identifiées par "#"
• La clé primaire de la table achat est composée des champs (idClient, idArticle, dateAchat)`
      },
      {
        type: 'theory',
        title: 'Les anomalies',
        text: 'Les anomalies sont des problèmes d\'intégrité des données qui surviennent lorsqu\'une base de données est mal conçue.\n\nTypes d\'anomalies :\n\n1. Absence ou duplication de clés primaires\n2. Clés étrangères non conformes\n3. Redondance des données\n4. Violation des contraintes de domaine'
      },
      {
        type: 'table-comparison',
        headers: ['Anomalie', 'Description', 'Exemple'],
        rows: [
          ['Absence de PK', 'Un enregistrement n\'a pas de clé primaire', 'NULL dans idClient'],
          ['Duplication de PK', 'Deux enregistrements ont la même PK', 'idClient = 2 pour deux personnes'],
          ['FK non conforme', 'Une clé étrangère pointe vers un enregistrement inexistant', 'idClient = 4 qui n\'existe pas'],
          ['Redondance', 'Des données sont répétées inutilement', 'Nom et email du client répétés dans chaque achat']
        ],
        caption: 'Les 4 types d\'anomalies'
      },
      {
        type: 'theory',
        title: 'La normalisation',
        text: 'La normalisation consiste à décomposer une grande table en plusieurs tables plus petites afin de minimiser la redondance et les anomalies.\n\nSolution pour l\'exemple de redondance :\n\n• Table Clients : idClient, nom, email\n• Table Produits : idProduit, nomProduit, prix\n• Table Achats : idClient#, idProduit#, dateAchat'
      },
      {
        type: 'note',
        text: 'Les contraintes de domaine vérifient que les valeurs respectent des critères comme le type de données, la plage de valeurs ou le format (ex: email).',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'Une BDR organise les données en tables avec lignes et colonnes.',
      'Une clé primaire identifie de manière unique chaque enregistrement.',
      'Une clé étrangère crée un lien entre deux tables.',
      'Les anomalies (redondance, FK non conformes, etc.) doivent être évitées par la normalisation.'
    ],
    exercises: [
      {
        id: 'ex-sql-01-01',
        type: 'multiple-choice',
        question: 'Qu\'est-ce qu\'une clé primaire ?',
        options: ['Un identifiant unique pour chaque enregistrement', 'Un lien entre deux tables', 'Une colonne qui peut être nulle', 'Un type de donnée'],
        correctAnswer: 'Un identifiant unique pour chaque enregistrement',
        hint: 'Elle permet d\'identifier de manière unique chaque ligne.',
        explanation: 'Une clé primaire est un identifiant unique qui distingue chaque enregistrement dans une table.'
      },
      {
        id: 'ex-sql-01-02',
        type: 'true-false',
        question: 'Une clé étrangère peut pointer vers un enregistrement qui n\'existe pas.',
        correctAnswer: 'false',
        hint: 'Cela brise l\'intégrité référentielle.',
        explanation: 'Une clé étrangère doit toujours pointer vers un enregistrement existant dans la table référencée.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 2: SQL - Types de données & CREATE TABLE
  // --------------------------------------------------------------
  'lesson-sql-02': {
    id: 'lesson-sql-02',
    title: 'SQL - Types de données & CREATE TABLE',
    description: 'Apprenez les types de données SQL et comment créer des tables.',
    estimatedMinutes: 18,
    difficulty: 'beginner',
    dependencies: ['lesson-sql-01'],
    content: [
      {
        type: 'theory',
        title: 'Les types de données SQL',
        text: 'SQL propose plusieurs types de données pour stocker différentes informations.\n\n• INT : nombres entiers\n• DECIMAL(p, s) : nombres décimaux avec précision\n• CHAR(n) : chaîne de caractères de longueur fixe\n• VARCHAR(n) : chaîne de caractères de longueur variable\n• TEXT : texte long\n• DATE : date (AAAA-MM-JJ)\n• TIME : heure (HH:MM:SS)\n• DATETIME : date et heure'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples de types',
        code: `-- INT
AGE INT

-- DECIMAL (10 chiffres total, 2 après la virgule)
PRIX DECIMAL(10, 2)

-- CHAR (longueur fixe)
CODE CHAR(10)

-- VARCHAR (longueur variable)
NOM VARCHAR(50)

-- DATE
DATE_NAISSANCE DATE

-- DATETIME
CREATION DATETIME`
      },
      {
        type: 'theory',
        title: 'CREATE TABLE',
        text: 'La commande CREATE TABLE permet de créer une nouvelle table dans une base de données.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Syntaxe de CREATE TABLE',
        code: `CREATE TABLE NomTable (
  Colonne1 TypeDeDonnee(taille) [Contraintes],
  Colonne2 TypeDeDonnee(taille) [Contraintes],
  ...
);`
      },
      {
        type: 'example-box',
        title: 'Exemple de création de table',
        description: 'Création de la table Clients',
        code: `CREATE TABLE Clients (
  ClientID INT PRIMARY KEY,
  Nom VARCHAR(50) NOT NULL,
  Email VARCHAR(100) UNIQUE,
  DateInscription DATE DEFAULT '1990-01-01'
);`
      },
      {
        type: 'table-comparison',
        headers: ['Contrainte', 'Description', 'Exemple'],
        rows: [
          ['PRIMARY KEY', 'Identifiant unique et non nul', 'ClientID INT PRIMARY KEY'],
          ['NOT NULL', 'Empêche les valeurs nulles', 'Nom VARCHAR(50) NOT NULL'],
          ['UNIQUE', 'Assure l\'unicité des valeurs', 'Email VARCHAR(100) UNIQUE'],
          ['DEFAULT', 'Valeur par défaut', 'DateInscription DATE DEFAULT "1990-01-01"'],
          ['REFERENCES', 'Clé étrangère', 'ClientID INT REFERENCES Client(ClientID)'],
          ['AUTO_INCREMENT', 'Incrémentation automatique', 'id INT AUTO_INCREMENT PRIMARY KEY']
        ],
        caption: 'Les contraintes SQL'
      },
      {
        type: 'note',
        text: 'AUTO_INCREMENT s\'applique à une colonne de type INT et incrémente automatiquement la valeur à chaque insertion.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'INT pour les entiers, VARCHAR pour les chaînes variables.',
      'PRIMARY KEY identifie chaque enregistrement de manière unique.',
      'NOT NULL empêche les valeurs vides.',
      'UNIQUE garantit que les valeurs ne se répètent pas.'
    ],
    exercises: [
      {
        id: 'ex-sql-02-01',
        type: 'multiple-choice',
        question: 'Quel type de données utiliser pour stocker un nom ?',
        options: ['INT', 'VARCHAR', 'DATE', 'DECIMAL'],
        correctAnswer: 'VARCHAR',
        hint: 'Un nom est une chaîne de caractères de longueur variable.',
        explanation: 'VARCHAR(n) est utilisé pour les chaînes de caractères de longueur variable comme les noms.'
      },
      {
        id: 'ex-sql-02-02',
        type: 'code-practice',
        question: 'Écrivez une requête CREATE TABLE pour une table "Produits" avec id, nom et prix.',
        correctAnswer: 'CREATE TABLE Produits (id INT PRIMARY KEY, nom VARCHAR(50), prix DECIMAL(10,2));',
        hint: 'Utilisez INT pour id, VARCHAR pour nom et DECIMAL pour prix.',
        explanation: 'CREATE TABLE Produits (id INT PRIMARY KEY, nom VARCHAR(50), prix DECIMAL(10,2));',
        codeSnippet: '-- Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 3: FOREIGN KEY, CHECK, ALTER TABLE
  // --------------------------------------------------------------
  'lesson-sql-03': {
    id: 'lesson-sql-03',
    title: 'FOREIGN KEY, CHECK & ALTER TABLE',
    description: 'Apprenez à lier des tables avec FOREIGN KEY et à modifier leur structure.',
    estimatedMinutes: 20,
    difficulty: 'intermediate',
    dependencies: ['lesson-sql-02'],
    content: [
      {
        type: 'theory',
        title: 'La contrainte FOREIGN KEY',
        text: 'La contrainte FOREIGN KEY (clé étrangère) est utilisée pour lier deux tables. Elle fait référence à une colonne dans une autre table, généralement une PRIMARY KEY.\n\nElle garantit l\'intégrité référentielle : la valeur de la clé étrangère doit exister dans la table parent.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'FOREIGN KEY dans CREATE TABLE',
        code: `CREATE TABLE Commande (
  CommandeID INT PRIMARY KEY,
  ClientID INT,
  DateCommande DATE,
  FOREIGN KEY (ClientID) REFERENCES Client(ClientID)
);`
      },
      {
        type: 'theory',
        title: 'ON UPDATE CASCADE et ON DELETE CASCADE',
        text: 'Ces clauses définissent le comportement lors de la mise à jour ou suppression d\'une ligne parent.\n\n• ON UPDATE CASCADE : met à jour automatiquement la FK dans la table enfant\n• ON DELETE CASCADE : supprime automatiquement les lignes enfant'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemple avec CASCADE',
        code: `CREATE TABLE Clients (
  ClientID INT PRIMARY KEY,
  Nom VARCHAR(100)
);

CREATE TABLE Commandes (
  CommandeID INT PRIMARY KEY,
  ClientID INT,
  FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);`
      },
      {
        type: 'theory',
        title: 'La contrainte CHECK',
        text: 'La contrainte CHECK impose une condition qui doit être vraie pour chaque enregistrement.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemple avec CHECK',
        code: `CREATE TABLE Produit (
  ProduitID INT PRIMARY KEY,
  Nom VARCHAR(100) NOT NULL,
  Prix DECIMAL(10, 2),
  QuantiteStock INT CHECK (QuantiteStock >= 0)
);`
      },
      {
        type: 'table-comparison',
        headers: ['Opérateur', 'Description', 'Exemple CHECK'],
        rows: [
          ['=', 'Égalité', 'CHECK (Age = 30)'],
          ['!=', 'Différent', 'CHECK (Age != 30)'],
          ['>', 'Supérieur', 'CHECK (Age > 18)'],
          ['<', 'Inférieur', 'CHECK (Age < 65)'],
          ['>=', 'Supérieur ou égal', 'CHECK (Salaire >= 3000)'],
          ['<=', 'Inférieur ou égal', 'CHECK (Salaire <= 10000)'],
          ['BETWEEN', 'Compris entre', 'CHECK (Age BETWEEN 18 AND 65)'],
          ['IN', 'Dans une liste', 'CHECK (Statut IN ("Actif", "Inactif"))']
        ],
        caption: 'Opérateurs de comparaison SQL'
      },
      {
        type: 'theory',
        title: 'ALTER TABLE',
        text: 'La commande ALTER TABLE permet de modifier la structure d\'une table existante.\n\nOpérations possibles :\n• Ajouter une colonne\n• Supprimer une colonne\n• Modifier une colonne\n• Renommer une colonne\n• Ajouter/supprimer des contraintes'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples ALTER TABLE',
        code: `-- Ajouter une colonne
ALTER TABLE Client ADD COLUMN Email VARCHAR(100);

-- Supprimer une colonne
ALTER TABLE Client DROP COLUMN Adresse;

-- Modifier une colonne
ALTER TABLE Client ALTER COLUMN Age VARCHAR(3);

-- Renommer une colonne
ALTER TABLE Client RENAME COLUMN Nom TO NomClient;

-- Ajouter une contrainte FOREIGN KEY
ALTER TABLE Commandes ADD CONSTRAINT fk_client 
  FOREIGN KEY (ClientID) REFERENCES Clients(ClientID);

-- Supprimer une contrainte
ALTER TABLE Commandes DROP CONSTRAINT fk_client;`
      },
      {
        type: 'note',
        text: 'DROP TABLE supprime une table et toutes ses données. Cette opération est irréversible !',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'FOREIGN KEY crée un lien entre deux tables (intégrité référentielle).',
      'ON UPDATE CASCADE et ON DELETE CASCADE synchronisent les modifications.',
      'CHECK impose une condition sur les valeurs acceptées.',
      'ALTER TABLE modifie la structure d\'une table existante.'
    ],
    exercises: [
      {
        id: 'ex-sql-03-01',
        type: 'multiple-choice',
        question: 'Que fait ON DELETE CASCADE ?',
        options: ['Supprime la table parent', 'Supprime automatiquement les lignes enfant', 'Désactive la clé étrangère', 'Ignore la suppression'],
        correctAnswer: 'Supprime automatiquement les lignes enfant',
        hint: 'Cascade signifie "en cascade".',
        explanation: 'ON DELETE CASCADE supprime automatiquement les lignes enfant lorsque la ligne parent est supprimée.'
      },
      {
        id: 'ex-sql-03-02',
        type: 'code-practice',
        question: 'Écrivez une contrainte CHECK qui vérifie que l\'âge est entre 18 et 65.',
        correctAnswer: 'CHECK (Age BETWEEN 18 AND 65)',
        hint: 'Utilisez BETWEEN.',
        explanation: 'CHECK (Age BETWEEN 18 AND 65) impose que l\'âge soit compris entre 18 et 65 inclus.',
        codeSnippet: '-- Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 4: INSERT, UPDATE, DELETE
  // --------------------------------------------------------------
  'lesson-sql-04': {
    id: 'lesson-sql-04',
    title: 'INSERT, UPDATE, DELETE',
    description: 'Apprenez à insérer, modifier et supprimer des données.',
    estimatedMinutes: 16,
    difficulty: 'intermediate',
    dependencies: ['lesson-sql-02'],
    content: [
      {
        type: 'theory',
        title: 'INSERT INTO',
        text: 'La commande INSERT INTO permet d\'ajouter des données dans une table.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples INSERT INTO',
        code: `-- Insérer dans toutes les colonnes
INSERT INTO Clients VALUES (1, 'Ahmed', 'ahmed@example.com');

-- Insérer dans certaines colonnes
INSERT INTO Clients (Nom, Email) VALUES ('Layla', 'layla@example.com');

-- Insérer plusieurs lignes
INSERT INTO Clients (Nom, Email) VALUES 
  ('Ahmed', 'ahmed@example.com'),
  ('Layla', 'layla@example.com');`
      },
      {
        type: 'theory',
        title: 'UPDATE',
        text: 'La commande UPDATE permet de modifier des données existantes.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples UPDATE',
        code: `-- Modifier une valeur
UPDATE Employees SET salaire = 4000 WHERE employee_id = 1;

-- Modifier plusieurs colonnes
UPDATE Employees SET salaire = 4500, departement = 'Marketing' 
WHERE employee_id = 3;

-- Modifier toutes les lignes
UPDATE Employees SET salaire = 5000;

-- Incrémenter une valeur
UPDATE Employees SET salaire = salaire + 500 
WHERE departement = 'IT';`
      },
      {
        type: 'theory',
        title: 'DELETE',
        text: 'La commande DELETE permet de supprimer des enregistrements.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples DELETE',
        code: `-- Supprimer un enregistrement spécifique
DELETE FROM Clients WHERE ClientID = 1;

-- Supprimer tous les enregistrements
DELETE FROM Clients;`
      },
      {
        type: 'note',
        text: 'DELETE sans WHERE supprime TOUTES les lignes de la table. Utilisez toujours WHERE pour supprimer des lignes spécifiques.',
        style: 'warning'
      }
    ],
    keyTakeaways: [
      'INSERT INTO ajoute des données.',
      'UPDATE modifie des données existantes (avec WHERE).',
      'DELETE supprime des données (avec WHERE pour éviter de tout supprimer).'
    ],
    exercises: [
      {
        id: 'ex-sql-04-01',
        type: 'code-practice',
        question: 'Écrivez une requête UPDATE qui augmente le salaire de 500 pour les employés du département IT.',
        correctAnswer: 'UPDATE Employees SET salaire = salaire + 500 WHERE departement = "IT";',
        hint: 'Utilisez SET salaire = salaire + 500',
        explanation: 'UPDATE Employees SET salaire = salaire + 500 WHERE departement = "IT";',
        codeSnippet: '-- Écrivez votre code ici\n'
      },
      {
        id: 'ex-sql-04-02',
        type: 'multiple-choice',
        question: 'Que fait DELETE FROM Clients;',
        options: ['Supprime un client', 'Supprime la table Clients', 'Supprime tous les clients', 'Supprime la colonne Clients'],
        correctAnswer: 'Supprime tous les clients',
        hint: 'Il n\'y a pas de condition WHERE.',
        explanation: 'DELETE FROM Clients; supprime toutes les lignes de la table Clients.'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 5: SELECT, WHERE, LIKE, IS NULL
  // --------------------------------------------------------------
  'lesson-sql-05': {
    id: 'lesson-sql-05',
    title: 'SELECT, WHERE, LIKE, IS NULL',
    description: 'Apprenez à sélectionner et filtrer des données.',
    estimatedMinutes: 18,
    difficulty: 'intermediate',
    dependencies: ['lesson-sql-04'],
    content: [
      {
        type: 'theory',
        title: 'La commande SELECT',
        text: 'La commande SELECT permet de récupérer des données dans une table.\n\nStructure :\nSELECT colonnes FROM table;'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples SELECT',
        code: `-- Sélectionner toutes les colonnes
SELECT * FROM utilisateurs;

-- Sélectionner des colonnes spécifiques
SELECT nom, age FROM utilisateurs;`
      },
      {
        type: 'theory',
        title: 'La clause WHERE',
        text: 'WHERE permet de filtrer les résultats selon des conditions.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples WHERE',
        code: `-- Filtre simple
SELECT nom, salaire FROM employes WHERE salaire > 50000;

-- Plusieurs conditions (AND)
SELECT nom, age, salaire 
FROM employes 
WHERE age > 30 AND salaire > 50000;

-- Plusieurs conditions (OR)
SELECT nom, age, salaire 
FROM employes 
WHERE age > 30 OR salaire > 50000;`
      },
      {
        type: 'theory',
        title: 'L\'opérateur LIKE',
        text: 'LIKE permet de rechercher des motifs dans du texte.\n\n• % : zéro, un ou plusieurs caractères\n• _ : exactement un caractère'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples LIKE',
        code: `-- Noms commençant par "A"
SELECT nom FROM employes WHERE nom LIKE 'A%';

-- Noms contenant "al"
SELECT nom FROM employes WHERE nom LIKE '%al%';

-- Noms de 4 lettres
SELECT nom FROM employes WHERE nom LIKE '____';`
      },
      {
        type: 'theory',
        title: 'IS NULL et IS NOT NULL',
        text: 'Ces opérateurs vérifient la présence de valeurs NULL.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples IS NULL/IS NOT NULL',
        code: `-- Trouver les enregistrements avec age NULL
SELECT nom, age FROM employees WHERE age IS NULL;

-- Trouver les enregistrements avec salaire non NULL
SELECT nom, salaire FROM employees WHERE salaire IS NOT NULL;`
      },
      {
        type: 'table-comparison',
        headers: ['Joker', 'Description', 'Exemple', 'Signification'],
        rows: [
          ['%', '0 ou plusieurs caractères', "'A%'", 'Commence par A'],
          ['_', 'Exactement 1 caractère', "'_o%'", '2ème lettre = o']
        ],
        caption: 'Jokers de l\'opérateur LIKE'
      },
      {
        type: 'note',
        text: 'NULL n\'est pas une valeur, c\'est l\'absence de valeur. On ne peut pas utiliser = NULL, il faut utiliser IS NULL.',
        style: 'info'
      }
    ],
    keyTakeaways: [
      'SELECT récupère les données.',
      'WHERE filtre les résultats.',
      'LIKE recherche des motifs dans le texte.',
      'IS NULL vérifie l\'absence de valeur.'
    ],
    exercises: [
      {
        id: 'ex-sql-05-01',
        type: 'multiple-choice',
        question: 'Quel opérateur permet de rechercher des motifs dans du texte ?',
        options: ['LIKE', 'IS NULL', 'BETWEEN', 'IN'],
        correctAnswer: 'LIKE',
        hint: 'Il est utilisé avec % et _.',
        explanation: 'LIKE est utilisé pour rechercher des motifs dans du texte avec les jokers % et _.'
      },
      {
        id: 'ex-sql-05-02',
        type: 'code-practice',
        question: 'Écrivez une requête SELECT qui trouve les employés dont le nom commence par "B".',
        correctAnswer: 'SELECT * FROM employes WHERE nom LIKE "B%";',
        hint: 'Utilisez LIKE avec %.',
        explanation: 'SELECT * FROM employes WHERE nom LIKE "B%"; trouve tous les employés dont le nom commence par B.',
        codeSnippet: '-- Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 6: JOIN et fonctions DATE
  // --------------------------------------------------------------
  'lesson-sql-06': {
    id: 'lesson-sql-06',
    title: 'JOIN et fonctions DATE',
    description: 'Apprenez à combiner des tables et à manipuler les dates.',
    estimatedMinutes: 20,
    difficulty: 'intermediate',
    dependencies: ['lesson-sql-05'],
    content: [
      {
        type: 'theory',
        title: 'Les jointures (JOIN)',
        text: 'Les jointures permettent de combiner des données de plusieurs tables.\n\nSyntaxe :\nSELECT colonnes\nFROM Table1, Table2\nWHERE Table1.colonne = Table2.colonne;'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemple de jointure',
        code: `-- Tables
-- Clients : ClientID, Nom
-- Commandes : CommandeID, ClientID, Produit

SELECT A.Nom AS Client, C.Produit 
FROM Clients AS A, Commandes AS C 
WHERE A.ClientID = C.ClientID;

-- Résultat :
-- Client    | Produit
-- Ahmed     | Ordinateur
-- Layla     | Smartphone
-- Ahmed     | Imprimante`
      },
      {
        type: 'theory',
        title: 'Fonctions sur les dates',
        text: 'SQL propose plusieurs fonctions pour manipuler les dates.\n\n• DAY(date) : renvoie le jour\n• MONTH(date) : renvoie le mois\n• YEAR(date) : renvoie l\'année\n• NOW() : date et heure actuelles\n• DATE() : renvoie la partie date\n• ADDDATE() : ajoute un intervalle\n• DATEDIFF(date1, date2) : différence en jours'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples de fonctions DATE',
        code: `-- Extraire des composants
SELECT DAY('2024-10-06');  -- 6
SELECT MONTH('2024-10-06'); -- 10
SELECT YEAR('2024-10-06');  -- 2024

-- Date actuelle
SELECT NOW();  -- 2025-07-03 14:30:15
SELECT DATE(NOW());  -- 2024-10-06

-- Ajouter des jours
SELECT ADDDATE("2025-10-10", 15);  -- 2025-10-25

-- Ajouter des mois
SELECT ADDDATE("2025-10-10", INTERVAL 3 MONTH);  -- 2026-01-10

-- Différence en jours
SELECT DATEDIFF('2025-07-15', '2025-07-01');  -- 14`
      },
      {
        type: 'note',
        text: 'AS permet de créer des alias (noms temporaires) pour les colonnes ou les tables.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'JOIN combine des données de plusieurs tables.',
      'AS crée des alias pour les colonnes et tables.',
      'DAY(), MONTH(), YEAR() extraient des composants de date.',
      'ADDDATE() et DATEDIFF() manipulent les dates.'
    ],
    exercises: [
      {
        id: 'ex-sql-06-01',
        type: 'multiple-choice',
        question: 'Quelle fonction calcule la différence en jours entre deux dates ?',
        options: ['ADDDATE()', 'DATEDIFF()', 'DATE()', 'NOW()'],
        correctAnswer: 'DATEDIFF()',
        hint: 'Différence = Diff.',
        explanation: 'DATEDIFF(date1, date2) retourne la différence en jours entre deux dates.'
      },
      {
        id: 'ex-sql-06-02',
        type: 'code-practice',
        question: 'Écrivez une jointure pour afficher les commandes avec le nom du client.',
        correctAnswer: 'SELECT Clients.Nom, Commandes.Produit FROM Clients, Commandes WHERE Clients.ClientID = Commandes.ClientID;',
        hint: 'Utilisez FROM avec deux tables et WHERE pour la condition.',
        explanation: 'SELECT Clients.Nom, Commandes.Produit FROM Clients, Commandes WHERE Clients.ClientID = Commandes.ClientID;',
        codeSnippet: '-- Écrivez votre code ici\n'
      }
    ]
  },

  // --------------------------------------------------------------
  // LEÇON 7: Agrégation, GROUP BY, HAVING, ORDER BY, Subquery
  // --------------------------------------------------------------
  'lesson-sql-07': {
    id: 'lesson-sql-07',
    title: 'Agrégation, GROUP BY, HAVING, ORDER BY, Subquery',
    description: 'Maîtrisez les fonctions d\'agrégation, le groupement, le tri et les sous-requêtes.',
    estimatedMinutes: 25,
    difficulty: 'advanced',
    dependencies: ['lesson-sql-05'],
    content: [
      {
        type: 'theory',
        title: 'Fonctions d\'agrégation',
        text: 'Les fonctions d\'agrégation effectuent des calculs sur un ensemble de lignes.\n\n• COUNT() : compte les lignes\n• SUM() : calcule la somme\n• AVG() : calcule la moyenne\n• MAX() : valeur maximale\n• MIN() : valeur minimale'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples d\'agrégation',
        code: `SELECT COUNT(*) FROM Commandes;  -- Nombre total de commandes
SELECT SUM(Prix) FROM Commandes;    -- Somme des prix
SELECT AVG(Prix) FROM Commandes;    -- Moyenne des prix
SELECT MAX(Prix) FROM Commandes;    -- Prix maximum
SELECT MIN(Prix) FROM Commandes;    -- Prix minimum`
      },
      {
        type: 'theory',
        title: 'GROUP BY',
        text: 'GROUP BY regroupe les lignes ayant des valeurs communes et permet d\'appliquer des fonctions d\'agrégation sur chaque groupe.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemple GROUP BY',
        code: `-- Table Ventes : Produit, Quantite, Prix
SELECT Produit, SUM(Quantite) AS QuantiteTotale
FROM Ventes
GROUP BY Produit;

-- Résultat :
-- Produit        | QuantiteTotale
-- Ordinateur     | 2
-- Souris         | 5
-- Clavier        | 3
-- Casque Audio   | 1`
      },
      {
        type: 'theory',
        title: 'HAVING',
        text: 'HAVING filtre les résultats après le GROUP BY (contrairement à WHERE qui filtre avant le groupement).'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemple HAVING',
        code: `SELECT Produit, SUM(Quantite) AS QuantiteTotale
FROM Ventes
GROUP BY Produit
HAVING SUM(Quantite) >= 3;

-- Résultat :
-- Produit  | QuantiteTotale
-- Souris   | 5
-- Clavier  | 3`
      },
      {
        type: 'theory',
        title: 'ORDER BY',
        text: 'ORDER BY trie les résultats par ordre croissant (ASC) ou décroissant (DESC).'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples ORDER BY',
        code: `-- Trier par prix croissant
SELECT NomProduit, Prix FROM Produits ORDER BY Prix;

-- Trier par prix décroissant
SELECT NomProduit, Prix FROM Produits ORDER BY 2 DESC;

-- Trier par plusieurs colonnes
SELECT gouvernorat, ville, nb_colis 
FROM Livraisons 
ORDER BY gouvernorat ASC, ville ASC;`
      },
      {
        type: 'theory',
        title: 'Sous-requêtes (Subquery)',
        text: 'Une sous-requête est une requête imbriquée dans la clause WHERE d\'une autre requête.'
      },
      {
        type: 'code-block',
        language: 'sql',
        title: 'Exemples de sous-requêtes',
        code: `-- Trouver les employés avec le salaire minimum
SELECT Nom, Salaire 
FROM Employees 
WHERE Salaire = (SELECT MIN(Salaire) FROM Salaries);

-- Avec IN : trouver les produits vendus en 2023
SELECT NomProduit
FROM Produits
WHERE IDProduit IN (SELECT IDProduit FROM Ventes WHERE Annee = 2023);`
      },
      {
        type: 'table-comparison',
        headers: ['Fonction', 'Description', 'Exemple'],
        rows: [
          ['COUNT()', 'Compte les lignes', 'COUNT(*)'],
          ['SUM()', 'Somme des valeurs', 'SUM(Prix)'],
          ['AVG()', 'Moyenne des valeurs', 'AVG(Prix)'],
          ['MAX()', 'Valeur maximale', 'MAX(Prix)'],
          ['MIN()', 'Valeur minimale', 'MIN(Prix)']
        ],
        caption: 'Fonctions d\'agrégation'
      },
      {
        type: 'note',
        text: 'GROUP BY regroupe les données avant d\'appliquer les fonctions d\'agrégation. HAVING filtre les groupes après.',
        style: 'tip'
      }
    ],
    keyTakeaways: [
      'COUNT, SUM, AVG, MAX, MIN sont des fonctions d\'agrégation.',
      'GROUP BY regroupe les données par catégorie.',
      'HAVING filtre après le GROUP BY.',
      'ORDER BY trie les résultats.',
      'Les sous-requêtes permettent des conditions complexes.'
    ],
    exercises: [
      {
        id: 'ex-sql-07-01',
        type: 'multiple-choice',
        question: 'Quelle clause filtre les résultats après le GROUP BY ?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
        correctAnswer: 'HAVING',
        hint: 'WHERE filtre avant, HAVING après.',
        explanation: 'HAVING est utilisé pour filtrer les résultats après le groupement.'
      },
      {
        id: 'ex-sql-07-02',
        type: 'code-practice',
        question: 'Écrivez une requête qui compte le nombre de commandes par client.',
        correctAnswer: 'SELECT ClientID, COUNT(*) FROM Commandes GROUP BY ClientID;',
        hint: 'Utilisez COUNT et GROUP BY.',
        explanation: 'SELECT ClientID, COUNT(*) FROM Commandes GROUP BY ClientID;',
        codeSnippet: '-- Écrivez votre code ici\n'
      }
    ]
  }
};

// ============================================================
// EXPORTS
// ============================================================

export const fullSqlCourse = {
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

