import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { generateSlug } from '@/lib/slug';

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

export async function generateStaticParams() {
  try {
    // Read the data.json file from the public directory
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      console.warn('data.json not found, generating empty static params');
      return [];
    }
    
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const musicData: MusicData = JSON.parse(fileContents);
    
    // Generate slugs for all videos
    const slugs: { slug: string }[] = [];
    
    for (const [date, items] of Object.entries(musicData)) {
      for (const item of items) {
        const slug = generateSlug(item.artist, item.title, item.published_at || date);
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