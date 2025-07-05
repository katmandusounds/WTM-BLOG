'use client';

import { useEffect } from 'react';

interface MusicVideoStructuredDataProps {
  artist: string;
  title: string;
  thumbnailUrl: string;
  embedUrl: string;
  publishedAt: string;
  viewCount?: string;
}

export default function StructuredData({
  artist,
  title,
  thumbnailUrl,
  embedUrl,
  publishedAt,
  viewCount
}: MusicVideoStructuredDataProps) {
  useEffect(() => {
    const cleanTitle = title.replace(/^-\s*/, '').trim();
    const year = new Date(publishedAt).getFullYear();
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "MusicVideoObject",
      "name": `${artist} - ${cleanTitle}`,
      "description": `${cleanTitle} by ${artist} - Official music video from ${year}. Part of the latest UK rap, drill, grime, and underground music releases.`,
      "thumbnailUrl": thumbnailUrl,
      "embedUrl": embedUrl,
      "uploadDate": publishedAt,
      "duration": "PT3M30S", // Default duration, you could make this dynamic
      "genre": ["UK Rap", "UK Drill", "Grime", "Underground"],
      "inLanguage": "en-GB",
      "creator": {
        "@type": "Person",
        "name": artist
      },
      "publisher": {
        "@type": "Organization",
        "name": "IFUNO",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754"
        }
      },
      "mainEntity": {
        "@type": "MusicRecording",
        "name": cleanTitle,
        "byArtist": {
          "@type": "Person",
          "name": artist
        },
        "genre": ["UK Rap", "UK Drill", "Grime", "Underground"],
        "datePublished": publishedAt,
        "inLanguage": "en-GB"
      }
    };

    // Add view count if available
    if (viewCount) {
      structuredData.interactionStatistic = {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/WatchAction",
        "userInteractionCount": parseInt(viewCount.replace(/[^\d]/g, ''))
      };
    }

    // Remove existing structured data script if it exists
    const existingScript = document.querySelector('script[type="application/ld+json"][data-video-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-video-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-video-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [artist, title, thumbnailUrl, embedUrl, publishedAt, viewCount]);

  return null; // This component doesn't render anything visible
}