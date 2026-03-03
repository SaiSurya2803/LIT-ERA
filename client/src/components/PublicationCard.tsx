import { motion } from "framer-motion";
import { Calendar, User, Download, Eye, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PublicationCardProps {
  publication: any;
  index: number;
  onDownload: (pdfFile: string | null, fileName: string | null) => void;
  onView: (id: number, pdfFile: string | null) => void;
  onLike: (id: number) => void;
}

export default function PublicationCard({
  publication,
  index,
  onDownload,
  onView,
  onLike,
}: PublicationCardProps) {
  const isArticle = publication.category === 'article';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        y: -12, 
        scale: 1.03,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group"
    >
      <Card className="bg-cream border-ink/10 overflow-hidden h-full hover:shadow-2xl transition-all duration-300 transform-gpu">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={publication.image} 
            alt={publication.title}
            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-150 ease-out"
          />
          {publication.featured && (
            <div className="absolute top-4 right-4 bg-gold text-ink px-3 py-1 rounded-full text-xs font-accent uppercase tracking-widest">
              Featured
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-accent text-gold uppercase tracking-widest">
              {publication.type}
            </span>
            {publication.pages && (
              <span className="text-xs text-ink/60">
                {publication.pages} pages
              </span>
            )}
          </div>
          <h3 className="font-display text-xl font-bold text-ink mb-2 group-hover:text-gold transition-colors">
            {publication.title}
          </h3>
          {publication.description && (
            <p className="font-body text-ink/70 text-sm mb-4 line-clamp-2">
              {publication.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-ink/60 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {publication.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {publication.date}
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-xs text-ink/60">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {publication.views || 0}
              </div>
              {!isArticle && (
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {publication.downloads || 0}
                </div>
              )}
              <button 
                onClick={() => onLike(publication.id)} 
                className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer" 
                title="Like this publication"
              >
                <Heart className="w-3 h-3" />
                {publication.likes || 0}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {publication.pdfFile ? (
              <a 
                href={publication.pdfFile} 
                download={publication.pdfFileName || 'publication.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-ink text-cream font-accent text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all shadow-sm inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium min-h-8"
              >
                <Download className="w-3 h-3" />
                Download
              </a>
            ) : (
              <Button 
                size="sm" 
                className="flex-1 bg-ink text-cream font-accent text-xs uppercase tracking-widest hover:bg-gold hover:text-ink transition-all shadow-sm opacity-50 cursor-not-allowed"
                disabled
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              className="border-ink text-ink font-accent text-xs uppercase tracking-widest hover:bg-ink hover:text-cream transition-all shadow-sm"
              onClick={() => onView(publication.id, publication.pdfFile)}
              disabled={!publication.pdfFile}
              title="View PDF"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
