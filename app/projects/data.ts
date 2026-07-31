/**
 * 🤖 AI ASSISTANT - COMPLETE INSTRUCTIONS (بالعربية)
 * ====================================================
 * 
 * مرحبا أيها المساعد الذكي! 👋 أنت تساعد في إدارة بيانات المشاريع التعليمية.
 * 
 * مهمتك:
 * 1. اقرأ هذا الملف بالكامل
 * 2. افهم هيكل البيانات (Project)
 * 3. عندما يطلب المستخدم إضافة مشاريع جديدة، أضفها إلى مصفوفة PROJECTS
 * 4. أعد الملف الكامل المحدث
 * 
 * قواعد البيانات:
 * ===============
 * 
 * حقول إجبارية (يجب توفرها):
 * - id: أنشئ رقم فريد (تلقائي +1 من آخر ID)
 * - title: إجباري - عنوان واضح للمشروع
 * - description: إجباري - وصف مختصر للمشروع
 * - category: إجباري - html أو css أو javascript أو php أو sql أو python أو fullstack
 * - pageUrl: إجباري - إذا نساه المستخدم، أسأله عنه
 * 
 * حقول اختيارية (يمكن تركها فارغة):
 * - technologies: اختياري → إذا غابت، استخدم قائمة افتراضية حسب الفئة
 * - tasks: اختياري → إذا غابت، أنشئ 3-4 مهام أساسية
 * - is_completed: دائماً false للعناصر الجديدة
 * 
 * التقنيات الافتراضية حسب الفئة:
 * ================================
 * - html: ['HTML5', 'CSS3']
 * - css: ['HTML5', 'CSS3', 'Flexbox', 'Grid']
 * - javascript: ['JavaScript', 'ES6']
 * - php: ['PHP', 'MySQL']
 * - sql: ['SQL', 'PostgreSQL']
 * - python: ['Python', 'Flask']
 * - fullstack: ['React', 'Node.js', 'PostgreSQL']
 * 
 * قواعد التحقق:
 * =============
 * 1. ✅ title: إجباري ← إذا غاب، اسأل المستخدم
 * 2. ✅ description: إجباري ← إذا غاب، اسأل المستخدم
 * 3. ✅ pageUrl: إجباري ← إذا غاب، اسأل المستخدم
 * 4. ✅ category: إجباري ← إذا غاب، اسأل المستخدم
 * 5. ⚠️ technologies: اختياري ← استخدم القائمة الافتراضية حسب الفئة
 * 6. ⚠️ tasks: اختياري ← أنشئ مهام افتراضية
 * 7. ⚠️ is_completed: دائماً false
 * 
 * أنشئ المهام تلقائياً حسب الفئة:
 * ================================
 * - html: "Créer la structure HTML", "Ajouter du CSS", "Rendre responsive"
 * - css: "Styliser les composants", "Créer des animations", "Responsive design"
 * - javascript: "Créer les fonctions", "Tester le code", "Documenter le code"
 * - php: "Configurer la base de données", "Créer les routes", "Sécuriser l'application"
 * - sql: "Créer les tables", "Écrire les requêtes", "Optimiser les index"
 * - python: "Créer les routes", "Gérer les données", "Tester l'API"
 * - fullstack: "Configurer le backend", "Créer le frontend", "Déployer l'application"
 * 
 * طريقة الرد:
 * ===========
 * 
 * 🔴 تكلم بالعربية الفصحى دائماً
 * 🔴 صحح الأخطاء الإملائية في كلام المستخدم
 * 🔴 رد بأقل قدر من النص
 * 🔴 محتوى الملف بالفرنسية (الكود)
 * 🔴 فقط الكلام مع المستخدم بالعربية
 * 
 * أمثلة للردود:
 * =============
 * 
 * المستخدم: "ضيف مشروع html اسمه "صفحة شخصية" رابط: x.com"
 * أنت: "تمت الإضافة ✅" + الملف الكامل
 * 
 * المستخدم: "ضيف مشروع JavaScript" (نسي الرابط)
 * أنت: "الرابط؟ 🔗"
 * 
 * المستخدم: "ضيف مشروع" (نسي كل شيء)
 * أنت: "أرسل: العنوان، الوصف، الفئة، والرابط"
 * 
 * المستخدم: "ضيف 3 مشاريع: 1) HTML..., 2) CSS..., 3) JavaScript..."
 * أنت: "تمت إضافة 3 مشاريع ✅" + الملف الكامل
 * 
 * نصائح للرد:
 * ===========
 * - استخدم إيموجي ✅ للإضافة الناجحة
 * - استخدم ❌ للأخطاء
 * - استخدم 🔗 لطلب الرابط
 * - استخدم 📝 لطلب المعلومات المفقودة
 * - ردود قصيرة ومباشرة
 * 
 * جاهز؟ لنبدأ! هذا هو الملف:
 * =============================
 */

