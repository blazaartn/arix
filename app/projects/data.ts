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
    downloadUrl: string;
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
        pageUrl: 'https://alphaa-pixel.github.io/emploi-html/',
        downloadUrl: 'https://github.com/alphaa-pixel/emploi-html/archive/refs/heads/main.zip',
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
        title: 'Formulaire d\'inscription - HTML',
        description: 'Créez un formulaire d\'inscription complet avec validation HTML.',
        category: 'html',
        pageUrl: 'https://alphaa-pixel.github.io/formulaire/',
        downloadUrl: 'https://github.com/alphaa-pixel/formulaire/archive/refs/heads/main.zip',
        technologies: ['HTML5', 'CSS3'],
        tasks: [
            'Compléter le formulaire avec les bons attributs (action, method, type)',
            'Ajouter un champ "date de naissance" avec type="date"',
            'Ajouter une case à cocher "J\'accepte les conditions"',
            'Tester la validation HTML5'
        ],
        is_completed: false,
    },
    {
        id: '3',
        title: 'Page de présentation - Médias',
        description: 'Créez une galerie multimédia avec images, vidéos et audios.',
        category: 'html',
        pageUrl: 'https://alphaa-pixel.github.io/presentation/',
        downloadUrl: 'https://github.com/alphaa-pixel/presentation/archive/refs/heads/main.zip',
        technologies: ['HTML5', 'CSS3'],
        tasks: [
            'Compléter les attributs src, alt, controls des médias',
            'Utiliser vos propres fichiers médias',
            'Ajouter plusieurs formats pour la vidéo (mp4, webm)',
            'Ajouter un lien qui s\'ouvre dans un nouvel onglet'
        ],
        is_completed: false,
    },
    {
        id: '4',
        title: 'Plan de repas - Tableau',
        description: 'Créez un plan de repas hebdomadaire avec un tableau HTML.',
        category: 'html',
        pageUrl: 'https://alphaa-pixel.github.io/repas/',
        downloadUrl: 'https://github.com/alphaa-pixel/repas/archive/refs/heads/main.zip',
        technologies: ['HTML5', 'CSS3'],
        tasks: [
            'Compléter le tableau avec vos repas',
            'Ajouter une ligne pour le week-end (samedi et dimanche)',
            'Utiliser colspan pour fusionner les cellules',
            'Ajouter une colonne "Calories"'
        ],
        is_completed: false,
    },
    {
        id: '5',
        title: 'CV en ligne - Structure sémantique',
        description: 'Créez votre CV en utilisant les balises sémantiques HTML5.',
        category: 'html',
        pageUrl: 'https://alphaa-pixel.github.io/cv/',
        downloadUrl: 'https://github.com/alphaa-pixel/cv/archive/refs/heads/main.zip',
        technologies: ['HTML5', 'CSS3'],
        tasks: [
            'Compléter toutes les sections (header, nav, main, section, aside, footer)',
            'Ajouter une photo de profil avec <img>',
            'Ajouter une liste de compétences avec <ol>',
            'Ajouter un lien vers votre GitHub ou LinkedIn'
        ],
        is_completed: false,
    },
];