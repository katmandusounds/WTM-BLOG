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
    <div className="w-full max-w-full overflow-hidden">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 w-full">
        {items.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer w-full"
            onClick={() => onItemClick(item)}
          >
            <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 w-full">
              {/* Different aspect ratios for YouTube vs Spotify */}
              <div className={`relative ${item.type === 'youtube_video' ? 'aspect-video' : 'aspect-square'} bg-gray-800 w-full`}>
                <img
                  src={item.thumbnail_url}
                  alt={`${item.artist} - ${cleanTitle(item.title)}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                
                {/* Two dots overlay with loading animation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Type indicator - only show for YouTube videos */}
                {item.type === 'youtube_video' && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-burgundy-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Video
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Title and View Count with text stroke */}
            <div className="mt-3 px-1 space-y-1 w-full">
              <p className="text-xs font-medium text-white group-hover:text-white transition-colors duration-200 line-clamp-2 break-words title-stroke">
                {item.artist} – {cleanTitle(item.title)}
              </p>
              {/* YouTube view count */}
              {item.type === 'youtube_video' && item.view_count && (
                <p className="text-xs text-burgundy-400 font-normal title-stroke">
                  {item.view_count} views
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}