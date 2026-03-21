import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, Users, MapPin } from "lucide-react";
import { useState } from "react";

const eventPhotos = [
  {
    id: 1,
    title: " LITERA Orientation Event",
    date: "March 15, 2026",
    location: "Main Auditorium",
    attendees: 45,
    image: "/images/orientation.jpeg",
    category: "Orientation"
  },
  {
    id: 2,
    title: " SEEKH Initiative Litera Activity Zone",
    date: "March 8, 2026",
    location: "Literary Café",
    attendees: 32,
    image: "/images/activity.jpeg",
    category: "Activity"
  },
  {
    id: 3,
    title: "Debate Competition 2025 (Lexicon Clash)",
    date: "March 1, 2026",
    location: "Seminar Hall",
    attendees: 80,
    image: "/images/debate.jpeg",
    category: "Debate"
  },
  {
    id: 5,
    title: "MUN Conference 2026",
    date: "February 15-17, 2026",
    location: "Conference Hall",
    attendees: 120,
    image: "/images/mun.jpeg",
    category: "Conference"
  },
  
];

export default function EventPhotoGallery() {
  // Duplicate photos for seamless scrolling
  const duplicatedPhotos = [...eventPhotos, ...eventPhotos];

  return (
    <section className="py-20 px-6 lg:px-8 bg-cream/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold"></div>
            <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase">Club Memories</span>
            <div className="w-12 h-px bg-gold"></div>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
            Event <span className="italic text-gold font-light">Gallery</span>
          </h2>
          
          <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
            Capturing moments from our literary adventures, debates, workshops, and community gatherings.
          </p>
        </div>

        {/* Photo Carousel */}
        <div className="relative">
          {/* Photo Container */}
          <div className="overflow-hidden mx-16">
            <motion.div
              animate={{ x: "-50%" }}
              transition={{ 
                duration: 20, 
                ease: "linear", 
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="flex gap-6"
            >
              {duplicatedPhotos.map((photo, index) => (
                <motion.div
                  key={`${photo.id}-${index}`}
                  whileHover={{ y: -10 }}
                  className="flex-none w-full md:w-1/2 lg:w-1/4"
                >
                  <div className="group relative overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-cream">
                        <h3 className="font-display text-lg font-bold mb-2">{photo.title}</h3>
                        
                        <div className="space-y-1 text-sm font-body text-cream/80">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gold" />
                            {photo.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gold" />
                            {photo.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 text-gold" />
                            {photo.attendees} attendees
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="inline-block px-2 py-1 bg-gold text-ink text-xs font-accent uppercase tracking-wider rounded">
                            {photo.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/events">
            <button className="px-8 py-4 border-2 border-gold text-gold font-accent text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all duration-300">
              View All Events
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
