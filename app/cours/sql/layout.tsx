import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours SQL & Bases de données - Apprendre SQL de zéro | Plateforme de cours',
  description: 'Maîtrisez SQL et les bases de données relationnelles. Apprenez la modélisation, les requêtes SELECT, JOIN, GROUP BY, et la gestion des données.',
  keywords: 'SQL, bases de données, BD, cours SQL, requêtes SQL, modélisation, base de données relationnelle, MySQL, PostgreSQL',
  openGraph: {
    title: 'Cours SQL & Bases de données - Apprendre SQL de zéro',
    description: 'Maîtrisez SQL et les bases de données relationnelles. Apprenez la modélisation, les requêtes SELECT, JOIN, GROUP BY, et la gestion des données.',
    type: 'website',
    url: 'https://bac-plus.vercel.app/cours/sql',
    images: [
      {
        url: '/og-sql.jpg',
        width: 1200,
        height: 630,
        alt: 'Cours SQL & Bases de données',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cours SQL & Bases de données - Apprendre SQL de zéro',
    description: 'Maîtrisez SQL et les bases de données relationnelles. Apprenez la modélisation, les requêtes SELECT, JOIN, GROUP BY, et la gestion des données.',
    images: ['/og-sql.jpg'],
  },
};

export default function SqlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}