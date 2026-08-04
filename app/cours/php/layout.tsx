import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours PHP - Apprendre PHP de zéro | Plateforme de cours',
  description: 'Maîtrisez PHP de zéro. Apprenez la programmation côté serveur, la gestion des formulaires, l\'interaction avec les bases de données et la création de sites dynamiques.',
  keywords: 'PHP, cours PHP, apprendre PHP, programmation serveur, bases de données, sites dynamiques, tutoriel PHP',
  openGraph: {
    title: 'Cours PHP - Apprendre PHP de zéro',
    description: 'Maîtrisez PHP de zéro. Apprenez la programmation côté serveur, la gestion des formulaires, l\'interaction avec les bases de données et la création de sites dynamiques.',
    type: 'website',
    url: 'https://bac-plus.vercel.app/cours/php',
    images: [
      {
        url: '/og-php.jpg',
        width: 1200,
        height: 630,
        alt: 'Cours PHP - Apprendre PHP de zéro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cours PHP - Apprendre PHP de zéro',
    description: 'Maîtrisez PHP de zéro. Apprenez la programmation côté serveur, la gestion des formulaires, l\'interaction avec les bases de données et la création de sites dynamiques.',
    images: ['/og-php.jpg'],
  },
};

export default function PhpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}