import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours HTML5 - Apprendre le HTML de zéro | Plateforme de cours',
  description: 'Maîtrisez HTML5 de zéro. Apprenez tout, de la structure du document aux formulaires, en passant par les tableaux et les éléments sémantiques.',
  keywords: 'HTML, HTML5, cours HTML, apprendre HTML, développement web, balises HTML, tutoriel HTML',
  openGraph: {
    title: 'Cours HTML5 - Apprendre le HTML de zéro',
    description: 'Maîtrisez HTML5 de zéro. Apprenez tout, de la structure du document aux formulaires, en passant par les tableaux et les éléments sémantiques.',
    type: 'website',
    url: 'https://bac-plus.vercel.app/cours/html',
    images: [
      {
        url: '/og-html.jpg',
        width: 1200,
        height: 630,
        alt: 'Cours HTML5 - Apprendre le HTML de zéro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cours HTML5 - Apprendre le HTML de zéro',
    description: 'Maîtrisez HTML5 de zéro. Apprenez tout, de la structure du document aux formulaires, en passant par les tableaux et les éléments sémantiques.',
    images: ['/og-html.jpg'],
  },
};

export default function HtmlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}