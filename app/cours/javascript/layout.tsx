import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours JavaScript - Apprendre JavaScript de zéro | Plateforme de cours',
  description: 'Maîtrisez JavaScript de zéro. Apprenez les bases du langage, la manipulation du DOM, les événements, et créez des interactions dynamiques.',
  keywords: 'JavaScript, JS, cours JavaScript, apprendre JavaScript, DOM, programmation web, tutoriel JS',
  openGraph: {
    title: 'Cours JavaScript - Apprendre JavaScript de zéro',
    description: 'Maîtrisez JavaScript de zéro. Apprenez les bases du langage, la manipulation du DOM, les événements, et créez des interactions dynamiques.',
    type: 'website',
    url: 'https://bac-plus.vercel.app/cours/javascript',
    images: [
      {
        url: '/og-javascript.jpg',
        width: 1200,
        height: 630,
        alt: 'Cours JavaScript - Apprendre JavaScript de zéro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cours JavaScript - Apprendre JavaScript de zéro',
    description: 'Maîtrisez JavaScript de zéro. Apprenez les bases du langage, la manipulation du DOM, les événements, et créez des interactions dynamiques.',
    images: ['/og-javascript.jpg'],
  },
};

export default function JavascriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}