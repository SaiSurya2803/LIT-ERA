import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-cream rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative h-48 md:h-64 bg-ink">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-cream/90 hover:bg-cream rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-ink" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3 py-1 bg-gold text-ink text-xs font-accent uppercase tracking-wider rounded mb-2">
                  {event.category}
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-cream">
                  {event.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {/* Event Info */}
              <div className="grid grid-cols-1 gap-4 mb-8 p-4 bg-white rounded-lg border border-ink/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-xs text-ink/60 font-accent uppercase">Date</p>
                    <p className="text-sm font-body text-ink">{event.date}</p>
                  </div>
                </div>
              </div>

              {/* Event Overview */}
              {event.overview && (
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gold rounded"></div>
                    Event Overview
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed whitespace-pre-line">
                    {event.overview}
                  </p>
                </div>
              )}

              {/* Structure & Execution */}
              {event.structure && (
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gold rounded"></div>
                    Structure & Execution
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed whitespace-pre-line">
                    {event.structure}
                  </p>
                </div>
              )}

              {/* Impact & Outcomes */}
              {event.impact && (
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gold rounded"></div>
                    Impact & Outcomes
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed whitespace-pre-line">
                    {event.impact}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
