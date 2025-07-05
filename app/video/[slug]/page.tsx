'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Calendar, Play, Eye, Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import VideoModal from '@/components/VideoModal';

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

interface VideoPageProps {
  params: {
    slug: string;
  };
}

// SEO modifier keywords for better search visibility
const SEO_MODIFIERS = [
  'lyrics', 'instrumental', 'official video', 'clean', 'acapella', 
  'audio', '320', 'music video', 'type beat', 'remix', 'bts', 
  'behind the scenes', 'uk rap', 'uk drill', 'grime', 'underground',
  'new music', 'latest', 'visualizer', 'lyric video'
];

// Generate static params for all video pages
export async function generateStaticParams() {
  try {
    // Read the data.json file from the public directory
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(process.cwd(), 'public', 'data.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    const musicData: MusicData = JSON.parse(jsonData);
    
    const slugs: { slug: string }[] = [];
    
    // Generate slugs for all music items
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

// Helper function to generate slug (same as in component)
function generateSlug(artist: string, title: string, publishedAt: string): string {
  const year = new Date(publishedAt).getFullYear();
  const cleanTitle = title.replace(/^-\s*/, '').trim();
  return `${artist}-${cleanTitle}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function VideoPage({ params }: VideoPageProps) {
  const [musicData, setMusicData] = useState<MusicData>({});
  const [currentVideo, setCurrentVideo] = useState<MusicItem | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<MusicItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setMusicData(data);
        
        // Find the video by slug
        const video = findVideoBySlug(data, params.slug);
        if (video) {
          setCurrentVideo(video);
          setRelatedVideos(getRelatedVideos(data, video));
          
          // Update page title and meta
          updatePageMeta(video);
        }
      } catch (error) {
        console.error('Error fetching music data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  const findVideoBySlug = (data: MusicData, slug: string): MusicItem | null => {
    for (const [date, items] of Object.entries(data)) {
      for (const item of items) {
        const videoSlug = generateSlug(item.artist, item.title, item.published_at);
        if (videoSlug === slug) {
          return { ...item, published_at: item.published_at || date };
        }
      }
    }
    return null;
  };

  const getRelatedVideos = (data: MusicData, currentVideo: MusicItem): MusicItem[] => {
    const allVideos: MusicItem[] = [];
    
    for (const [date, items] of Object.entries(data)) {
      for (const item of items) {
        if (item !== currentVideo) {
          allVideos.push({ ...item, published_at: item.published_at || date });
        }
      }
    }
    
    // Sort by date and return first 6
    return allVideos
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 6);
  };

  const updatePageMeta = (video: MusicItem) => {
    const year = new Date(video.published_at).getFullYear();
    const cleanTitle = video.title.replace(/^-\s*/, '').trim();
    
    // Generate SEO-rich title
    const seoTitle = `${video.artist} - ${cleanTitle} [${year}] ${SEO_MODIFIERS.slice(0, 8).join(' | ')} | UK Music`;
    
    // Update document title
    document.title = seoTitle;
    
    // Update meta description
    const metaDescription = `Listen to ${video.artist}'s "${cleanTitle}" (${year}). Discover the latest UK rap, grime, and underground releases. Updated daily with new music videos, lyrics, instrumentals, and more.`;
    
    // Update or create meta tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('og:title', seoTitle);
    updateMetaTag('og:description', metaDescription);
    updateMetaTag('og:image', video.thumbnail_url);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('twitter:title', seoTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', video.thumbnail_url);
  };

  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleRelatedVideoClick = (video: MusicItem) => {
    const slug = generateSlug(video.artist, video.title, video.published_at);
    window.location.href = `/video/${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifuno-green mx-auto mb-4"></div>
          <p className="text-gray-300">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    notFound();
  }

  const year = new Date(currentVideo.published_at).getFullYear();
  const cleanTitle = currentVideo.title.replace(/^-\s*/, '').trim();

  return (
    <div className="min-h-screen text-white bg-black relative">
      {/* Video background with overlay */}
      <div className="fixed inset-0 z-[-1] p-4">
        <div className="w-full h-full border-4 border-ifuno-green rounded-lg overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://ik.imagekit.io/vv1coyjgq/wadiz%20this%20snake%20anime2.mp4/ik-video.mp4?updatedAt=1751468769965" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="fixed inset-0 z-[-1] bg-black/70"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-ifuno-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <Link href="/" className="flex items-center">
              <img 
                src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                alt="IFUNO Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Video Section */}
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-ifuno-pink mb-8">
            {/* Video Header */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 title-stroke">
                {currentVideo.artist} - {cleanTitle} [{year}] Official Video & Lyrics
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(currentVideo.published_at)}</span>
                </div>
                {currentVideo.view_count && (
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{currentVideo.view_count} views</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{year}</span>
                </div>
              </div>

              {/* SEO Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {SEO_MODIFIERS.slice(0, 12).map((modifier, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-ifuno-green/20 text-ifuno-green text-xs rounded-full border border-ifuno-green/30"
                  >
                    {modifier}
                  </span>
                ))}
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
              {currentVideo.embed_url ? (
                <iframe
                  src={currentVideo.embed_url}
                  title={`${currentVideo.artist} - ${cleanTitle}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900">
                  <div className="text-center">
                    <img
                      src={currentVideo.thumbnail_url}
                      alt={`${currentVideo.artist} - ${cleanTitle}`}
                      className="w-64 h-36 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-gray-400">Video not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">About This Track</h2>
                <p className="text-gray-300">
                  {cleanTitle} by {currentVideo.artist} - Experience the latest in UK music. 
                  This track represents the cutting edge of {year} UK rap, drill, grime, and underground music scene.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Track Details</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li><strong>Artist:</strong> {currentVideo.artist}</li>
                    <li><strong>Title:</strong> {cleanTitle}</li>
                    <li><strong>Year:</strong> {year}</li>
                    <li><strong>Type:</strong> {currentVideo.type === 'youtube_video' ? 'Music Video' : 'Audio Track'}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Available Formats</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Official Video', 'Audio', 'Lyrics', 'Instrumental'].map((format, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-ifuno-pink/20 text-ifuno-pink text-xs rounded border border-ifuno-pink/30"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-ifuno-pink">
              <h2 className="text-2xl font-bold text-white mb-6 title-stroke">More UK Music Releases</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {relatedVideos.map((video, index) => {
                  const videoYear = new Date(video.published_at).getFullYear();
                  const videoCleanTitle = video.title.replace(/^-\s*/, '').trim();
                  
                  return (
                    <div
                      key={index}
                      className="group cursor-pointer"
                      onClick={() => handleRelatedVideoClick(video)}
                    >
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                        <div className="relative aspect-video bg-gray-800">
                          <img
                            src={video.thumbnail_url}
                            alt={`${video.artist} - ${videoCleanTitle}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                          
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 rounded-full p-2">
                              <Play className="w-4 h-4 text-black" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <p className="text-xs font-medium text-white line-clamp-2 title-stroke">
                            {video.artist} – {videoCleanTitle}
                          </p>
                          <p className="text-xs text-ifuno-pink mt-1">{videoYear}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEO Content Section - Hidden but crawlable */}
          <div className="sr-only">
            <h2>UK Music Database - Latest Releases {year}</h2>
            <p>
              Discover more new UK rap, UK drill, grime, and underground songs released in {year}. 
              This page is part of the biggest UK urban music database. Updated daily with the latest tracks, 
              official videos, lyrics, instrumentals, clean versions, acapellas, and behind-the-scenes content.
            </p>
            
            <h3>Search Terms</h3>
            <p>
              {currentVideo.artist} {cleanTitle} lyrics, {currentVideo.artist} {cleanTitle} instrumental, 
              {currentVideo.artist} {cleanTitle} clean, {currentVideo.artist} {cleanTitle} acapella,
              {currentVideo.artist} {cleanTitle} type beat, {currentVideo.artist} {cleanTitle} remix,
              {currentVideo.artist} {cleanTitle} behind the scenes, {currentVideo.artist} {cleanTitle} bts,
              UK rap {year}, UK drill {year}, grime {year}, underground music {year},
              new UK music {year}, latest UK releases {year}
            </p>
            
            <h3>Related Artists and Genres</h3>
            <p>
              UK Rap, UK Drill, Grime, Underground, British Hip Hop, London Music Scene, 
              Birmingham Music, Manchester Music, {year} releases, new music, latest tracks,
              official videos, music videos, audio tracks, streaming, download
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-ifuno-pink bg-black/80 backdrop-blur-sm py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4">
              <p className="text-ifuno-green font-medium">
                Discover more new UK rap, UK drill, grime, and underground songs released in {year}. 
                This page is part of the biggest UK urban music database. Updated daily with the latest tracks and official videos.
              </p>
              <p className="text-gray-500 text-sm">
                © {year} IFUNO. All rights reserved. | UK Music Database | Latest Releases | IF YOU KNOW, YOU KNOW
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Video Modal */}
      {currentVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          artist={currentVideo.artist}
          title={cleanTitle}
          embedUrl={currentVideo.embed_url}
          thumbnailUrl={currentVideo.thumbnail_url}
        />
      )}
    </div>
  );
}