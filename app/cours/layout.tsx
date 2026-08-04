import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours de Programmation - Apprenez à coder | Plateforme de cours',
  description: 'Apprenez à coder avec nos cours complets de HTML, CSS, JavaScript, PHP et SQL. Des tutoriels interactifs pour tous les niveaux.',
  keywords: 'programmation, cours, HTML, CSS, JavaScript, PHP, SQL, développement web, apprendre à coder',
  openGraph: {
    title: 'Cours de Programmation - Apprenez à coder',
    description: 'Apprenez à coder avec nos cours complets de HTML, CSS, JavaScript, PHP et SQL. Des tutoriels interactifs pour tous les niveaux.',
    type: 'website',
    url: 'https://bac-plus.vercel.app/cours',
    images: [
      {
        url: '/og-cours.jpg',
        width: 1200,
        height: 630,
        alt: 'Cours de Programmation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cours de Programmation - Apprenez à coder',
    description: 'Apprenez à coder avec nos cours complets de HTML, CSS, JavaScript, PHP et SQL. Des tutoriels interactifs pour tous les niveaux.',
    images: ['/og-cours.jpg'],
  },
};

export default function CoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}