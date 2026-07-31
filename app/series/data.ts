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
    // ============ MATH EXAMS 2015-2025 ============
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
        title: 'Examen Math - Bac Controle 2025',
        subject: 'math',
        type: 'exam',
        year: '2025',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2025/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '3',
        title: 'Examen Math - Bac Principale 2024',
        subject: 'math',
        type: 'exam',
        year: '2024',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2024/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '4',
        title: 'Examen Math - Bac Controle 2024',
        subject: 'math',
        type: 'exam',
        year: '2024',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2024/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '5',
        title: 'Examen Math - Bac Principale 2023',
        subject: 'math',
        type: 'exam',
        year: '2023',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2023/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '6',
        title: 'Examen Math - Bac Controle 2023',
        subject: 'math',
        type: 'exam',
        year: '2023',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2023/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '7',
        title: 'Examen Math - Bac Principale 2022',
        subject: 'math',
        type: 'exam',
        year: '2022',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2022/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '8',
        title: 'Examen Math - Bac Controle 2022',
        subject: 'math',
        type: 'exam',
        year: '2022',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2022/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '9',
        title: 'Examen Math - Bac Principale 2021',
        subject: 'math',
        type: 'exam',
        year: '2021',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2021/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '10',
        title: 'Examen Math - Bac Controle 2021',
        subject: 'math',
        type: 'exam',
        year: '2021',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2021/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '11',
        title: 'Examen Math - Bac Principale 2020',
        subject: 'math',
        type: 'exam',
        year: '2020',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2020/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '12',
        title: 'Examen Math - Bac Controle 2020',
        subject: 'math',
        type: 'exam',
        year: '2020',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2020/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '13',
        title: 'Examen Math - Bac Principale 2019',
        subject: 'math',
        type: 'exam',
        year: '2019',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2019/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '14',
        title: 'Examen Math - Bac Controle 2019',
        subject: 'math',
        type: 'exam',
        year: '2019',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2019/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '15',
        title: 'Examen Math - Bac Principale 2018',
        subject: 'math',
        type: 'exam',
        year: '2018',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2018/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '16',
        title: 'Examen Math - Bac Controle 2018',
        subject: 'math',
        type: 'exam',
        year: '2018',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2018/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '17',
        title: 'Examen Math - Bac Principale 2017',
        subject: 'math',
        type: 'exam',
        year: '2017',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2017/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '18',
        title: 'Examen Math - Bac Controle 2017',
        subject: 'math',
        type: 'exam',
        year: '2017',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2017/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '19',
        title: 'Examen Math - Bac Principale 2016',
        subject: 'math',
        type: 'exam',
        year: '2016',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2016/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '20',
        title: 'Examen Math - Bac Controle 2016',
        subject: 'math',
        type: 'exam',
        year: '2016',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2016/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '21',
        title: 'Examen Math - Bac Principale 2015',
        subject: 'math',
        type: 'exam',
        year: '2015',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2015/principale/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },
    {
        id: '22',
        title: 'Examen Math - Bac Controle 2015',
        subject: 'math',
        type: 'exam',
        year: '2015',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2015/controle/informatique/math.pdf',
        is_completed: false,
        description: 'Examen complet de Mathématiques avec corrigé détaillé.'
    },

    // ============ STI EXAMS 2015-2025 ============
    {
        id: '23',
        title: 'Examen STI - Bac Principale 2025',
        subject: 'sti',
        type: 'exam',
        year: '2025',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2025/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '24',
        title: 'Examen STI - Bac Controle 2025',
        subject: 'sti',
        type: 'exam',
        year: '2025',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2025/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '25',
        title: 'Examen STI - Bac Principale 2024',
        subject: 'sti',
        type: 'exam',
        year: '2024',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2024/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '26',
        title: 'Examen STI - Bac Controle 2024',
        subject: 'sti',
        type: 'exam',
        year: '2024',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2024/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '27',
        title: 'Examen STI - Bac Principale 2023',
        subject: 'sti',
        type: 'exam',
        year: '2023',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2023/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '28',
        title: 'Examen STI - Bac Controle 2023',
        subject: 'sti',
        type: 'exam',
        year: '2023',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2023/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '29',
        title: 'Examen STI - Bac Principale 2022',
        subject: 'sti',
        type: 'exam',
        year: '2022',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2022/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '30',
        title: 'Examen STI - Bac Controle 2022',
        subject: 'sti',
        type: 'exam',
        year: '2022',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2022/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '31',
        title: 'Examen STI - Bac Principale 2021',
        subject: 'sti',
        type: 'exam',
        year: '2021',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2021/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '32',
        title: 'Examen STI - Bac Controle 2021',
        subject: 'sti',
        type: 'exam',
        year: '2021',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2021/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '33',
        title: 'Examen STI - Bac Principale 2020',
        subject: 'sti',
        type: 'exam',
        year: '2020',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2020/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '34',
        title: 'Examen STI - Bac Controle 2020',
        subject: 'sti',
        type: 'exam',
        year: '2020',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2020/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '35',
        title: 'Examen STI - Bac Principale 2019',
        subject: 'sti',
        type: 'exam',
        year: '2019',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2019/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '36',
        title: 'Examen STI - Bac Controle 2019',
        subject: 'sti',
        type: 'exam',
        year: '2019',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2019/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '37',
        title: 'Examen STI - Bac Principale 2018',
        subject: 'sti',
        type: 'exam',
        year: '2018',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2018/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '38',
        title: 'Examen STI - Bac Controle 2018',
        subject: 'sti',
        type: 'exam',
        year: '2018',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2018/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '39',
        title: 'Examen STI - Bac Principale 2017',
        subject: 'sti',
        type: 'exam',
        year: '2017',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2017/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '40',
        title: 'Examen STI - Bac Controle 2017',
        subject: 'sti',
        type: 'exam',
        year: '2017',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2017/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '41',
        title: 'Examen STI - Bac Principale 2016',
        subject: 'sti',
        type: 'exam',
        year: '2016',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2016/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '42',
        title: 'Examen STI - Bac Controle 2016',
        subject: 'sti',
        type: 'exam',
        year: '2016',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2016/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '43',
        title: 'Examen STI - Bac Principale 2015',
        subject: 'sti',
        type: 'exam',
        year: '2015',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2015/principale/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },
    {
        id: '44',
        title: 'Examen STI - Bac Controle 2015',
        subject: 'sti',
        type: 'exam',
        year: '2015',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2015/controle/informatique/bd.pdf',
        is_completed: false,
        description: 'Examen complet de STI avec corrigé détaillé.'
    },

    // ============ ALGORITHME EXAMS 2015-2025 ============
    {
        id: '45',
        title: 'Examen Algorithme - Bac Principale 2025',
        subject: 'algorithme',
        type: 'exam',
        year: '2025',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2025/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '46',
        title: 'Examen Algorithme - Bac Controle 2025',
        subject: 'algorithme',
        type: 'exam',
        year: '2025',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2025/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '47',
        title: 'Examen Algorithme - Bac Principale 2024',
        subject: 'algorithme',
        type: 'exam',
        year: '2024',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2024/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '48',
        title: 'Examen Algorithme - Bac Controle 2024',
        subject: 'algorithme',
        type: 'exam',
        year: '2024',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2024/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '49',
        title: 'Examen Algorithme - Bac Principale 2023',
        subject: 'algorithme',
        type: 'exam',
        year: '2023',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2023/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '50',
        title: 'Examen Algorithme - Bac Controle 2023',
        subject: 'algorithme',
        type: 'exam',
        year: '2023',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2023/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '51',
        title: 'Examen Algorithme - Bac Principale 2022',
        subject: 'algorithme',
        type: 'exam',
        year: '2022',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2022/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '52',
        title: 'Examen Algorithme - Bac Controle 2022',
        subject: 'algorithme',
        type: 'exam',
        year: '2022',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2022/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '53',
        title: 'Examen Algorithme - Bac Principale 2021',
        subject: 'algorithme',
        type: 'exam',
        year: '2021',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2021/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '54',
        title: 'Examen Algorithme - Bac Controle 2021',
        subject: 'algorithme',
        type: 'exam',
        year: '2021',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2021/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '55',
        title: 'Examen Algorithme - Bac Principale 2020',
        subject: 'algorithme',
        type: 'exam',
        year: '2020',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2020/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '56',
        title: 'Examen Algorithme - Bac Controle 2020',
        subject: 'algorithme',
        type: 'exam',
        year: '2020',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2020/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '57',
        title: 'Examen Algorithme - Bac Principale 2019',
        subject: 'algorithme',
        type: 'exam',
        year: '2019',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2019/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '58',
        title: 'Examen Algorithme - Bac Controle 2019',
        subject: 'algorithme',
        type: 'exam',
        year: '2019',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2019/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '59',
        title: 'Examen Algorithme - Bac Principale 2018',
        subject: 'algorithme',
        type: 'exam',
        year: '2018',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2018/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '60',
        title: 'Examen Algorithme - Bac Controle 2018',
        subject: 'algorithme',
        type: 'exam',
        year: '2018',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2018/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '61',
        title: 'Examen Algorithme - Bac Principale 2017',
        subject: 'algorithme',
        type: 'exam',
        year: '2017',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2017/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '62',
        title: 'Examen Algorithme - Bac Controle 2017',
        subject: 'algorithme',
        type: 'exam',
        year: '2017',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2017/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '63',
        title: 'Examen Algorithme - Bac Principale 2016',
        subject: 'algorithme',
        type: 'exam',
        year: '2016',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2016/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '64',
        title: 'Examen Algorithme - Bac Controle 2016',
        subject: 'algorithme',
        type: 'exam',
        year: '2016',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2016/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '65',
        title: 'Examen Algorithme - Bac Principale 2015',
        subject: 'algorithme',
        type: 'exam',
        year: '2015',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2015/principale/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },
    {
        id: '66',
        title: 'Examen Algorithme - Bac Controle 2015',
        subject: 'algorithme',
        type: 'exam',
        year: '2015',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2015/controle/informatique/algorithme_nr.pdf',
        is_completed: false,
        description: 'Examen complet d\'Algorithme avec corrigé détaillé.'
    },

    // ============ PHYSIQUE EXAMS 2015-2025 ============
    {
        id: '67',
        title: 'Examen Physique - Bac Principale 2025',
        subject: 'phy',
        type: 'exam',
        year: '2025',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2025/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '68',
        title: 'Examen Physique - Bac Controle 2025',
        subject: 'phy',
        type: 'exam',
        year: '2025',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2025/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '69',
        title: 'Examen Physique - Bac Principale 2024',
        subject: 'phy',
        type: 'exam',
        year: '2024',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2024/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '70',
        title: 'Examen Physique - Bac Controle 2024',
        subject: 'phy',
        type: 'exam',
        year: '2024',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2024/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '71',
        title: 'Examen Physique - Bac Principale 2023',
        subject: 'phy',
        type: 'exam',
        year: '2023',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2023/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '72',
        title: 'Examen Physique - Bac Controle 2023',
        subject: 'phy',
        type: 'exam',
        year: '2023',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2023/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '73',
        title: 'Examen Physique - Bac Principale 2022',
        subject: 'phy',
        type: 'exam',
        year: '2022',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2022/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '74',
        title: 'Examen Physique - Bac Controle 2022',
        subject: 'phy',
        type: 'exam',
        year: '2022',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2022/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '75',
        title: 'Examen Physique - Bac Principale 2021',
        subject: 'phy',
        type: 'exam',
        year: '2021',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2021/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '76',
        title: 'Examen Physique - Bac Controle 2021',
        subject: 'phy',
        type: 'exam',
        year: '2021',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2021/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '77',
        title: 'Examen Physique - Bac Principale 2020',
        subject: 'phy',
        type: 'exam',
        year: '2020',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2020/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '78',
        title: 'Examen Physique - Bac Controle 2020',
        subject: 'phy',
        type: 'exam',
        year: '2020',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2020/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '79',
        title: 'Examen Physique - Bac Principale 2019',
        subject: 'phy',
        type: 'exam',
        year: '2019',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2019/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '80',
        title: 'Examen Physique - Bac Controle 2019',
        subject: 'phy',
        type: 'exam',
        year: '2019',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2019/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '81',
        title: 'Examen Physique - Bac Principale 2018',
        subject: 'phy',
        type: 'exam',
        year: '2018',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2018/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '82',
        title: 'Examen Physique - Bac Controle 2018',
        subject: 'phy',
        type: 'exam',
        year: '2018',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2018/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '83',
        title: 'Examen Physique - Bac Principale 2017',
        subject: 'phy',
        type: 'exam',
        year: '2017',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2017/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '84',
        title: 'Examen Physique - Bac Controle 2017',
        subject: 'phy',
        type: 'exam',
        year: '2017',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2017/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '85',
        title: 'Examen Physique - Bac Principale 2016',
        subject: 'phy',
        type: 'exam',
        year: '2016',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2016/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '86',
        title: 'Examen Physique - Bac Controle 2016',
        subject: 'phy',
        type: 'exam',
        year: '2016',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2016/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '87',
        title: 'Examen Physique - Bac Principale 2015',
        subject: 'phy',
        type: 'exam',
        year: '2015',
        session: 'principale',
        pageUrl: 'http://www.bacweb.tn/bac/2015/principale/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
    {
        id: '88',
        title: 'Examen Physique - Bac Controle 2015',
        subject: 'phy',
        type: 'exam',
        year: '2015',
        session: 'controle',
        pageUrl: 'http://www.bacweb.tn/bac/2015/controle/informatique/physique.pdf',
        is_completed: false,
        description: 'Examen complet de Physique avec corrigé détaillé.'
    },
];