export interface Project {
    id: string;
    title: string;
    description: string;
    category: 'html' | 'css' | 'javascript' | 'php' | 'sql' | 'python' | 'fullstack';
    pageUrl: string;
    technologies: string[];
    tasks: string[];
    is_completed: boolean;  // ✅ ADD THIS
}

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Emploi du Temps - HTML',
        description: 'Créez un emploi du temps interactif en HTML pur.',
        category: 'html',
        pageUrl: '/projects/1',
        technologies: ['HTML5', 'CSS3'],
        tasks: [
            'Créer une grille 7x24 (jours x heures)',
            'Ajouter des cours avec des couleurs différentes par matière',
            'Ajouter des pauses et des activités',
            'Faire une version responsive pour mobile'
        ],
        is_completed: false,  // ✅ ADD THIS
    },
    {
        id: '2',
        title: 'Restaurant App - HTML/CSS',
        description: 'Complétez le code HTML et CSS d\'une petite application de restaurant.',
        category: 'css',
        pageUrl: '/projects/2',
        technologies: ['HTML5', 'CSS3', 'Flexbox', 'Grid'],
        tasks: [
            'Styliser le menu du restaurant',
            'Ajouter des animations hover sur les plats',
            'Créer un panier interactif (frontend uniquement)',
            'Rendre la page responsive'
        ],
        is_completed: false,  // ✅ ADD THIS
    },
    {
        id: '3',
        title: 'Fonctions JavaScript - 3 Exercices',
        description: 'Implémentez 3 fonctions JavaScript essentielles.',
        category: 'javascript',
        pageUrl: '/projects/3',
        technologies: ['JavaScript', 'ES6'],
        tasks: [
            'Fonction isPrime(n) : vérifier si un nombre est premier',
            'Fonction validateEmail(email) : valider un format d\'email avec regex',
            'Fonction formatString(str, style) : formater une chaîne',
            'Écrire des tests unitaires pour chaque fonction'
        ],
        is_completed: false,  // ✅ ADD THIS
    },
];