import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cours CSS - Apprendre le CSS de zéro | Plateforme de cours',
  description: 'Maîtrisez CSS de zéro. Apprenez les sélecteurs, les couleurs, les mises en page, les transformations, les transitions et les animations.',
  keywords: 'CSS, CSS3, cours CSS, apprendre CSS, mise en page, design web, styles CSS, animations CSS',
  openGraph: {
    title: 'Cours CSS - Apprendre le CSS de zéro',
    description: 'Maîtrisez CSS de zéro. Apprenez les sélecteurs, les couleurs, les mises en page, les transformations, les transitions et les animations.',
    type: 'website',
    url: 'https://bac-plus.vercel.app/cours/css',
    images: [
      {
        url: '/og-css.jpg',
        width: 1200,
        height: 630,
        alt: 'Cours CSS - Apprendre le CSS de zéro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cours CSS - Apprendre le CSS de zéro',
    description: 'Maîtrisez CSS de zéro. Apprenez les sélecteurs, les couleurs, les mises en page, les transformations, les transitions et les animations.',
    images: ['/og-css.jpg'],
  },
};

export default function CssLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}