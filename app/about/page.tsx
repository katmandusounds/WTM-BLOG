'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Home as HomeIcon, Info } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll detection for navbar logo
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update page title
  useEffect(() => {
    document.title = 'IFUNO - About | UK Music Database';
  }, []);

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

      {/* Large Logo - Starts from very top, disappears on scroll */}
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? 'opacity-0 translate-y-[-30px] pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
          <img 
            src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
            alt="IFUNO Logo" 
            className="h-20 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Horizontal Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Left Side - Back to Main */}
            <div className="flex items-center space-x-6 justify-start">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="text-sm font-medium uppercase hidden sm:inline">HOME</span>
              </Link>
              
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-ifuno-green text-black">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">ABOUT</span>
              </div>
            </div>
            
            {/* Center - Logo (only visible when scrolled) */}
            <div className="flex justify-center">
              <div className={`transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
                  <img 
                    src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                    alt="IFUNO Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </Link>
              </div>
            </div>
            
            {/* Right Side - Other Pages */}
            <div className="flex items-center space-x-6 justify-end">
              <Link
                href="/shop"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200"
              >
                <span className="text-sm font-medium uppercase hidden sm:inline">SHOP</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`min-h-screen flex flex-col content-wrapper transition-all duration-500 ${
        !isScrolled && !isMobileMenuOpen ? 'pt-28' : 'pt-16'
      }`}>
        <div className="flex-1 max-w-6xl mx-auto px-6 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className={`transition-all duration-300 ${!isScrolled && !isMobileMenuOpen ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <img 
                  src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754" 
                  alt="IFUNO Logo" 
                  className="h-20 w-auto object-contain mx-auto mb-6"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 title-stroke uppercase">
                ABOUT
              </h1>
              <div className="w-24 h-1 bg-ifuno-green mx-auto opacity-50"></div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-ifuno-pink">
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  IFUNO is the UK's premier music discovery platform, spotlighting everything from underground talent to established legacy artists. 
                  We champion artists on their way to mass popularity, small acts with cult-like followings, 
                  and those who have shaped the UK music scene. If you're searching for what's next or honoring those who paved the way, 
                  you're in the right place.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                    <p className="text-gray-300">
                      To discover and showcase the underground gems and rising stars before they hit the mainstream. 
                      We're here for the artists building devoted fanbases and creating authentic connections 
                      through their music. From UK rap to UK drill, grime to underground - we cover it all.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">If You Know, You Know</h2>
                    <p className="text-gray-300">
                      From bedroom producers to street rappers, from indie darlings to experimental artists - 
                      we celebrate the music that moves culture from the ground up. The artists who matter 
                      to those who really listen. Updated daily with the latest releases, music videos, and exclusive content.
                    </p>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-ifuno-pink">
                  <div className="text-center">
                    <p className="text-ifuno-green text-sm font-medium">
                      Discover • Support • Celebrate
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      For the culture, by the culture - The biggest UK urban music database
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-ifuno-pink bg-black/80 backdrop-blur-sm py-6 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <p className="text-ifuno-pink text-sm font-medium uppercase">
                IF YOU KNOW, YOU KNOW
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
