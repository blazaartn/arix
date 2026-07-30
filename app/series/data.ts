/**
 * 🤖 AI ASSISTANT - COMPLETE INSTRUCTIONS (بالعربية)
 * ====================================================
 * 
 * مرحبا أيها المساعد الذكي! 👋 أنت تساعد في إدارة بيانات المحتوى التعليمي.
 * 
 * مهمتك:
 * 1. اقرأ هذا الملف بالكامل
 * 2. افهم هيكل البيانات (SeriesItem)
 * 3. عندما يطلب المستخدم إضافة عناصر جديدة، أضفها إلى مصفوفة MOCK_SERIES
 * 4. أعد الملف الكامل المحدث
 * 
 * قواعد البيانات:
 * ===============
 * 
 * حقول إجبارية (يجب توفرها):
 * - id: أنشئ رقم فريد (تلقائي +1 من آخر ID)
 * - title: إجباري - عنوان واضح
 * - subject: إجباري - math أو phy أو sti أو algorithme
 * - type: إجباري - exam أو series أو exercice أو correction
 * - pageUrl: إجباري - إذا نساه المستخدم، أسأله عنه
 * 
 * حقول اختيارية (يمكن تركها فارغة):
 * - year: اختياري → إذا غاب، استخدم السنة الحالية "2025"
 * - session: اختياري → فقط إذا ذكرها المستخدم (principale/controle/rattrapage)
 * - description: اختياري → إذا غابت، أنشئها من العنوان
 * - is_completed: دائماً false للعناصر الجديدة
 * 
 * قواعد التحقق:
 * =============
 * 1. ✅ title: إجباري ← إذا غاب، اسأل المستخدم
 * 2. ✅ pageUrl: إجباري ← إذا غاب، اسأل المستخدم
 * 3. ✅ subject: إجباري ← إذا غاب، اسأل المستخدم
 * 4. ✅ type: إجباري ← إذا غاب، اسأل المستخدم
 * 5. ⚠️ year: اختياري ← إذا لم يذكر، استخدم "2025"
 * 6. ⚠️ session: اختياري ← فقط إذا ذكرها المستخدم
 * 7. ⚠️ description: اختياري ← أنشئها من العنوان
 * 8. ⚠️ is_completed: دائماً false
 * 
 * أنشئ الوصف تلقائياً من العنوان:
 * =================================
 * - "Examen Math 2025" → "Examen complet de Mathématiques"
 * - "Série Fonctions" → "Exercices progressifs sur les fonctions"
 * - "Exercices Dérivées" → "Exercices corrigés sur les dérivées"
 * - "Correction STI" → "Correction détaillée des exercices STI"
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
 * المستخدم: "ضيف ماث اكزام 2025 برينسيبال URL: x.com"
 * أنت: "تمت الإضافة ✅" + الملف الكامل
 * 
 * المستخدم: "ضيف فيزيك سيريز" (نسي الرابط)
 * أنت: "الرابط؟ 🔗"
 * 
 * المستخدم: "ضيف اكزام" (نسي كل شيء)
 * أنت: "أرسل: العنوان، المادة، النوع، والرابط"
 * 
 * المستخدم: "ضيف 3 عناصر: 1) ماث اكزام..., 2) فيزيك سيريز..., 3) اس تي اي كوريكسيون..."
 * أنت: "تمت إضافة 3 عناصر ✅" + الملف الكامل
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

export interface SeriesItem {
    id: string;
    title: string;
    subject: 'math' | 'phy' | 'sti' | 'algorithme';
    type: 'exam' | 'series' | 'exercice' | 'correction';
    year: string;
    session?: 'principale' | 'controle' | 'rattrapage';
    pageUrl: string;
    is_completed: boolean;
    description?: string;
}

export const SUBJECT_CONFIG = {
    math: { 
        label: 'Mathématiques', 
        icon: 'GraduationCap',
        color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    phy: { 
        label: 'Physique', 
        icon: 'Sparkles',
        color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    sti: { 
        label: 'STI', 
        icon: 'TrendingUp',
        color: 'bg-green-100 text-green-600 border-green-200'
    },
    algorithme: { 
        label: 'Algorithme', 
        icon: 'FileText',
        color: 'bg-orange-100 text-orange-600 border-orange-200'
    },
} as const;

export const TYPE_CONFIG = {
    exam: { label: 'Examen', color: 'bg-red-100 text-red-600 border-red-200' },
    series: { label: 'Série', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    exercice: { label: 'Exercice', color: 'bg-green-100 text-green-600 border-green-200' },
    correction: { label: 'Correction', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
} as const;

export const MOCK_SERIES: SeriesItem[] = [
    {
        id: '1',
        title: 'Examen Math - Bac Principale 2025',
        subject: 'math',
        type: 'exam',
        year: '2025',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2025/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '2',
        title: 'Série - Fonctions Logarithmes',
        subject: 'math',
        type: 'series',
        year: '2025',
        pageUrl: '/series/2',
        is_completed: false,
        description: '20 exercices progressifs sur les fonctions logarithmes.'
    },
    {
        id: '3',
        title: 'Exercices - Dérivées et Applications',
        subject: 'math',
        type: 'exercice',
        year: '2024',
        pageUrl: '/series/3',
        is_completed: false,
        description: '15 exercices corrigés sur les dérivées.'
    },
     {
        id: '4',
        title: 'Examen Math - Bac Principale 2024',
        subject: 'math',
        type: 'exam',
        year: '2024',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2024/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    // ✅ Add more series here easily
];