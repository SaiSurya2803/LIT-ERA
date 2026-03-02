import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, MapPin, Users, Clock, ArrowRight, Filter, Search, Tag, Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventPhotosModal from "@/components/EventPhotosModal";

const allEvents = [
  {
    id: 12,
    title: "Model United Nations Conference 2026",
    date: "May 10-12, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "International Conference Center",
    attendees: 85,
    maxAttendees: 200,
    category: "MUN",
    description: "Join us for the most prestigious MUN conference of the year. Debate global issues, enhance diplomatic skills, and network with delegates from various institutions.",
    image: "https://picsum.photos/seed/mun-conference-2026/800/500.jpg",
    featured: true,
    registrationOpen: true,
    status: "upcoming",
    isMUN: true,
  },
  {
    id: 13,
    title: "Ignite: The Grand Kickoff",
    date: "January 5, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "Main Auditorium",
    attendees: 150,
    maxAttendees: 200,
    category: "Special Event",
    description: "An electrifying evening marking the grand launch of our literary club's most ambitious season yet. Experience performances, announcements, and the unveiling of our exclusive initiatives.",
    image: "https://picsum.photos/seed/ignite-grand-kickoff-2026/800/500.jpg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "https://picsum.photos/seed/ignite-1-2026/800/600.jpg",
      "https://picsum.photos/seed/ignite-2-2026/800/600.jpg",
      "https://picsum.photos/seed/ignite-3-2026/800/600.jpg",
      "https://picsum.photos/seed/ignite-4-2026/800/600.jpg",
      "https://picsum.photos/seed/ignite-5-2026/800/600.jpg"
    ]
  },
  {
    id: 14,
    title: "Lexicon Clash",
    date: "December 15, 2025",
    time: "5:00 PM - 8:00 PM",
    location: "Debate Hall",
    attendees: 80,
    maxAttendees: 100,
    category: "Debate",
    description: "An intense battle of words and wits where participants showcase their linguistic prowess in this ultimate vocabulary showdown.",
    image: "https://picsum.photos/seed/lexicon-clash-2025/800/500.jpg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "https://picsum.photos/seed/lexicon-1-2025/800/600.jpg",
      "https://picsum.photos/seed/lexicon-2-2025/800/600.jpg",
      "https://picsum.photos/seed/lexicon-3-2025/800/600.jpg",
      "https://picsum.photos/seed/lexicon-4-2025/800/600.jpg"
    ]
  },
  {
    id: 15,
    title: "Seekh",
    date: "November 20, 2025",
    time: "4:00 PM - 7:00 PM",
    location: "Library Conference Room",
    attendees: 45,
    maxAttendees: 60,
    category: "Project Expo",
    description: "A profound exploration of the art of learning and knowledge sharing through interactive workshops and literary discussions.",
    image: "https://picsum.photos/seed/seekh-2025/800/500.jpg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "https://picsum.photos/seed/seekh-1-2025/800/600.jpg",
      "https://picsum.photos/seed/seekh-2-2025/800/600.jpg",
      "https://picsum.photos/seed/seekh-3-2025/800/600.jpg",
      "https://picsum.photos/seed/seekh-4-2025/800/600.jpg",
      "https://picsum.photos/seed/seekh-5-2025/800/600.jpg",
      "https://picsum.photos/seed/seekh-6-2025/800/600.jpg"
    ]
  },
  {
    id: 16,
    title: "Litera Hangout",
    date: "October 15, 2025",
    time: "5:00 PM - 8:00 PM",
    location: "Student Lounge",
    attendees: 65,
    maxAttendees: 80,
    category: "Social",
    description: "A relaxed evening of literary conversations, book exchanges, and creative networking with fellow literature enthusiasts in a casual setting.",
    image: "https://picsum.photos/seed/litera-hangout-2025/800/500.jpg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "https://picsum.photos/seed/hangout-1-2025/800/600.jpg",
      "https://picsum.photos/seed/hangout-2-2025/800/600.jpg",
      "https://picsum.photos/seed/hangout-3-2025/800/600.jpg",
      "https://picsum.photos/seed/hangout-4-2025/800/600.jpg",
      "https://picsum.photos/seed/hangout-5-2025/800/600.jpg"
    ]
  },
  ];

const categories = ["All", "Debate", "Poetry", "Reading", "Writing", "Special Event", "Community", "Festival", "MUN", "Social"];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEvents = allEvents.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(event => event.status === "upcoming");
  const pastEvents = filteredEvents.filter(event => event.status === "done");

  const handleEventClick = (event: any) => {
    if (event.status === "done" && event.photos && event.photos.length > 0) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold"></div>
            <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase">Club Calendar</span>
            <div className="w-12 h-px bg-gold"></div>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink leading-[1.1] mb-6">
            Literary <span className="italic text-gold font-light">Events</span>
          </h1>
          
          <p className="font-body text-xl text-ink/70 leading-relaxed max-w-3xl mx-auto">
            Join us for engaging literary events, workshops, debates, and community gatherings. 
            Expand your horizons and connect with fellow literature enthusiasts.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-ink/20 focus:border-gold"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-ink text-cream hover:bg-gold hover:text-ink"
                    : "border-gold text-gold hover:bg-gold hover:text-ink"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="mb-20">
            <h2 className="font-display text-3xl font-bold text-ink mb-8 flex items-center gap-3">
              <Camera className="w-8 h-8 text-gold" />
              Our Events
              <span className="font-body text-lg text-ink/60 ml-3">({pastEvents.length})</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleEventClick(event)}
                  className={`group relative overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    event.photos && event.photos.length > 0 
                      ? 'cursor-pointer' 
                      : 'cursor-default'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {event.photos && event.photos.length > 0 && (
                      <div className="absolute top-4 right-4 bg-gold text-ink px-3 py-1 rounded-full text-xs font-accent uppercase tracking-wider flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {event.photos.length} Photos
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-gold text-ink text-xs font-accent uppercase tracking-wider rounded">
                          {event.category}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold mb-2">{event.title}</h3>
                      <p className="font-body text-cream/80 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-sm font-body text-cream/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gold" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold" />
                            {event.attendees} attended
                          </div>
                        </div>
                        
                        {event.photos && event.photos.length > 0 && (
                          <div className="text-right">
                            <span className="px-4 py-2 bg-gold text-ink text-sm font-accent uppercase tracking-wider rounded hover:bg-gold/80 transition-colors duration-300 inline-block">
                              View Photos
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Events */}
        <section className={pastEvents.length > 0 ? "mt-20" : ""}>
          <h2 className="font-display text-3xl font-bold text-ink mb-8">
            {selectedCategory === "All" && !searchTerm ? "Upcoming Events" : "Search Results"}
            <span className="font-body text-lg text-ink/60 ml-3">({upcomingEvents.length})</span>
          </h2>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-xl text-ink/60">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-ink/10 rounded-sm shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-cream text-ink text-xs font-accent uppercase tracking-wider rounded">
                        {event.category}
                      </span>
                      {event.featured && (
                        <span className="px-2 py-1 bg-gold/10 text-gold text-xs font-accent uppercase tracking-wider rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-display text-xl font-bold text-ink mb-2">{event.title}</h3>
                    <p className="font-body text-ink/70 mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="space-y-2 text-sm font-body text-ink/60 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gold" />
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                    
                    {event.isMUN ? (
                      <Link href="/mun">
                        <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-ink">
                          Details
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-ink">
                        Details
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Event Photos Modal */}
        <EventPhotosModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={selectedEvent}
        />
      </div>
    </div>
  );
}
