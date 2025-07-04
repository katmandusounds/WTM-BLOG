'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Home as HomeIcon, Info, MoreHorizontal, MapPin, ShoppingBag, HelpCircle, Menu, X, Lock } from 'lucide-react';
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

type Section = 'home' | 'leak' | 'about' | 'shop';

export default function Home() {
  const [musicData, setMusicData] = useState<MusicData>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MusicItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeakUnlocked, setIsLeakUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const ITEMS_PER_PAGE = 40; // 5 per row, 8 rows
  const LEAK_PASSWORD = '123456';

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

  // Scroll detection for navbar logo
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 150); // Show navbar logo after scrolling 150px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update page title based on active section
  useEffect(() => {
    const titles = {
      home: 'IFUNO - LATEST RELEASES',
      leak: 'IFUNO - LEAK',
      about: 'IFUNO - ABOUT',
      shop: 'IFUNO - SHOP'
    };
    document.title = titles[activeSection];
  }, [activeSection]);

  // Mock data for leak content (short-form videos)
  const leakData: MusicData = {
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
    return activeSection === 'leak' ? leakData : musicData;
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
    // If trying to access leak section and not unlocked, show password modal
    if (section === 'leak' && !isLeakUnlocked) {
      setShowPasswordModal(true);
      return;
    }
    
    setActiveSection(section);
    setCurrentPage(0); // Reset pagination when switching sections
    setIsMobileMenuOpen(false); // Close mobile menu
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeakAccess = () => {
    if (passwordInput === LEAK_PASSWORD) {
      setIsLeakUnlocked(true);
      setActiveSection('leak');
      setPasswordError(false);
      setPasswordInput('');
      setShowPasswordModal(false);
      setCurrentPage(0);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLeakAccess();
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setActiveSection('home');
    setCurrentPage(0);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="text-center content-wrapper">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifuno-green mx-auto mb-4"></div>
          <p className="text-gray-300">Loading music releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black overflow-hidden relative">
      {/* Screen Border - Shows video background */}
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

      {/* Black overlay for content readability */}
      <div className="fixed inset-0 z-[-1] bg-black/60"></div>

      {/* Large Logo - Starts from very top, disappears on scroll - ALL SECTIONS */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? 'opacity-0 translate-y-[-30px] pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <button 
          onClick={handleLogoClick}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <img 
            src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
            alt="IFUNO Logo" 
            className="h-20 w-auto object-contain"
          />
        </button>
      </div>

      {/* Horizontal Navigation Bar - Split Layout with Center Gap */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Left Side - Mobile Menu Button (visible on mobile) and Desktop Navigation */}
            <div className="flex items-center space-x-6 justify-start">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => handleSectionChange('home')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === 'home'
                      ? 'bg-ifuno-green text-black'
                      : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase">NEW</span>
                </button>
                
                <button
                  onClick={() => handleSectionChange('leak')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === 'leak'
                      ? 'bg-ifuno-green text-black'
                      : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase">LEAK</span>
                </button>
              </div>
            </div>
            
            {/* Center - Logo (only visible when scrolled or mobile menu open) */}
            <div className="flex justify-center">
              <div className={`transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <button 
                  onClick={handleLogoClick}
                  className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                >
                  <img 
                    src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                    alt="IFUNO Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </button>
              </div>
            </div>
            
            {/* Right Side - Shop and About (Desktop only) */}
            <div className="hidden md:flex items-center space-x-6 justify-end">
              <button
                onClick={() => handleSectionChange('shop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 'shop'
                    ? 'bg-ifuno-green text-black'
                    : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">SHOP</span>
              </button>
              
              <button
                onClick={() => handleSectionChange('about')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 'about'
                    ? 'bg-ifuno-green text-black'
                    : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                }`}
              >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">ABOUT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => handleSectionChange('home')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'home'
                    ? 'bg-ifuno-green text-black'
                    : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="font-medium uppercase">NEW</span>
              </button>
              
              <button
                onClick={() => handleSectionChange('leak')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'leak'
                    ? 'bg-ifuno-green text-black'
                    : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium uppercase">LEAK</span>
              </button>
              
              <button
                onClick={() => handleSectionChange('shop')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'shop'
                    ? 'bg-ifuno-green text-black'
                    : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium uppercase">SHOP</span>
              </button>
              
              <button
                onClick={() => handleSectionChange('about')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'about'
                    ? 'bg-ifuno-green text-black'
                    : 'text-gray-300 hover:text-white hover:bg-ifuno-pink'
                }`}
              >
                <Info className="w-5 h-5" />
                <span className="font-medium uppercase">ABOUT</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Password Protection Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleClosePasswordModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-black/90 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-ifuno-pink">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-ifuno-pink">
              <div>
                <h2 className="text-xl font-bold text-white uppercase">LEAK ACCESS</h2>
                <p className="text-sm text-gray-300">Protected Content</p>
              </div>
              <button
                onClick={handleClosePasswordModal}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center space-y-6">
                <Lock className="w-16 h-16 text-ifuno-pink mx-auto" />
                <p className="text-gray-300">
                  Enter the password to access exclusive leaked content
                </p>
                
                <div className="space-y-4">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyPress={handlePasswordKeyPress}
                    placeholder="Enter password"
                    className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      passwordError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:ring-ifuno-green'
                    }`}
                    autoFocus
                  />
                  
                  {passwordError && (
                    <p className="text-red-400 text-sm">Incorrect password. Try again.</p>
                  )}
                  
                  <button
                    onClick={handleLeakAccess}
                    className="w-full px-6 py-3 bg-ifuno-green text-black font-medium rounded-lg hover:bg-ifuno-pink hover:text-white transition-colors duration-200 uppercase"
                  >
                    ACCESS LEAK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`min-h-screen flex flex-col content-wrapper transition-all duration-500 ${
        !isScrolled && !isMobileMenuOpen ? 'pt-28' : 'pt-16'
      }`}>
        <div className="flex-1 max-w-6xl mx-auto px-6 py-8 relative z-10">
          {activeSection === 'about' ? (
            /* About Section */
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 title-stroke uppercase">
                  ABOUT
                </h2>
                <div className="w-24 h-1 bg-ifuno-green mx-auto"></div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-ifuno-pink">
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-xl text-gray-300 leading-relaxed mb-8">
                    IFUNO is all about showcasing music that isn't the most popular in the mainstream, 
                    but if you know, you know. We spotlight artists on their way to mass popularity 
                    and small artists with cult-like followings.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                      <p className="text-gray-300">
                        To discover and showcase the underground gems and rising stars before they hit the mainstream. 
                        We're here for the artists building devoted fanbases and creating authentic connections 
                        through their music.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">If You Know, You Know</h3>
                      <p className="text-gray-300">
                        From bedroom producers to street rappers, from indie darlings to experimental artists - 
                        we celebrate the music that moves culture from the ground up. The artists who matter 
                        to those who really listen.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-ifuno-pink">
                    <div className="text-center">
                      <p className="text-ifuno-green text-sm font-medium">
                        Discover • Support • Celebrate
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        For the culture, by the culture
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
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 title-stroke uppercase">
                  SHOP
                </h2>
                <div className="w-24 h-1 bg-ifuno-green mx-auto"></div>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-ifuno-pink">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <ShoppingBag className="w-16 h-16 text-ifuno-green mx-auto" />
                    <h3 className="text-3xl font-bold text-white">Coming Soon</h3>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                      We're working on bringing you exclusive merchandise, limited edition drops, 
                      and official gear from the underground artists and rising stars you need to know about.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-ifuno-green rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">Exclusive Drops</h4>
                      <p className="text-gray-300">
                        Limited edition merchandise from underground artists and rising stars, available only through IFUNO.
                      </p>
                    </div>
                    
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-ifuno-pink rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">Artist Collaborations</h4>
                      <p className="text-gray-300">
                        Official merchandise designed in collaboration with the artists building cult followings.
                      </p>
                    </div>
                    
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 bg-ifuno-green rounded-full flex items-center justify-center mx-auto">
                        <span className="text-black font-bold">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">Culture First</h4>
                      <p className="text-gray-300">
                        Supporting underground music culture with every purchase. If you know, you know.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-ifuno-pink">
                    <p className="text-gray-400">
                      Want to be notified when we launch? Follow us for updates on the latest drops.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Home/Leak Section - Music Releases */
            <div className="w-full">
              {/* Section Header - Centered */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 title-stroke uppercase">
                  {activeSection === 'home' ? 'LATEST RELEASES' : 'LEAK'}
                </h2>
                <div className="w-24 h-1 bg-ifuno-green mx-auto"></div>
              </div>

              {Object.keys(groupedItems).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {activeSection === 'home' ? 'No music releases found.' : 'No leaked content found.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedItems)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([date, items]) => (
                      <section key={date} className="space-y-6 w-full">
                        {/* Date Header - Centered with text stroke and much smaller text */}
                        <div className="text-center">
                          <h3 className="text-xs sm:text-sm font-bold text-white mb-2 title-stroke">
                            {formatDate(date)}
                          </h3>
                        </div>

                        {/* Music Grid with border */}
                        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-ifuno-pink">
                          <MusicGrid 
                            items={items} 
                            onItemClick={handleItemClick}
                            isUnreleased={activeSection === 'leak'}
                          />
                        </div>
                      </section>
                    ))}
                </div>
              )}

              {/* Pagination - Simplified with just arrows */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="flex items-center justify-center w-12 h-12 bg-ifuno-green border border-ifuno-green rounded-lg text-black hover:bg-ifuno-pink hover:border-ifuno-pink hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <span className="text-sm text-gray-400 px-4">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center justify-center w-12 h-12 bg-ifuno-green border border-ifuno-green rounded-lg text-black hover:bg-ifuno-pink hover:border-ifuno-pink hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Black Theme with centered text */}
        <footer className="border-t border-ifuno-pink bg-black/80 backdrop-blur-sm py-6 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-ifuno-green">
                <MapPin className="w-4 h-4" />
                <span>Worldwide</span>
              </div>
              <p className="text-ifuno-pink text-sm font-medium text-center uppercase">
                IF YOU KNOW, YOU KNOW
              </p>
              <p className="text-gray-500 text-xs">
                © 2024 IFUNO. All rights reserved.
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