'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Home as HomeIcon, Info, MoreHorizontal, MapPin, ShoppingBag, HelpCircle } from 'lucide-react';
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

type Section = 'home' | 'unreleased' | 'about' | 'shop';

export default function Home() {
  const [musicData, setMusicData] = useState<MusicData>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MusicItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('home');

  const ITEMS_PER_PAGE = 40; // 5 per row, 8 rows

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

  const handleLogoClick = () => {
    setActiveSection('home');
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="text-center content-wrapper">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading music releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black overflow-hidden">
      {/* Video Background - Full Screen with Reduced Black Tint */}
      <div className="fixed inset-0 z-[-2]">
        <video
          className="video-background-main"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://ik.imagekit.io/vv1coyjgq/wadiz%20this%20snake%20anime2.mp4/ik-video.mp4?updatedAt=1751468769965" type="video/mp4" />
        </video>
        {/* Reduced black tint overlay - 50% */}
        <div className="absolute inset-0 bg-black/50 z-[-1]"></div>
      </div>

      {/* Horizontal Navigation Bar - Reorganized Layout */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - New and Unreleased */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleSectionChange('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 'home'
                    ? 'bg-burgundy-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">New</span>
              </button>
              
              <button
                onClick={() => handleSectionChange('unreleased')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 'unreleased'
                    ? 'bg-burgundy-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unreleased</span>
              </button>
            </div>
            
            {/* Center - Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                alt="IFUKNO Logo" 
                className="h-12 w-auto object-contain"
              />
            </button>
            
            {/* Right Side - Shop and About */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleSectionChange('shop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 'shop'
                    ? 'bg-burgundy-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm font-medium">Shop</span>
              </button>
              
              <button
                onClick={() => handleSectionChange('about')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 'about'
                    ? 'bg-burgundy-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">About</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen flex flex-col content-wrapper">
        <div className="flex-1 max-w-6xl mx-auto px-6 py-8 relative z-10">
          {activeSection === 'about' ? (
            /* About Section */
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="bg-black rounded-2xl p-8 mb-8">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 title-stroke">
                    About IFUKNO
                  </h2>
                  <div className="w-24 h-1 bg-burgundy-600 mx-auto"></div>
                </div>
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
          ) : activeSection === 'shop' ? (
            /* Shop Section */
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="bg-black rounded-2xl p-8 mb-8">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 title-stroke">
                    IFUKNO Shop
                  </h2>
                  <p className="text-white text-lg">
                    Official merchandise and exclusive drops from your favorite UK artists
                  </p>
                  <div className="w-24 h-1 bg-burgundy-600 mx-auto mt-6"></div>
                </div>
              </div>
              
              <div className="bg-black rounded-2xl p-8 sm:p-12 border border-gray-800">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <ShoppingBag className="w-16 h-16 text-burgundy-600 mx-auto" />
                    <h3 className="text-3xl font-bold text-white">Coming Soon</h3>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                      We're working on bringing you exclusive merchandise, limited edition drops, 
                      and official gear from the hottest UK rap and urban artists.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-burgundy-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">Exclusive Drops</h4>
                      <p className="text-gray-300">
                        Limited edition merchandise from your favorite artists, available only through IFUKNO.
                      </p>
                    </div>
                    
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-burgundy-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">Artist Collaborations</h4>
                      <p className="text-gray-300">
                        Official merchandise designed in collaboration with UK rap and urban artists.
                      </p>
                    </div>
                    
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-burgundy-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">Community First</h4>
                      <p className="text-gray-300">
                        Supporting the UK music scene with every purchase, by artists for artists.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-gray-400">
                      Want to be notified when we launch? Follow us on social media for updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Home/Unreleased Section - Music Releases */
            <div className="w-full">
              {/* Section Header - Centered */}
              <div className="text-center mb-8">
                <div className="bg-black rounded-2xl p-8 mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 title-stroke">
                    {activeSection === 'home' ? 'Latest Releases' : 'Unreleased Content'}
                  </h2>
                  <p className="text-gray-400 text-lg">
                    {activeSection === 'home' 
                      ? 'Discover the newest music videos and tracks from your favorite UK artists'
                      : 'Exclusive snippets, behind-the-scenes content, and short-form videos'
                    }
                  </p>
                </div>
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
                        {/* Date Header - Centered with text stroke */}
                        <div className="text-center">
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 title-stroke">
                            {formatDate(date)}
                          </h3>
                          {activeSection === 'unreleased' && (
                            <span className="inline-block bg-burgundy-600 text-white text-xs px-3 py-1 rounded-full font-medium">
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
                    className="flex items-center space-x-2 px-4 py-2 bg-burgundy-600 border border-burgundy-700 rounded-lg text-white hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                    className="flex items-center space-x-2 px-4 py-2 bg-burgundy-600 border border-burgundy-700 rounded-lg text-white hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Black Theme */}
        <footer className="border-t border-gray-800 bg-black py-6 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>London, UK</span>
              </div>
              <p className="text-gray-300 text-sm">
                By artists, for artists
              </p>
              <p className="text-gray-500 text-xs">
                © 2024 IFUKNO. All rights reserved.
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