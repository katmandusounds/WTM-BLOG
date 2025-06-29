'use client';

interface MusicItem {
  type: 'youtube_video' | 'spotify_topic';
  artist: string;
  title: string;
  thumbnail_url: string;
  embed_url: string;
  view_count?: string;
}

interface MusicGridProps {
  items: MusicItem[];
  onItemClick: (item: MusicItem) => void;
}

export default function MusicGrid({ items, onItemClick }: MusicGridProps) {
  const cleanTitle = (title: string) => {
    // Remove leading dash and trim whitespace
    return title.replace(/^-\s*/, '').trim();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="group cursor-pointer"
          onClick={() => onItemClick(item)}
        >
          <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
            {/* Different aspect ratios for YouTube vs Spotify */}
            <div className={`relative ${item.type === 'youtube_video' ? 'aspect-video' : 'aspect-square'} bg-gray-800`}>
              <img
                src={item.thumbnail_url}
                alt={`${item.artist} - ${cleanTitle(item.title)}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-3 shadow-lg">
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              {/* Type indicator - only show for YouTube videos */}
              {item.type === 'youtube_video' && (
                <div className="absolute top-2 right-2">
                  <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Video
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Title and View Count */}
          <div className="mt-3 px-1 space-y-1">
            <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200 line-clamp-2">
              {item.artist} – {cleanTitle(item.title)}
            </p>
            {/* YouTube view count */}
            {item.type === 'youtube_video' && item.view_count && (
              <p className="text-xs text-yellow-400 font-normal">
                {item.view_count} views
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}