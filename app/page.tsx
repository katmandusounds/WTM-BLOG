'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Home as HomeIcon, Info, MoreHorizontal, MapPin } from 'lucide-react';
import MusicGrid from '@/components/MusicGrid';
import VideoModal from '@/components/VideoModal';

interface MusicItem {
  type: 'youtube_video' | 'spotify_topic';
  artist: string;
  title: string;
  thumbnail_url: string;
  embed_url: string;
  view_count?: string;
}

interface MusicData {
  [date: string]: MusicItem[];
}

type Section = 'home' | 'unreleased' | 'about';

export default function Home() {
  const [musicData, setMusicData] = useState<MusicData>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MusicItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('home');

  const ITEMS_PER_PAGE = 32; // 4 per row, 8 rows

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setMusicData(data);
      } catch (error) {
        console.error('Error fetching music data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for unreleased content (short-form videos)
  const unreleasedData: MusicData = {
    '2024-01-15': [
      {
        type: 'youtube_video',
        artist: 'Central Cee',
        title: 'Studio Session Preview',
        thumbnail_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        view_count: '2.1M'
      },
      {
        type: 'youtube_video',
        artist: 'Dave',
        title: 'Behind the Scenes',
        thumbnail_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        view_count: '890K'
      },
      {
        type: 'youtube_video',
        artist: 'AJ Tracey',
        title: 'Quick Freestyle',
        thumbnail_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        view_count: '1.5M'
      },
      {
        type: 'youtube_video',
        artist: 'Stormzy',
        title: 'Snippet Preview',
        thumbnail_url: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=800',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        view_count: '3.2M'
      }
    ],
    '2024-01-14': [
      {
        type: 'youtube_video',
        artist: 'Headie One',
        title: 'TikTok Challenge',
        thumbnail_url: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        view_count: '750K'
      },
      {
        type: 'youtube_video',
        artist: 'Unknown T',
        title: 'Instagram Reel',
        thumbnail_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        view_count: '420K'
      }
    ]
  };

  // Custom Two Dots Component
  const TwoDots = ({ className }: { className?: string }) => (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
      <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
    </div>
  );

  // Get current data based on active section
  const getCurrentData = () => {
    return activeSection === 'unreleased' ? unreleasedData : musicData;
  };

  // Flatten all items with their dates for pagination
  const allItems = Object.entries(getCurrentData()).flatMap(([date, items]) =>
    items.map(item => ({ ...item, date }))
  );

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = allItems.slice(startIndex, endIndex);

  // Group current items by date
  const groupedItems = currentItems.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as { [date: string]: (MusicItem & { date: string })[] });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleItemClick = (item: MusicItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setCurrentPage(0); // Reset pagination when switching sections
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading music releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Vertical Sidebar - Red Theme with Responsive Width */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-36 bg-red-600 border-r border-red-700 flex flex-col z-40">
        {/* Logo Section */}
        <div className="p-3 lg:p-4 border-b border-red-700 text-center">
          <h1 className="text-lg lg:text-2xl font-bold text-white">WTM</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-3 space-y-2">
          <button
            onClick={() => handleSectionChange('home')}
            className={`w-full flex items-center space-x-2 px-2 lg:px-3 py-2 lg:py-3 rounded-lg transition-all duration-200 ${
              activeSection === 'home'
                ? 'bg-white text-red-600 shadow-lg'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <HomeIcon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="text-xs lg:text-sm font-medium hidden lg:inline">Home</span>
          </button>
          
          <button
            onClick={() => handleSectionChange('unreleased')}
            className={`w-full flex items-center space-x-2 px-2 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 ${
              activeSection === 'unreleased'
                ? 'bg-white text-red-600 shadow-lg'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <TwoDots className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="text-xs lg:text-sm font-medium hidden lg:inline">Unreleased</span>
          </button>
          
          <button
            onClick={() => handleSectionChange('about')}
            className={`w-full flex items-center space-x-2 px-2 lg:px-3 py-2 lg:py-3 rounded-lg transition-all duration-200 ${
              activeSection === 'about'
                ? 'bg-white text-red-600 shadow-lg'
                : 'text-red-100 hover:text-white hover:bg-red-700'
            }`}
          >
            <Info className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="text-xs lg:text-sm font-medium hidden lg:inline">About</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-20 lg:ml-36 min-h-screen flex flex-col">
        <div className="flex-1 max-w-6xl mx-auto px-6 py-8">
          {activeSection === 'about' ? (
            /* About Section */
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                  About WTM
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
              </div>
              
              <div className="bg-black rounded-2xl p-8 sm:p-12 border border-gray-800">
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-xl text-gray-300 leading-relaxed mb-8">
                    We are a music blog that helps you keep up with the latest releases from UK rap and urban music. 
                    Based in London, created by artists for the artists.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                      <p className="text-gray-300">
                        To showcase the vibrant UK rap and urban music scene, giving artists the platform they deserve 
                        and keeping fans connected to the freshest sounds from the streets of London and beyond.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">By Artists, For Artists</h3>
                      <p className="text-gray-300">
                        Founded and run by artists who understand the scene, we're committed to authentic representation 
                        of UK urban culture and supporting the next generation of talent.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">
                        Based in London • Established by the community, for the community
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Home/Unreleased Section - Music Releases */
            <div className="w-full">
              {/* Section Header - Centered */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {activeSection === 'home' ? 'Latest Releases' : 'Unreleased Content'}
                </h2>
                <p className="text-gray-400 text-lg">
                  {activeSection === 'home' 
                    ? 'Discover the newest music videos and tracks from your favorite UK artists'
                    : 'Exclusive snippets, behind-the-scenes content, and short-form videos'
                  }
                </p>
              </div>

              {Object.keys(groupedItems).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {activeSection === 'home' ? 'No music releases found.' : 'No unreleased content found.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedItems)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([date, items]) => (
                      <section key={date} className="space-y-6 w-full">
                        {/* Date Header - Centered */}
                        <div className="text-center">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {formatDate(date)}
                          </h3>
                          {activeSection === 'unreleased' && (
                            <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                              Short Form Content
                            </span>
                          )}
                        </div>

                        {/* Music Grid */}
                        <MusicGrid 
                          items={items} 
                          onItemClick={handleItemClick}
                        />
                      </section>
                    ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 border border-red-700 rounded-lg text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <span className="text-sm text-gray-400">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 border border-red-700 rounded-lg text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Red Theme */}
        <footer className="border-t border-red-800 bg-red-600 py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-red-100">
                <MapPin className="w-4 h-4" />
                <span>London, UK</span>
              </div>
              <p className="text-red-200 text-sm">
                By artists, for artists
              </p>
              <p className="text-red-300 text-xs">
                © 2024 WTM. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Video Modal */}
      {selectedItem && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          artist={selectedItem.artist}
          title={selectedItem.title}
          embedUrl={selectedItem.embed_url}
          thumbnailUrl={selectedItem.thumbnail_url}
        />
      )}
    </div>
  );
}