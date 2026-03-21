import { motion } from "framer-motion";

export function AnimatedBookshelf() {
  return (
    <div className="relative w-full max-w-md mx-auto h-[450px] flex items-end justify-center">
      {/* Shelf */}
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-r from-[#8b4513] to-[#5c2e0b] rounded-sm shadow-xl shadow-ink/30 z-10"></div>
      
      {/* Books */}
      <div className="relative w-full h-full z-20 flex items-end justify-center gap-2 px-10 pb-4">
        
        {/* Book 1 */}
        <motion.div 
          className="relative w-16 h-64 bg-ink rounded-sm shadow-lg border-l-4 border-gold/40 transform origin-bottom cursor-pointer"
          initial={{ rotate: -5, y: 0 }}
          animate={{ rotate: [-5, -7, -5], y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ 
            y: -25, 
            rotate: 0, 
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 w-max text-gold font-display text-sm tracking-widest whitespace-nowrap font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.85)] z-10">
            Harry Potter 
          </div>
        </motion.div>

        {/* Book 2 */}
        <motion.div 
          className="relative w-14 h-56 bg-rust rounded-sm shadow-lg border-l-4 border-gold/30 transform origin-bottom cursor-pointer"
          initial={{ rotate: 2, y: 0 }}
          animate={{ rotate: [2, 4, 2], y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          whileHover={{ 
            y: -25, 
            rotate: 0, 
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 w-max text-cream font-display text-xs tracking-widest whitespace-nowrap font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.75)] z-10">
            The Hunger Games
          </div>
        </motion.div>

        {/* Book 3 */}
        <motion.div 
          className="relative w-20 h-72 bg-[#2d3748] rounded-sm shadow-lg border-l-4 border-gold/50 transform origin-bottom cursor-pointer"
          initial={{ rotate: 8, y: 0 }}
          animate={{ rotate: [8, 6, 8], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          whileHover={{ 
            y: -25, 
            rotate: 0, 
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 w-max text-gold font-display text-sm tracking-widest whitespace-nowrap font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.85)] z-10">
            The Hobbit
          </div>
        </motion.div>

        {/* Book 4 (Leaning) */}
        <motion.div 
          className="relative w-12 h-60 bg-sage rounded-sm shadow-lg border-l-2 border-cream/20 transform origin-bottom cursor-pointer"
          initial={{ rotate: 18, x: 10 }}
          whileHover={{ 
            rotate: 0, 
            y: -15, 
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 w-max text-ink font-accent text-xs tracking-widest whitespace-nowrap font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.85)] z-10">
          Jane Eyre
          </div>
        </motion.div>
        
      </div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl z-0"></div>
    </div>
  );
}
