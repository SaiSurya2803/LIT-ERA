import { Link } from "wouter";
import { BookOpen, Mail, MapPin, Phone, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-cream pt-20 pb-10 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative large quote mark */}
      <div className="absolute top-0 right-10 text-[20rem] font-display text-cream/5 leading-none select-none pointer-events-none">
        "
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink transition-colors duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none tracking-wider text-cream">LIT'ERA</span>
              <span className="font-accent text-[0.6rem] text-gold uppercase tracking-[0.2em] leading-none mt-1">Literature Club</span>
            </div>
          </Link>
          <p className="font-body text-cream/70 text-lg leading-relaxed italic mb-6">
            "Echoes between the lines." A community where words come alive and stories find their home.
          </p>
        </div>
        
        <div>
          <h4 className="font-accent text-gold text-sm tracking-[0.2em] uppercase mb-6">Explore</h4>
          <ul className="space-y-4 font-body text-lg">
            <li><Link href="/about" className="text-cream/70 hover:text-gold transition-colors">Our Story</Link></li>
            <li><Link href="/events" className="text-cream/70 hover:text-gold transition-colors">Upcoming Events</Link></li>
            <li><Link href="/contact" className="text-cream/70 hover:text-gold transition-colors">Get in Touch</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-accent text-gold text-sm tracking-[0.2em] uppercase mb-6">Activities</h4>
          <ul className="space-y-4 font-body text-lg">
            <li><Link href="/mun" className="text-cream/70 hover:text-gold transition-colors">Model UN</Link></li>
            <li><Link href="/magazine" className="text-cream/70 hover:text-gold transition-colors">Literary Magazine</Link></li>
            <li><Link href="/events" className="text-cream/70 hover:text-gold transition-colors">Literary Events</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-accent text-gold text-sm tracking-[0.2em] uppercase mb-6">Contact</h4>
          <ul className="space-y-4 font-body text-lg">
            <li className="flex items-start gap-3 text-cream/70">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
              <span>Gokaraju Lailavathi Engineering College,<br />GRIET Campus, Nizampet Road,<br />Bachupally, Kukatpally,<br />Hyderabad - 500090, Telangana, India.</span>
            </li>
            <li className="flex items-center gap-3 text-cream/70">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <a href="tel:+917013842994" className="hover:text-gold transition-colors">+91 7013842994</a>
            </li>
            <li className="flex items-center gap-3 text-cream/70">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <a href="mailto:litera@gmail.com" className="hover:text-gold transition-colors">litera@gmail.com</a>
            </li>
            <li className="flex items-center gap-3 text-cream/70">
              <Instagram className="w-5 h-5 text-gold shrink-0" />
              <a href="https://www.instagram.com/litera.official_glec/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">@litera.official_glec</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-accent text-xs tracking-widest text-cream/50 uppercase">
          &copy; {new Date().getFullYear()} LIT'ERA Club. All rights reserved.
        </p>
        <div className="font-body italic text-cream/50">
          Designed with elegance & passion.
        </div>
      </div>
    </footer>
  );
}
