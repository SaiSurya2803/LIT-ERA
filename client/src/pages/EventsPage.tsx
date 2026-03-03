import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, Camera, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventPhotosModal from "@/components/EventPhotosModal";
import EventDetailsModal from "@/components/EventDetailsModal";

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
    overview: "The Model United Nations Conference 2026 brings together aspiring diplomats and global leaders to simulate UN proceedings and debate pressing international issues.",
    structure: "Three-day conference featuring committee sessions, crisis simulations, keynote speeches, and networking events. Delegates represent different countries and work collaboratively to draft resolutions.",
    impact: "Participants develop critical thinking, public speaking, and negotiation skills while gaining deeper understanding of global affairs and international relations."
  },
  {
    id: 13,
    title: "Ignite: The Grand Kickoff",
    date: "January 5, 2026",
    location: "Main Auditorium",
    category: "Special Event",
    description: "An electrifying evening marking the grand launch of our literary club's most ambitious season yet. Experience performances, announcements, and the unveiling of our exclusive initiatives.",
    image: "/images/orientation.jpeg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "/images/orientation2.jpeg",
      "/images/orientation3.jpeg",
      "/images/orientation.jpeg",
      "/images/orientation4.jpeg",
    ],
    overview: "The LITERA Orientation Event marked the official commencement of the club's activities for the academic year. It was organized to introduce students to the club's objectives, structure, and planned initiatives. The event aimed to create awareness, build enthusiasm, and establish a strong foundation for the functioning of the club.",
    structure: "The programme began with a welcome address by the club leadership, followed by a presentation outlining the club's vision, goals, and upcoming activities. An official poster unveiling symbolically marked the launch of the club for the year. Faculty members and student leaders addressed the gathering, providing guidance and motivation. The session concluded with interaction and clarification regarding member participation and roles.",
    impact: "The orientation successfully increased student awareness and interest in the club's initiatives. Participants gained clarity about membership expectations and opportunities for involvement. The event fostered unity, enthusiasm, and a clear sense of direction, establishing a structured and motivated beginning for the academic year."
  },
  {
    id: 14,
    title: "Lexicon Clash",
    date: "December 15, 2025",
    category: "Debate",
    description: "An intense battle of words and wits where participants showcase their linguistic prowess in this ultimate vocabulary showdown.",
    image: "/images/debate3.jpeg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "/images/debate2.jpeg",
      "/images/debate.jpeg",
      "/images/debate4.jpeg",
      "/images/debate5.jpeg",
      "/images/debate6.jpeg",
      "/images/debate7.jpeg",
      "/images/debate3.jpeg",
    ],
    overview: "Lexicon Clash, the Inter-Departmental Debate Competition organized by LITERA, was conducted to promote structured academic discourse and intellectual engagement among students. The event brought together participants from various departments to deliberate on contemporary and thought-provoking topics.",
    structure: "The competition was conducted in multiple rounds, beginning with preliminary sessions and culminating in a final round judged by faculty members. Teams presented arguments and rebuttals in a structured format, adhering to time limits and evaluation criteria. Judges assessed participants based on content, clarity, confidence, and teamwork before announcing the winners.",
    impact: "The competition significantly enhanced participants' public speaking, analytical reasoning, and argumentation skills. It encouraged respectful dialogue and strengthened inter-departmental interaction. The event also helped identify students with strong communication and leadership potential, reinforcing the club's commitment to academic excellence."
  },
  {
    id: 15,
    title: "Seekh",
    date: "November 20, 2025",
    category: "Project Expo",
    description: "A profound exploration of the art of learning and knowledge sharing through interactive workshops and literary discussions.",
    image: "/images/activity.jpeg",
    featured: false,
    registrationOpen: false,
    status: "done",
    photos: [
      "/images/activity3.jpeg",
      "/images/activity7.jpeg",
      "/images/activity4.jpeg",
      "/images/activity5.jpeg",
      "/images/activity6.jpeg",
      "/images/activity.jpeg",
      "/images/activity2.jpeg"
    ],
    overview: "As part of the SEEKH Initiative, LITERA set up a dedicated Activity Zone to contribute a creative and interactive dimension to the campus-wide event. The objective was to provide students with an engaging space that combined recreation with literary and cognitive skill-building activities.",
    structure: "The club organized three stalls featuring a variety of interactive activities such as word-based challenges, logical puzzles, and creative exercises. The stalls were managed by volunteers who guided participants and ensured smooth coordination throughout the day. Attractive displays, structured activity rules, and small incentives encouraged consistent participation and interaction among students.",
    impact: "The activity zone witnessed continuous student participation and positive engagement. It enhanced creative thinking, collaboration, and quick reasoning skills among participants. The event also strengthened the visibility and recognition of LITERA within the campus community, reflecting its active contribution to academic and co-curricular development."
  },
  ];

const categories = ["All", "Debate", "Poetry", "Reading", "Writing", "Special Event", "Community", "Festival", "MUN", "Social"];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const handleAboutClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEventDetails(event);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEventDetails(null);
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent">
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
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => handleAboutClick(event, e)}
                            className="px-4 py-2 bg-gold text-ink text-sm font-accent uppercase tracking-wider rounded hover:bg-gold/80 transition-colors duration-300"
                          >
                            About
                          </button>
                          {event.photos && event.photos.length > 0 && (
                            <span className="px-4 py-2 bg-gold text-ink text-sm font-accent uppercase tracking-wider rounded hover:bg-gold/80 transition-colors duration-300 inline-block text-center">
                              View Photos
                            </span>
                          )}
                        </div>
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

        {/* Event Details Modal */}
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          event={selectedEventDetails}
        />
      </div>
    </div>
  );
}
