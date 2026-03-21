import { useContent } from "@/hooks/use-content";
import { Brain, Lightbulb, MessageSquare, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function ContentDisplay() {
  const { data: contentItems, isLoading, error } = useContent();

  if (isLoading) {
    return (
      <div className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-ink/10 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-ink/10 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contentItems || contentItems.length === 0) {
    // Don't show the section if there's an error or no content
    return null;
  }

  // Get the latest content of each type
  const latestContent = contentItems.reduce((acc: Record<string, any>, item: any) => {
    if (!acc[item.type] || new Date(item.date) > new Date(acc[item.type].date)) {
      acc[item.type] = item;
    }
    return acc;
  }, {} as Record<string, any>);

  const contentTypes = [
    { type: 'thought', icon: Brain, title: 'Literary Thought' },
    { type: 'riddle', icon: Lightbulb, title: 'Literary Riddle' },
    { type: 'quote', icon: MessageSquare, title: 'Daily Quote' },
    { type: 'fact', icon: BookOpen, title: 'Literary Fact' },
  ];

  const displayContent = contentTypes
    .filter(({ type }) => latestContent[type])
    .slice(0, 2); // Show only 2 items

  if (displayContent.length === 0) return null;

  return (
    <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl text-ink font-bold mb-4">
          Literary <span className="italic text-gold font-light">Inspiration</span>
        </h2>
        <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
          Discover thoughts, riddles, and quotes curated by our literary community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayContent.map(({ type, icon: Icon, title }, index) => {
          const content = latestContent[type];
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white border border-ink/10 p-8 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-ink">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
                  <p className="font-accent text-xs text-gold uppercase tracking-widest">
                    {type}
                  </p>
                </div>
              </div>
              
              <h4 className="font-display text-lg font-bold text-ink mb-3">
                {content.title}
              </h4>
              
              <p className="font-body text-ink/70 mb-4 leading-relaxed">
                {content.content}
              </p>
              
              {content.answer && (
                <div className="bg-cream border border-ink/10 p-4 rounded-sm mb-4">
                  <p className="font-accent text-xs text-ink/60 uppercase tracking-widest mb-2">
                    Answer
                  </p>
                  <p className="font-body text-ink italic">
                    {content.answer}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <p className="font-accent text-ink/50">
                  By: <span className="text-ink">{content.author}</span>
                </p>
                <p className="font-accent text-ink/50">
                  {new Date(content.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