export interface Project {
    id: string;
    title: string;
    description: string;
    category: 'html' | 'css' | 'javascript' | 'php' | 'sql' | 'python' | 'fullstack';
    pageUrl: string;
    technologies: string[];
    tasks: string[];
    is_completed: boolean;
}

// Category Configurations
export const CATEGORY_CONFIG = {
    html: {
        label: 'HTML',
        icon: 'Layout',
        color: 'bg-orange-100 text-orange-600 border-orange-200',
        defaultTechs: ['HTML5', 'CSS3'],
        defaultTasks: [
            'Créer la structure HTML de la page',
            'Ajouter du CSS pour le style',
            'Rendre la page responsive',
            'Tester sur différents navigateurs'
        ]
    },
    css: {
        label: 'CSS',
        icon: 'Palette',
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        defaultTechs: ['HTML5', 'CSS3', 'Flexbox', 'Grid'],
        defaultTasks: [
            'Styliser les composants principaux',
            'Créer des animations et transitions',
            'Rendre le design responsive',
            'Optimiser les performances CSS'
        ]
    },
    javascript: {
        label: 'JavaScript',
        icon: 'FileCode',
        color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
        defaultTechs: ['JavaScript', 'ES6+'],
        defaultTasks: [
            'Créer les fonctions principales',
            'Tester le code avec des cas limites',
            'Documenter le code',
            'Optimiser les performances'
        ]
    },
    php: {
        label: 'PHP',
        icon: 'Server',
        color: 'bg-purple-100 text-purple-600 border-purple-200',
        defaultTechs: ['PHP', 'MySQL', 'Composer'],
        defaultTasks: [
            'Configurer la base de données',
            'Créer les routes de l\'API',
            'Sécuriser l\'application',
            'Tester les endpoints'
        ]
    },
    sql: {
        label: 'SQL',
        icon: 'Database',
        color: 'bg-green-100 text-green-600 border-green-200',
        defaultTechs: ['SQL', 'PostgreSQL'],
        defaultTasks: [
            'Créer le schéma de la base de données',
            'Écrire les requêtes optimisées',
            'Créer les index nécessaires',
            'Tester les requêtes'
        ]
    },
    python: {
        label: 'Python',
        icon: 'Terminal',
        color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
        defaultTechs: ['Python', 'Flask/Django'],
        defaultTasks: [
            'Créer les routes de l\'API',
            'Gérer les données avec ORM',
            'Tester l\'API avec pytest',
            'Documenter le code'
        ]
    },
    fullstack: {
        label: 'Full Stack',
        icon: 'Globe',
        color: 'bg-pink-100 text-pink-600 border-pink-200',
        defaultTechs: ['React', 'Node.js', 'PostgreSQL'],
        defaultTasks: [
            'Configurer le backend',
            'Créer le frontend',
            'Connecter API et frontend',
            'Déployer l\'application'
        ]
    }
};

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
        is_completed: false,
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
        is_completed: false,
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
        is_completed: false,
    },
    {
        id: '4',
        title: 'API REST - Gestion de Tâches',
        description: 'Créez une API REST complète pour gérer des tâches avec PHP.',
        category: 'php',
        pageUrl: '/projects/4',
        technologies: ['PHP', 'MySQL', 'Composer'],
        tasks: [
            'Configurer la base de données',
            'Créer les routes CRUD',
            'Sécuriser l\'API avec JWT',
            'Tester les endpoints avec Postman'
        ],
        is_completed: false,
    },
    {
        id: '5',
        title: 'Base de Données - Gestion d\'École',
        description: 'Concevez une base de données pour une école avec SQL.',
        category: 'sql',
        pageUrl: '/projects/5',
        technologies: ['SQL', 'PostgreSQL'],
        tasks: [
            'Créer le schéma (étudiants, professeurs, cours)',
            'Écrire des requêtes complexes (JOIN, GROUP BY)',
            'Créer des vues et index',
            'Optimiser les performances des requêtes'
        ],
        is_completed: false,
    },
    {
        id: '6',
        title: 'Application Web - Suivi des Étudiants',
        description: 'Créez une application web pour suivre les étudiants avec Python.',
        category: 'python',
        pageUrl: '/projects/6',
        technologies: ['Python', 'Flask', 'SQLite'],
        tasks: [
            'Créer les routes CRUD pour les étudiants',
            'Gérer les données avec SQLAlchemy',
            'Créer un frontend avec Jinja2',
            'Tester l\'application avec pytest'
        ],
        is_completed: false,
    },
    {
        id: '7',
        title: 'Application de Questions/Réponses',
        description: 'Créez une application complète de questions/réponses avec React et Node.js.',
        category: 'fullstack',
        pageUrl: '/projects/7',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
        tasks: [
            'Configurer le backend avec Express et PostgreSQL',
            'Créer le frontend avec React et Tailwind',
            'Connecter API et frontend',
            'Ajouter des fonctionnalités (likes, commentaires)'
        ],
        is_completed: false,
    },
];