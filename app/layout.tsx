import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ifuno.uk'),
  title: 'IFUNO - Latest UK Music Releases | UK Rap, Drill, Grime, Underground [2024]',
  description: 'Discover the newest UK music. Daily updates of UK rap, drill, grime, and underground music videos and songs. The biggest UK urban music database.',
  keywords: [
    'UK music', 'UK rap', 'UK drill', 'grime', 'underground music',
    'new music 2024', 'latest UK releases', 'music videos', 'lyrics',
    'instrumental', 'clean', 'acapella', 'official video', 'audio',
    'UK music database', 'British hip hop', 'London music', 'Birmingham music',
    'Manchester music', 'streaming', 'download', 'new releases',
    'UK UG music', 'UK UG rappers', 'UK UG rap', 'UK underground rap', 'UK underground music'
  ],
  icons: {
    icon: 'https://ik.imagekit.io/vv1coyjgq/ifuno%20favicon%20green.png?updatedAt=1751629200462',
  },
  openGraph: {
    title: 'IFUNO - Latest UK Music Releases | UK Rap, Drill, Grime, Underground [2024]',
    description: 'Discover the newest UK music. Daily updates of UK rap, drill, grime, and underground music videos and songs.',
    type: 'website',
    siteName: 'IFUNO - UK Music Database',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IFUNO - Latest UK Music Releases | UK Rap, Drill, Grime, Underground [2024]',
    description: 'Discover the newest UK music. Daily updates of UK rap, drill, grime, and underground music videos and songs.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="icon" href="https://ik.imagekit.io/vv1coyjgq/ifuno.png?updatedAt=1751806550126" />
        <link rel="canonical" href="https://ifuno.uk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#25f23f" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="IFUNO" />
        <meta name="publisher" content="IFUNO" />
        <meta name="copyright" content="IFUNO 2024" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 day" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Structured Data for Music */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "IFUNO",
              "description": "Latest UK Music Releases - UK Rap, Drill, Grime, Underground",
              "url": "https://ifuno.uk",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ifuno.uk/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "IFUNO",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754"
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
