import fs from 'fs';
import path from 'path';
import { generateSlug } from './slug';

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