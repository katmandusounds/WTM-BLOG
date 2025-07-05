import { Metadata } from 'next';
import { generateSlug } from '@/lib/slug';
import fs from 'fs';
import path from 'path';

interface VideoLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

interface MusicItem {
  type: 'youtube_video' | 'spotify_topic';
  artist: string;
  title: string;
  thumbnail_url: string;
  embed_url: string;
  view_count?: string;
  published_at: string;
  video_url: string;
  track_title_clean: string;
}

interface MusicData {
  [date: string]: MusicItem[];
}

// Generate static params for all video pages
export async function generateStaticParams() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const musicData: MusicData = JSON.parse(fileContents);
    
    const slugs: { slug: string }[] = [];
    
    // Iterate through all dates and items to generate slugs
    for (const [date, items] of Object.entries(musicData)) {
      for (const item of items) {
        const publishedAt = item.published_at || date;
        const slug = generateSlug(item.artist, item.title, publishedAt);
        slugs.push({ slug });
      }
    }
    
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

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