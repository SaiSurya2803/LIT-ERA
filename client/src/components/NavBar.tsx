import { Link, useLocation } from "wouter";
import { Menu, X, User as UserIcon, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import GuidelinesModal from "@/components/GuidelinesModal";

export function NavBar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const logout = useLogout();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "MUN", path: "/mun" },
    { name: "Events", path: "/events" },
    { name: "Magazine", path: "/magazine" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-cream/90 backdrop-blur-md shadow-sm py-4 border-b border-gold/20" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setGuidelinesOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center overflow-hidden group-hover:bg-cream transition-colors duration-300">
            <img
              src="/images/logo.png"
              alt="LIT'ERA logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl leading-none tracking-wider text-ink">
              LIT'ERA
            </span>
            <span className="font-accent text-[0.6rem] text-gold uppercase tracking-[0.2em] leading-none mt-1">
              Literature Club
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`font-accent text-sm uppercase tracking-widest transition-colors duration-200 hover:text-gold ${
                  isActive ? "text-gold font-semibold" : "text-ink"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="w-px h-6 bg-ink/20 mx-2"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-ink font-body italic">
                <UserIcon className="w-4 h-4 text-gold" />
                <span>{user.name}</span>
              </div>
              {isAdmin && (
                <Link 
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-ink font-accent text-[0.7rem] uppercase tracking-widest hover:bg-ink hover:text-cream transition-all duration-300 rounded-sm"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <button
                onClick={() => logout.mutate()}
                className="font-accent text-[0.7rem] uppercase tracking-widest text-ink/70 hover:text-gold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="px-5 py-2 border border-ink text-ink font-accent text-xs uppercase tracking-widest hover:bg-ink hover:text-cream transition-all duration-300"
            >
              Join Us
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-ink"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-cream border-b border-gold/20 shadow-lg py-6 px-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-accent text-base uppercase tracking-widest transition-colors duration-200 ${
                  location === link.path ? "text-gold font-semibold" : "text-ink"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link 
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-accent text-base uppercase tracking-widest text-gold flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <div className="h-px w-full bg-ink/10 my-2"></div>
            {user ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-ink font-body italic">
                  <UserIcon className="w-4 h-4 text-gold" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout.mutate();
                  }}
                  className="font-accent text-xs uppercase tracking-widest text-ink/70"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block text-center px-5 py-3 bg-ink text-cream font-accent text-sm uppercase tracking-widest"
              >
                Join Us
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guidelines Modal */}
      <GuidelinesModal isOpen={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </header>
  );
}
