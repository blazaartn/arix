'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionId: string;
    questionTitle: string;
    onCommentAdded: () => void;
}

export function CommentModal({ isOpen, onClose, questionId, questionTitle, onCommentAdded }: CommentModalProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Veuillez écrire un commentaire');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, content: content.trim() })
            });

            const data = await res.json();
            if (data.success) {
                onCommentAdded();
                onClose();
                setContent('');
            } else {
                setError(data.error || 'Erreur');
            }
        } catch {
            setError('Erreur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold">Répondre</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <p className="text-sm text-gray-500 mb-3">
                        Question: <span className="font-medium text-gray-700">{questionTitle}</span>
                    </p>
                    {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Écrire un commentaire..."
                        className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={4}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {loading ? 'Publication...' : 'Publier'}
                    </button>
                </form>
            </div>
        </div>
    );
}