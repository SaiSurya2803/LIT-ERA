import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Book, Feather, Users, Sparkles } from "lucide-react";
import { AnimatedBookshelf } from "@/components/AnimatedBookshelf";
import EventPhotoGallery from "@/components/EventPhotoGallery";
import { ContentDisplay } from "@/components/ContentDisplay";
import { useContent } from "@/hooks/use-content";

export default function Home() {
  const { data: contentItems = [] } = useContent();
  
  // Get ALL active content for scrolling banner (all types)
  const scrollingContent = contentItems
    .filter(item => item.isActive)
    .map(item => item.content)
    .slice(0, 10); // Limit to 10 items
  
  // Fallback content if no content in database
  const defaultContent = [
    "A reader lives a thousand lives before he dies.",
    "There is no friend as loyal as a book.",
    "Words are, in my not-so-humble opinion, our most inexhaustible source of magic."
  ];
  
  const displayQuotes = scrollingContent.length > 0 ? scrollingContent : defaultContent;
  
  // Debug: Log to console
  console.log('Content Items:', contentItems);
  console.log('Scrolling Content:', scrollingContent);
  console.log('Display Quotes:', displayQuotes);
  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden px-6 lg:px-8">
        {/* Optional background video - obscured slightly by a gradient wash */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-10"
          >
            <source src="/images/sea.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/40"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold"></div>
              <span className="font-accent text-gold text-sm tracking-[0.3em] uppercase">Est. 2024</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[1.1] mb-6">
              Echoes Between <br />
              <span className="italic text-gold font-light">the Lines.</span>
            </h1>
            
            <p className="font-body text-xl text-ink/70 leading-relaxed mb-10 max-w-lg">
              A sophisticated sanctuary for minds that wander through pages. Join us in exploring literature, art, and the boundless realms of imagination.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <Link 
                href="/login"
                className="group relative px-8 py-4 bg-ink text-cream font-accent text-sm tracking-[0.2em] uppercase overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-ink transition-colors duration-300">
                  Join the Club <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              
              <Link 
                href="/about"
                className="font-body text-lg italic text-ink hover:text-gold transition-colors duration-300 flex items-center gap-2"
              >
                Discover our story
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <AnimatedBookshelf />
          </motion.div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-gold py-6 overflow-hidden flex whitespace-nowrap border-y border-ink/10">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="flex gap-12 text-ink font-display text-xl md:text-2xl italic tracking-wider"
        >
          {/* First set of quotes */}
          {displayQuotes.map((quote, index) => (
            <span key={`quote-1-${index}`}>
              {index > 0 && <span className="opacity-50 mr-12">•</span>}
              "{quote}"
            </span>
          ))}
          <span className="opacity-50 mx-12">•</span>
          {/* Duplicate for seamless looping */}
          {displayQuotes.map((quote, index) => (
            <span key={`quote-2-${index}`}>
              {index > 0 && <span className="opacity-50 mr-12">•</span>}
              "{quote}"
            </span>
          ))}
        </motion.div>
      </section>

      {/* Event Photo Gallery */}
      <EventPhotoGallery />

      {/* Content Display Section */}
      <ContentDisplay />

      {/* Events/Activities Teaser */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-ink font-bold mb-4">Literary <span className="italic text-gold font-light">Activities</span></h2>
          <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">Discover our vibrant literary activities and events designed to nurture your creative journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Literary Events", icon: Book, desc: "Join our exciting literary events and workshops.", link: "/events" },
            { title: "Model UN", icon: Users, desc: "Develop diplomatic skills through Model United Nations.", link: "/mun" },
            { title: "Magazine", icon: Feather, desc: "Share your creative writing in our literary magazine.", link: "/magazine" },
            { title: "Community", icon: Sparkles, desc: "Connect with fellow literature enthusiasts.", link: "/contact" },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="bg-white p-8 border border-ink/5 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-300 group rounded-sm"
            >
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-ink transition-colors duration-300">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">{feature.title}</h3>
              <p className="font-body text-ink/70 mb-6">{feature.desc}</p>
              <Link href={feature.link} className="font-accent text-xs tracking-widest text-gold uppercase flex items-center gap-2 group-hover:text-ink transition-colors">
                Explore <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
