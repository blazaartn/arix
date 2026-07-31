'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    X, Send, Loader2, BookOpen, AlertCircle, CheckCircle, 
    Award, Upload, Trash2, Code, ChevronRight, ChevronLeft,
    FileText, Image as ImageIcon, FileCode, Sparkles, AlertTriangle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface QuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onQuestionCreated: () => void;
}

const LANGUAGES = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'python', label: 'Python' },
    { value: 'text', label: 'Texte simple' },
];

// ✅ Code limits
const MAX_CODE_CHARS = 5000;
const MAX_CODE_LINES = 150;

export function QuestionModal({ isOpen, onClose, onQuestionCreated }: QuestionModalProps) {
    const { data: session } = useSession();
    
    // Step state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    
    // Form data
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [codeContent, setCodeContent] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [codeError, setCodeError] = useState<string | null>(null);
    
    // Image state
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const codeTextareaRef = useRef<HTMLTextAreaElement>(null);

    // ✅ Calculate code stats
    const codeLines = codeContent.split('\n').length;
    const codeChars = codeContent.length;
    const isCodeValid = codeChars <= MAX_CODE_CHARS && codeLines <= MAX_CODE_LINES;
    const isCodeNearLimit = codeChars > MAX_CODE_CHARS * 0.8 || codeLines > MAX_CODE_LINES * 0.8;

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    // Focus code editor when shown
    useEffect(() => {
        if (showCodeEditor && codeTextareaRef.current) {
            codeTextareaRef.current.focus();
        }
    }, [showCodeEditor]);

    const resetForm = () => {
        setTitle('');
        setContent('');
        setSubjectName('');
        setCodeContent('');
        setCodeLanguage('javascript');
        setShowCodeEditor(false);
        setImages([]);
        setImagePreviews([]);
        setError('');
        setSuccess(false);
        setUploadingImages(false);
        setCurrentStep(1);
        setCodeError(null);
    };

    // Navigation
    const goToNextStep = () => {
        if (currentStep === 1 && !title.trim()) {
            setError('Veuillez entrer un titre');
            return;
        }
        if (currentStep === 1 && !subjectName.trim()) {
            setError('Veuillez indiquer la matière');
            return;
        }
        if (currentStep === 2 && !content.trim()) {
            setError('Veuillez décrire votre question');
            return;
        }
        setError('');
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        setError('');
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // ✅ Validate code before proceeding
    const validateCode = (): boolean => {
        if (!codeContent.trim()) {
            setCodeError(null);
            return true;
        }

        if (codeChars > MAX_CODE_CHARS) {
            setCodeError(`Le code dépasse ${MAX_CODE_CHARS} caractères (${codeChars})`);
            return false;
        }

        if (codeLines > MAX_CODE_LINES) {
            setCodeError(`Le code dépasse ${MAX_CODE_LINES} lignes (${codeLines})`);
            return false;
        }

        setCodeError(null);
        return true;
    };

    // ✅ Handle code content change with validation
    const handleCodeChange = (value: string) => {
        setCodeContent(value);
        
        // Auto-validate on change
        const chars = value.length;
        const lines = value.split('\n').length;
        
        if (chars > MAX_CODE_CHARS) {
            setCodeError(`⚠️ Dépasse ${MAX_CODE_CHARS} caractères (${chars})`);
        } else if (lines > MAX_CODE_LINES) {
            setCodeError(`⚠️ Dépasse ${MAX_CODE_LINES} lignes (${lines})`);
        } else {
            setCodeError(null);
        }
    };

    // ✅ Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 5) {
            setError('Maximum 5 images autorisées');
            return;
        }
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== files.length) {
            setError('Seules les images sont autorisées');
            return;
        }
        
        const maxSize = 10 * 1024 * 1024;
        const oversized = imageFiles.filter(file => file.size > maxSize);
        if (oversized.length > 0) {
            setError(`Fichiers trop volumineux (max 10MB): ${oversized.map(f => f.name).join(', ')}`);
            return;
        }

        setImages([...images, ...imageFiles]);
        const previews = imageFiles.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
        setError('');
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    // ✅ Submit
    const handleSubmit = async () => {
        // ✅ Validate code before submission
        if (!validateCode()) {
            setError(codeError || 'Code invalide');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let uploadedImageIds: string[] = [];
            
            if (images.length > 0) {
                setUploadingImages(true);
                const formData = new FormData();
                images.forEach(img => formData.append('images', img));
                
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                
                if (uploadData.success && uploadData.images) {
                    uploadedImageIds = uploadData.images.map((img: any) => img.id);
                } else {
                    setError(uploadData.error || 'Erreur lors de l\'upload des images');
                    setLoading(false);
                    setUploadingImages(false);
                    return;
                }
                setUploadingImages(false);
            }

            const payload: any = {
                title: title.trim(),
                content: content.trim(),
                subjectName: subjectName.trim(),
                imageIds: uploadedImageIds
            };

            // ✅ Only include code if valid and within limits
            if (codeContent.trim() && isCodeValid) {
                payload.codeContent = codeContent.trim();
                payload.codeLanguage = codeLanguage;
            }

            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (data.success) {
                setSuccess(true);
                onQuestionCreated();
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                }, 1500);
            } else {
                setError(data.error || 'Erreur lors de la publication');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError(err instanceof Error ? err.message : 'Erreur lors de la publication');
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    // Step indicator
    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            step === currentStep 
                                ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30' 
                                : step < currentStep 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                        {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                        <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    if (!isOpen) return null;

    // If not logged in, show login prompt
    if (!session) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Connectez-vous pour poser une question
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Rejoignez la communauté Bac Plus pour poser des questions.
                        </p>
                        <button
                            onClick={onClose}
                            className="block w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
                        >
                            Se connecter
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Send className="w-5 h-5 text-orange-500" />
                        Poser une question
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Step Indicator */}
                    <StepIndicator />

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700 mb-4">
                            <CheckCircle className="w-5 h-5" />
                            <span>Question publiée avec succès ! +50 XP</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 mb-4">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* ========== STEP 1: TITLE ========== */}
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FileText className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Quel est le sujet de votre question ?</h3>
                                <p className="text-sm text-gray-400">Donnez un titre clair et la matière concernée</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Résumez votre question en une phrase..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                    maxLength={200}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') goToNextStep();
                                    }}
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/200</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Matière <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text"
                                        value={subjectName}
                                        onChange={(e) => setSubjectName(e.target.value)}
                                        placeholder="Ex: Mathématiques, Physique, SVT..."
                                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                        maxLength={100}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1 text-right">{subjectName.length}/100</p>
                            </div>
                        </div>
                    )}

                    {/* ========== STEP 2: DESCRIPTION ========== */}
                    {currentStep === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FileText className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Détaillez votre question</h3>
                                <p className="text-sm text-gray-400">Expliquez clairement ce que vous voulez savoir</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Décrivez votre problème, ce que vous avez essayé, et ce que vous attendez comme réponse..."
                                    rows={6}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                                <p>💡 <span className="font-medium">Conseil :</span> Plus votre description est détaillée, plus vous aurez de réponses utiles.</p>
                            </div>
                        </div>
                    )}

                    {/* ========== STEP 3: ATTACHMENTS ========== */}
                    {currentStep === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Upload className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Ajoutez des pièces jointes</h3>
                                <p className="text-sm text-gray-400">Images et code pour illustrer votre question</p>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Images (optionnel - max 5)
                                </label>
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer ${
                                        uploadingImages ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-orange-500'
                                    }`}
                                    onClick={() => !uploadingImages && fileInputRef.current?.click()}
                                >
                                    {uploadingImages ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                                            <p className="text-sm text-gray-500">Téléchargement des images...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Cliquez pour ajouter des images</p>
                                            <p className="text-xs text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
                                        </>
                                    )}
                                    <input 
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploadingImages}
                                    />
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => !uploadingImages && removeImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                                                    disabled={uploadingImages}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Code Editor Toggle */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                                        showCodeEditor 
                                            ? 'border-orange-500 bg-orange-50 text-orange-600' 
                                            : 'border-gray-300 hover:border-gray-400 text-gray-600'
                                    }`}
                                >
                                    <Code className="w-4 h-4" />
                                    {showCodeEditor ? 'Masquer le code' : 'Ajouter du code'}
                                </button>
                            </div>

                            {/* Code Editor */}
                            {showCodeEditor && (
                                <div className="space-y-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-gray-700">Langage:</label>
                                            <select
                                                value={codeLanguage}
                                                onChange={(e) => setCodeLanguage(e.target.value)}
                                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                            >
                                                {LANGUAGES.map((lang) => (
                                                    <option key={lang.value} value={lang.value}>
                                                        {lang.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* ✅ Code stats counter */}
                                        <div className={`text-xs font-medium ${!isCodeValid && codeContent ? 'text-red-500' : isCodeNearLimit && codeContent ? 'text-yellow-500' : 'text-gray-400'}`}>
                                            {codeChars} caractères • {codeLines} lignes
                                            {!isCodeValid && codeContent && (
                                                <span className="ml-1 text-red-500">⚠️</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* ✅ Code error/warning message */}
                                    {codeError && (
                                        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                            <span>{codeError}</span>
                                        </div>
                                    )}
                                    
                                    {isCodeNearLimit && isCodeValid && codeContent && (
                                        <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span>Proche de la limite maximum</span>
                                        </div>
                                    )}

                                    <textarea
                                        ref={codeTextareaRef}
                                        value={codeContent}
                                        onChange={(e) => handleCodeChange(e.target.value)}
                                        placeholder={`Écrivez votre code ${codeLanguage} ici... (max ${MAX_CODE_CHARS} caractères, ${MAX_CODE_LINES} lignes)`}
                                        rows={6}
                                        className={`w-full px-3 py-2.5 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white ${
                                            !isCodeValid && codeContent ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        spellCheck={false}
                                    />
                                    
                                    {/* ✅ Limit info */}
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Max {MAX_CODE_CHARS} caractères</span>
                                        <span>Max {MAX_CODE_LINES} lignes</span>
                                    </div>
                                </div>
                            )}

                            {/* XP Info */}
                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-center gap-3">
                                <Award className="w-5 h-5 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">+50 XP</p>
                                    <p className="text-xs text-gray-500">Gagnez 50 XP en posant une question</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========== NAVIGATION BUTTONS ========== */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={goToPrevStep}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Retour
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={goToNextStep}
                                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition shadow-lg shadow-orange-500/25"
                            >
                                Suivant
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || uploadingImages || (!!codeContent && !isCodeValid)}
                                className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    (!!codeContent && !isCodeValid) ? 'bg-red-500 from-red-500 to-red-600 shadow-red-500/25' : ''
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Publication...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        {!!codeContent && !isCodeValid ? 'Code trop long' : 'Publier (+50 XP)'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Step counter */}
                    <p className="text-center text-xs text-gray-400 mt-3">
                        Étape {currentStep} sur {totalSteps}
                    </p>
                </div>
            </div>
        </div>
    );
}