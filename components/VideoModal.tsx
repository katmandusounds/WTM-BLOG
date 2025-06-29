'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: string;
  title: string;
  embedUrl: string;
  thumbnailUrl: string;
}

export default function VideoModal({ 
  isOpen, 
  onClose, 
  artist, 
  title, 
  embedUrl, 
  thumbnailUrl 
}: VideoModalProps) {
  const cleanTitle = (title: string) => {
    // Remove leading dash and trim whitespace
    return title.replace(/^-\s*/, '').trim();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">{artist}</h2>
            <p className="text-sm sm:text-base text-gray-300">{cleanTitle(title)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {embedUrl ? (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={`${artist} - ${cleanTitle(title)}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={thumbnailUrl}
                  alt={`${artist} - ${cleanTitle(title)}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-400 text-center">No video available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}