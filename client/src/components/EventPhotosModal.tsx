import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Grid3x3, Maximize2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface EventPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    attendees: number;
    photos: string[];
  };
}

export default function EventPhotosModal({ isOpen, onClose, event }: EventPhotosModalProps) {
  const [currentView, setCurrentView] = useState<'grid' | 'single'>('grid');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentView('grid');
      setCurrentPhotoIndex(0);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const openSingleView = (index: number) => {
    setCurrentPhotoIndex(index);
    setCurrentView('single');
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < event.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (currentView === 'single') {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(1, scale * delta), 3);
      setScale(newScale);
      
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentView === 'single' && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      if (currentView === 'single') {
        setCurrentView('grid');
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        onClose();
      }
    }
    if (currentView === 'single') {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentView, currentPhotoIndex, scale]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-ink/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative bg-cream rounded-sm shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-ink text-cream p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-cream/20 text-cream rounded-full flex items-center justify-center hover:bg-gold hover:text-ink transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-12">
              <h2 className="font-display text-3xl font-bold mb-2">{event.title}</h2>
              <div className="flex items-center gap-6 text-sm font-body text-cream/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  {event.attendees} attendees
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div 
            className="relative bg-ink/10 overflow-auto p-6" 
            style={{ 
              height: event.photos.length > 6 
                ? 'calc(100vh - 200px)' 
                : event.photos.length > 3 
                  ? 'calc(100vh - 250px)' 
                  : 'calc(100vh - 300px)'
            }}
          >
            {/* Grid View */}
            {currentView === 'grid' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-auto p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                    <Grid3x3 className="w-6 h-6 text-gold" />
                    Photo Gallery ({event.photos.length} photos)
                  </h3>
                  <p className="font-body text-ink/60 text-sm">Click any photo to view full size</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openSingleView(index)}
                      className="aspect-[4/3] overflow-hidden rounded-sm shadow-lg hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-gold transition-all duration-300"
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-2 text-cream">
                          <p className="text-xs font-accent">Photo {index + 1}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Single Image View */}
            {currentView === 'single' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative h-full overflow-hidden bg-ink/5"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Back to Grid Button */}
                <button
                  onClick={() => {
                    setCurrentView('grid');
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="absolute top-4 left-4 z-20 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 shadow-2xl border-2 border-white"
                >
                  <Grid3x3 className="w-7 h-7" />
                </button>

                {/* Zoom Indicator */}
                <div className="absolute top-4 left-20 z-20 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-accent shadow-2xl border border-white">
                  {Math.round(scale * 100)}% • Scroll to zoom
                </div>

                {/* Image Container */}
                <div
                  ref={imageRef}
                  className="relative w-full h-full flex items-center justify-center cursor-move"
                  style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                >
                  <img
                    src={event.photos[currentPhotoIndex]}
                    alt={`Photo ${currentPhotoIndex + 1}`}
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                      transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                      transition: isDragging ? 'none' : 'transform 0.3s ease'
                    }}
                    draggable={false}
                  />
                </div>

                {/* Navigation Arrows */}
                {event.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-2 ${
                        currentPhotoIndex === 0
                          ? 'bg-gray-700 text-gray-300 cursor-not-allowed border-gray-400'
                          : 'bg-gray-900 text-white hover:bg-gray-800 border-white'
                      }`}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === event.photos.length - 1}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-2 ${
                        currentPhotoIndex === event.photos.length - 1
                          ? 'bg-gray-700 text-gray-300 cursor-not-allowed border-gray-400'
                          : 'bg-gray-900 text-white hover:bg-gray-800 border-white'
                      }`}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute bottom-4 right-4 bg-ink/80 text-cream px-3 py-1 rounded-full text-sm font-accent backdrop-blur-sm">
                  {currentPhotoIndex + 1} / {event.photos.length}
                </div>

                {/* Photo Info */}
                <div className="absolute bottom-4 left-4 bg-ink/80 text-cream px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="font-body text-sm">Photo {currentPhotoIndex + 1} of {event.photos.length}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-cream p-4 text-center">
            <p className="font-body text-ink/60 text-sm">
              {currentView === 'grid' 
                ? 'Click any photo to view full size • Press ESC to close'
                : 'Scroll to zoom • Drag to pan • Arrow keys to navigate • ESC for grid view'
              }
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
