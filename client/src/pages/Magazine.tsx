import { motion } from "framer-motion";
import { FileText, BookOpen, Newspaper, Plus, Search, Heart, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import SubmissionModal from "@/components/SubmissionModal";
import MagazineGuidelinesModal from "@/components/MagazineGuidelinesModal";
import { usePublications } from "@/hooks/use-publications";

export default function Magazine() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [magazineLikes, setMagazineLikes] = useState(0);
  const [localPublications, setLocalPublications] = useState<any[]>([]);

  const { data: publicationsFromDB = [], isLoading, refetch } = usePublications();

  useEffect(() => {
    const handleOpenSubmission = () => setSubmissionOpen(true);
    window.addEventListener('openSubmissionModal', handleOpenSubmission);
    return () => window.removeEventListener('openSubmissionModal', handleOpenSubmission);
  }, []);

  // All PDFs served from /publications/ (static, bundled into dist/public via client/public/)
  const fallbackPublications = [
    {
      id: 18,
      title: "Litera Club Newsletter",
      category: "Magazine",
      author: "Litera Club",
      date: "March 25, 2026",
      description: "The official newsletter of the Litera Club, featuring literary news, updates, and more.",
      image: "https://picsum.photos/seed/litera-newsletter/400/300.jpg",
      type: "Magazine",
      pages: 1,
      downloads: 12,
      views: 45,
      likes: 8,
      featured: true,
      pdfFile: "/publications/Litera-Club-Newsletter.pdf",
      pdfFileName: "Litera-Club-Newsletter.pdf"
    },
    {
      id: 1,
      title: "19th Year on Earth",
      category: "Book",
      author: "Yashwanth Rishindra",
      date: "January 11, 2026",
      description: "The 19th year on Earth represents a critical bridge between adolescence and adulthood, often characterized by intense personal growth, self-discovery, and significant life shifts.",
      image: "https://m.media-amazon.com/images/I/61WYKDK6nSL._UF1000,1000_QL80_.jpg",
      type: "Book",
      pages: 24,
      downloads: 234,
      views: 892,
      likes: 67,
      featured: true,
      pdfFile: "/publications/19th-Year-on-Earth.pdf",
      pdfFileName: "19th-Year-on-Earth.pdf"
    },
    {
      id: 2,
      title: "You Just Made My Day",
      category: "Story",
      author: "Pooja Sirasala",
      date: "December 5, 2025",
      description: "A heartwarming short story about small acts of kindness.",
      image: "https://picsum.photos/seed/you-made-my-day/400/300.jpg",
      type: "Story",
      pages: 1,
      downloads: 67,
      views: 234,
      likes: 43,
      featured: false,
      pdfFile: "/publications/You Just Made My Day Short Story- Pooja Sirasala.pdf",
      pdfFileName: "You-Just-Made-My-Day.pdf"
    },
    {
      id: 3,
      title: "Unipath",
      category: "Poem",
      author: "Pranathi Chitte",
      date: "December 10, 2025",
      description: "A poem about finding your unique journey in life.",
      image: "https://picsum.photos/seed/unipath-journey/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 45,
      views: 156,
      likes: 29,
      featured: false,
      pdfFile: "/publications/Unipath - Pranathi Chitte.pdf",
      pdfFileName: "Unipath-Pranathi-Chitte.pdf"
    },
    {
      id: 4,
      title: "Turning Point",
      category: "Article",
      author: "N SADHRIKA",
      date: "December 2, 2025",
      description: "An article exploring life's pivotal moments and how they shape us.",
      image: "https://picsum.photos/seed/turning-point/400/300.jpg",
      type: "Article",
      pages: 4,
      downloads: 89,
      views: 234,
      likes: 54,
      featured: false,
      pdfFile: "/publications/Turning point - N SADHRIKA.pdf",
      pdfFileName: "Turning-Point-N-SADHRIKA.pdf"
    },
    {
      id: 5,
      title: "The Summit",
      category: "Story",
      author: "Sri Charan Kota",
      date: "December 4, 2025",
      description: "A compelling story of ambition, perseverance, and reaching new heights.",
      image: "https://picsum.photos/seed/the-summit/400/300.jpg",
      type: "Story",
      pages: 2,
      downloads: 178,
      views: 445,
      likes: 89,
      featured: false,
      pdfFile: "/publications/The Summit- sri charan kota.pdf",
      pdfFileName: "The-Summit-Sri-Charan-Kota.pdf"
    },
    {
      id: 6,
      title: "The Courage to Be Delulu",
      category: "Poem",
      author: "Vineetha N",
      date: "December 17, 2025",
      description: "A bold poem celebrating the courage to dream beyond reason.",
      image: "https://picsum.photos/seed/courage-delulu/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 34,
      views: 189,
      likes: 23,
      featured: false,
      pdfFile: "/publications/The Courage to Be Delulu - VINEETHA N.pdf",
      pdfFileName: "The-Courage-to-Be-Delulu-VINEETHA-N.pdf"
    },
    {
      id: 7,
      title: "The Chapter I'm in",
      category: "Poem",
      author: "Shaik Azra",
      date: "December 2, 2025",
      description: "A reflective poem about the current chapter of life.",
      image: "https://picsum.photos/seed/chapter-im-in/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 28,
      views: 89,
      likes: 18,
      featured: false,
      pdfFile: "/publications/The Chapter I'm in - Shaik Azra.pdf",
      pdfFileName: "The-Chapter-Im-in-Shaik-Azra.pdf"
    },
    {
      id: 8,
      title: "Fire In Every Footstep",
      category: "Poem",
      author: "Yasaswy Potturi",
      date: "December 11, 2025",
      description: "A fiery poem about passion and determination in every step.",
      image: "https://picsum.photos/seed/poem-collection/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 92,
      views: 167,
      likes: 45,
      featured: false,
      pdfFile: "/publications/Poem - Yasaswy Potturi.pdf",
      pdfFileName: "Poem-Collection-Yasaswy-Potturi.pdf"
    },
    {
      id: 9,
      title: "A Fresh Start",
      category: "Poem",
      author: "Pranavi",
      date: "December 7, 2025",
      description: "A poem about new beginnings and the hope they bring.",
      image: "https://picsum.photos/seed/literary-voices/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 156,
      views: 445,
      likes: 78,
      featured: false,
      pdfFile: "/publications/A Fresh Start- Pranavi.pdf",
      pdfFileName: "A Fresh Start- Pranavi.pdf"
    },
    {
      id: 10,
      title: "Am I really an Engineer",
      category: "Poem",
      author: "Rohith Mangamuri",
      date: "December 17, 2025",
      description: "A humorous yet introspective poem about engineering student life.",
      image: "https://picsum.photos/seed/campus-chronicles/400/300.jpg",
      type: "Poem",
      pages: 2,
      downloads: 89,
      views: 234,
      likes: 34,
      featured: false,
      pdfFile: "/publications/Am I really an Engineer - Rohith Mangamuri.pdf",
      pdfFileName: "Am-I-really-an-Engineer-Rohith-Mangamuri.pdf"
    },
    {
      id: 11,
      title: "Are You Niche or Performative",
      category: "Poem",
      author: "Ikshita",
      date: "December 17, 2025",
      description: "A thought-provoking poem questioning authenticity in creative expression.",
      image: "https://picsum.photos/seed/digital-poetry-review/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 45,
      views: 123,
      likes: 28,
      featured: false,
      pdfFile: "/publications/Are You Niche or Performative - Ikshita.pdf",
      pdfFileName: "Are You Niche or Performative - Ikshita.pdf"
    },
    {
      id: 12,
      title: "Before the next bomb falls",
      category: "Poem",
      author: "Tasneem Firdous",
      date: "December 7, 2025",
      description: "A powerful poem about peace, loss, and the fragility of life.",
      image: "https://picsum.photos/seed/creative-writing-workshop/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 67,
      views: 189,
      likes: 41,
      featured: false,
      pdfFile: "/publications/Before the next bomb falls - Tasneem Firdous.pdf",
      pdfFileName: "Before the next bomb falls - Tasneem Firdous.pdf"
    },
    {
      id: 13,
      title: "Being vs Doing",
      category: "Poem",
      author: "Sheripally Rakesh Goud",
      date: "December 17, 2025",
      description: "A philosophical poem exploring the tension between existence and action.",
      image: "https://picsum.photos/seed/annual-literary-awards/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 234,
      views: 567,
      likes: 89,
      featured: false,
      pdfFile: "/publications/Being vs Doing- sheripally Rakesh Goud.pdf",
      pdfFileName: "Being vs Doing- sheripally Rakesh Goud.pdf"
    },
    {
      id: 14,
      title: "Celestial Serenade",
      category: "Poem",
      author: "Dhruu",
      date: "December 17, 2025",
      description: "A lyrical poem inspired by the cosmos and the music of the universe.",
      image: "https://picsum.photos/seed/research-symposium/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 78,
      views: 234,
      likes: 56,
      featured: false,
      pdfFile: "/publications/Celestial Serenade - Dhruu.pdf",
      pdfFileName: "Celestial-Serenade - Dhruu.pdf"
    },
    {
      id: 15,
      title: "The Weight of Packed Bags",
      category: "Article",
      author: "Asiya Beig",
      date: "December 17, 2025",
      description: "An evocative article about travel, departure, and the emotions of leaving home.",
      image: "https://picsum.photos/seed/student-spotlight/400/300.jpg",
      type: "Article",
      pages: 2,
      downloads: 145,
      views: 389,
      likes: 67,
      featured: false,
      pdfFile: "/publications/Document from Asiyabeig - Asiya Beig.pdf",
      pdfFileName: "Document from Asiyabeig - Asiya Beig.pdf"
    },
    {
      id: 16,
      title: "Finding yourself",
      category: "Article",
      author: "Sasamrutha Moganti",
      date: "December 8, 2025",
      description: "An introspective article on the journey of self-discovery.",
      image: "https://picsum.photos/seed/poetry-slam-results/400/300.jpg",
      type: "Article",
      pages: 1,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFile: "/publications/Finding yourself - Sasamrutha Moganti.pdf",
      pdfFileName: "Finding yourself - Sasamrutha Moganti.pdf"
    },
    {
      id: 17,
      title: "Part",
      category: "Story",
      author: "Chikkam Radhakrishna",
      date: "December 2, 2025",
      description: "A short story about the parts we play in each other's lives.",
      image: "https://picsum.photos/seed/poetry-slam-results2/400/300.jpg",
      type: "Story",
      pages: 2,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFile: "/publications/Part - Chikkam Radhakrishna.pdf",
      pdfFileName: "Part - Chikkam Radhakrishna.pdf"
    }
  ];

  const categories = [
    { id: "all", name: "All Publications", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Book", name: "Books", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Story", name: "Stories", icon: <FileText className="w-4 h-4" /> },
    { id: "Poem", name: "Poems", icon: <FileText className="w-4 h-4" /> },
    { id: "Article", name: "Articles", icon: <FileText className="w-4 h-4" /> },
    { id: "Magazine", name: "Magazine", icon: <Newspaper className="w-4 h-4" /> },
  ];

  const mapPublication = (pub: any) => ({
    id: pub.id,
    title: pub.title,
    category: pub.category,
    author: pub.author,
    date: pub.publishDate || pub.date || "2026",
    description: pub.description,
    image: pub.coverImage || pub.image || `https://picsum.photos/seed/${pub.id}/400/300.jpg`,
    type: pub.type || pub.category || "Publication",
    pages: pub.pages || 1,
    downloads: pub.downloads || 0,
    views: pub.views || 0,
    likes: pub.likes || 0,
    featured: !!pub.featured,
    pdfFile: pub.pdfFile || null,
    pdfFileName: pub.pdfFileName || null
  });

  useEffect(() => {
    const rawList = publicationsFromDB.length > 0 ? publicationsFromDB : fallbackPublications;
    setLocalPublications(rawList.map(mapPublication));
  }, [publicationsFromDB]);

  const filteredPublications = localPublications.filter((pub: any) => {
    const matchesCategory = selectedCategory === "all" || pub.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      pub.title.toLowerCase().includes(q) ||
      pub.author.toLowerCase().includes(q) ||
      (pub.description || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleView = (id: number, pdfFile: string | null) => {
    if (!pdfFile) {
      alert("PDF not available for this publication.");
      return;
    }
    // Update local view count
    setLocalPublications(prev =>
      prev.map(pub => pub.id === id ? { ...pub, views: pub.views + 1 } : pub)
    );
    window.open(pdfFile, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (id: number, pdfFile: string | null, fileName: string | null) => {
    if (!pdfFile) {
      alert("PDF not available for this publication.");
      return;
    }
    // Update local download count
    setLocalPublications(prev =>
      prev.map(pub => pub.id === id ? { ...pub, downloads: pub.downloads + 1 } : pub)
    );
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = fileName || "publication.pdf";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = (id: number) => {
    setLocalPublications(prev =>
      prev.map(pub => pub.id === id ? { ...pub, likes: pub.likes + 1 } : pub)
    );
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gold text-ink flex items-center justify-center rounded-full mx-auto mb-6">
              <Newspaper className="w-10 h-10" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              LIT'ERA Magazine
            </h1>
            <p className="font-accent text-xl text-gold tracking-widest uppercase mb-6">
              Literary Publications & Creative Works
            </p>
            <p className="font-body text-ink/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our collection of books, stories, poems, and articles. Discover the voices of our literary community.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                className="!bg-gold !text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:!bg-ink hover:!text-cream transition-all"
                onClick={() => setSubmissionOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Your Work
              </Button>
              <Button
                className="bg-white text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:bg-ink hover:text-cream transition-all border border-ink/20"
                onClick={() => setMagazineLikes(p => p + 1)}
              >
                <Heart className="w-4 h-4 mr-2" />
                Like Magazine {magazineLikes > 0 && `(${magazineLikes})`}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filter & Search */}
      <section className="py-8 px-6 bg-white border-y border-ink/10">
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-6 lg:gap-8">
          <div className="w-full sm:w-96 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                placeholder="Search by title, author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-ink/20 bg-cream focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 font-accent text-xs tracking-widest uppercase transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? "bg-ink text-cream border-ink shadow-md"
                    : "bg-cream text-ink border-ink/20 hover:border-gold hover:text-gold"
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
              All Publications
            </h2>
            <p className="font-body text-ink/60">
              {filteredPublications.length} publication{filteredPublications.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-ink/50 font-body">Loading publications…</div>
          ) : filteredPublications.length === 0 ? (
            <div className="text-center py-20 text-ink/50 font-body">No publications found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPublications.map((pub: any, index: number) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={pub.image}
                      alt={pub.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${pub.id + 100}/400/300`;
                      }}
                    />
                    {pub.featured && (
                      <div className="absolute top-3 right-3 bg-gold text-ink px-3 py-1 text-xs font-accent uppercase tracking-wider">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gold font-accent uppercase tracking-wider">
                        {pub.type}
                      </span>
                      <span className="text-xs text-ink/50 font-body">
                        {pub.pages} {pub.pages === 1 ? "page" : "pages"}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink mb-2 leading-snug">
                      {pub.title}
                    </h3>

                    {pub.description && (
                      <p className="font-body text-ink/60 text-sm mb-4 line-clamp-3 flex-1">
                        {pub.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4 text-xs text-ink/50 font-accent">
                      <span>{pub.author}</span>
                      <span>{pub.date}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-ink/50 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {pub.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> {pub.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {pub.likes}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        className="flex-1 bg-ink text-cream hover:bg-gold hover:text-ink transition-colors text-xs"
                        onClick={() => handleView(pub.id, pub.pdfFile)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-ink text-ink hover:bg-ink hover:text-cream transition-colors text-xs"
                        onClick={() => handleDownload(pub.id, pub.pdfFile, pub.pdfFileName)}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold text-gold hover:bg-gold hover:text-ink transition-colors"
                        onClick={() => handleLike(pub.id)}
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Section */}
      <section className="py-20 px-6 bg-ink text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Share Your Voice
            </h2>
            <p className="font-body text-cream/70 mb-8 max-w-2xl mx-auto">
              We welcome poems, stories, articles, and creative writing. Submit your work to be featured in LIT'ERA's publications.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                className="!bg-gold !text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:!bg-cream hover:!text-ink transition-all"
                onClick={() => setSubmissionOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Your Work
              </Button>
              <Button
                variant="outline"
                className="!border-cream !text-cream font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:!bg-cream hover:!text-ink transition-all"
                onClick={() => setGuidelinesOpen(true)}
              >
                Submission Guidelines
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SubmissionModal isOpen={submissionOpen} onClose={() => setSubmissionOpen(false)} />
      <MagazineGuidelinesModal isOpen={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </div>
  );
}
