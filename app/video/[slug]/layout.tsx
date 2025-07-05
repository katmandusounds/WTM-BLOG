import { Metadata } from 'next';
import { generateStaticParams as generateVideoParams } from '@/lib/generate-video-params';

interface VideoLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

// Re-export the generateStaticParams function
export const generateStaticParams = generateVideoParams;

// This will be called for each video page to generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In a real app, you'd fetch the video data here
  // For now, we'll use a basic structure that will be enhanced by the client-side code
  
  const baseTitle = "UK Music Video | Latest Releases | IFUNO";
  const baseDescription = "Discover the latest UK rap, drill, grime, and underground music releases. Updated daily with new tracks and official videos.";
  
  return {
    title: baseTitle,
    description: baseDescription,
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      type: 'video.other',
      siteName: 'IFUNO - UK Music Database',
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: baseDescription,
    },
    keywords: [
      'UK rap', 'UK drill', 'grime', 'underground music', 'new music 2024',
      'latest releases', 'music videos', 'lyrics', 'instrumental', 'clean',
      'acapella', 'official video', 'audio', 'UK music database'
    ],
  };
}

export default function VideoLayout({ children }: VideoLayoutProps) {
  return children;
}