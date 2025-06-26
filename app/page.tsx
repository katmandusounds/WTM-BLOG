'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import MusicGrid from '@/components/MusicGrid';
import VideoModal from '@/components/VideoModal';

interface MusicItem {
  type: 'youtube_video' | 'spotify_topic';
  artist: string;
  title: string;
  thumbnail_url: string;
  embed_url: string;
}

interface MusicData {
  [date: string]: MusicItem[];
}

export default function Home() {
  const [musicData, setMusicData] = useState<MusicData>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MusicItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Flatten all items with their dates for pagination
  const allItems = Object.entries(musicData).flatMap(([date, items]) =>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading music releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1"></div>
            <div className="flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                WTM
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="text-sm text-gray-400">
                {allItems.length} releases
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No music releases found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedItems)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, items]) => (
                <section key={date} className="space-y-6">
                  {/* Date Header */}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      {formatDate(date)}
                    </h2>
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
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <span className="text-sm text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
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