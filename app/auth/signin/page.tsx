'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { 
    BookOpen, Sparkles, GraduationCap, Users,
    MessageCircle, Award, ChevronRight, AlertCircle,
    Loader2, CheckCircle
} from 'lucide-react';

// Separate component that uses useSearchParams
function SignInContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    useEffect(() => {
        if (error) {
            const messages: Record<string, string> = {
                'OAuthSignin': 'Erreur lors de la connexion avec Google. Veuillez réessayer.',
                'OAuthCallback': 'Erreur lors du callback Google. Veuillez réessayer.',
                'OAuthCreateAccount': 'Impossible de créer le compte. Veuillez réessayer.',
                'EmailCreateAccount': 'Impossible de créer le compte email. Veuillez réessayer.',
                'Callback': 'Erreur lors du callback. Veuillez réessayer.',
                'OAuthAccountNotLinked': 'Cet email est déjà lié à un autre compte.',
                'AccessDenied': 'Accès refusé. Veuillez contacter le support.',
                'default': 'Erreur inattendue. Veuillez réessayer.'
            };
            setErrorMessage(messages[error] || messages.default);
        }
    }, [error]);

    const handleSignIn = async () => {
        setLoading(true);
        await signIn('google', { callbackUrl });
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <p className="text-sm text-gray-400">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="text-gray-900">bac</span>
                        <span className="text-orange-500">plus</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Plateforme d'entraide pour le Bac Tunisien
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-orange-50 rounded-xl p-3 text-center">
                            <MessageCircle className="w-5 h-5 text-orange-500 mx-auto" />
                            <p className="text-xs text-gray-600 mt-1 font-medium">Questions</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <Award className="w-5 h-5 text-blue-500 mx-auto" />
                            <p className="text-xs text-gray-600 mt-1 font-medium">XP</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                            <Users className="w-5 h-5 text-green-500 mx-auto" />
                            <p className="text-xs text-gray-600 mt-1 font-medium">Entraide</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                        Bienvenue sur bacplus
                    </h2>
                    <p className="text-gray-400 text-sm text-center mb-6">
                        Connectez-vous pour rejoindre la communauté
                    </p>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-md disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="font-medium">Continuer avec Google</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-400">ou</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="space-y-2.5 text-sm text-gray-600">
                        <p className="font-medium text-gray-700 text-center">Rejoignez la communauté :</p>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Posez des questions sur toutes les matières du Bac</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Recevez de l'aide de la communauté</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Gagnez des points XP et progressez</span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité
                </p>
            </div>
        </div>
    );
}

// Main component with Suspense
export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        }>
            <SignInContent />
        </Suspense>
    );
}