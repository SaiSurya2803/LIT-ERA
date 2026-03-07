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

  // Fetch publications from database
  const { data: publicationsFromDB = [], isLoading, refetch } = usePublications();

  // Listen for custom event to open submission modal from guidelines
  useEffect(() => {
    const handleOpenSubmission = () => setSubmissionOpen(true);
    window.addEventListener('openSubmissionModal', handleOpenSubmission);
    return () => window.removeEventListener('openSubmissionModal', handleOpenSubmission);
  }, []);

  // Sync local publications state with database data
  useEffect(() => {
    setLocalPublications(publicationsFromDB.length > 0 ? publicationsFromDB : fallbackPublications);
  }, [publicationsFromDB]);

  // Fallback publications for display (will be replaced by database data)
  const fallbackPublications = [
    {
      id: 1,
      title: "19th Year on Earth",
      category: "Book",
      author: "Yashwanth Rishindra",
      date: "January 11, 2026",
      description: "The 19th year on Earth represents a critical bridge between adolescence and adulthood, often characterized by intense personal growth, self-discovery, and significant life shifts. It is a phase of exploring identity, purpose, and independence, marking the transition away from high school and into higher education, early career, or personal freedom.",
      image: "https://m.media-amazon.com/images/I/61WYKDK6nSL._UF1000,1000_QL80_.jpg",
      type: "Book",
      pages: 24,
      downloads: 234,
      views: 892,
      likes: 67,
      featured: true,
      pdfFile: "/uploads/publications/19th-Year-on-Earth.pdf",
      pdfFileName: "19th-Year-on-Earth.pdf"
    },
    {
      id: 2,
      title: "You Just Made My Day",
      category: "Story",
      author: "Pooja Sirasala",
      date: "December 5, 2025",
      image: "https://picsum.photos/seed/you-made-my-day/400/300.jpg",
      type: "Story",
      pages: 1,
      downloads: 67,
      views: 234,
      likes: 43,
      featured: false,
      pdfFile: "/uploads/publications/You Just Made My Day Short Story- Pooja Sirasala.pdf",
      pdfFileName: "You-Just-Made-My-Day.pdf"
    },
    {
      id: 3,
      title: "Unipath",
      category: "Poem",
      author: "Pranathi Chitte",
      date: "December 10, 2025",
      image: "https://picsum.photos/seed/unipath-journey/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 45,
      views: 156,
      likes: 29,
      featured: false,
      pdfFile: "/uploads/publications/Unipath - Pranathi Chitte.pdf",
      pdfFileName: "Unipath-Pranathi-Chitte.pdf"
    },
    {
      id: 4,
      title: "Turning Point",
      category: "Story",
      author: "N SADHRIKA",
      date: "December 2, 2025",
      image: "https://picsum.photos/seed/turning-point/400/300.jpg",
      type: " Article ",
      pages: 4,
      downloads: 89,
      views: 234,
      likes: 54,
      featured: false,
      pdfFile: "/uploads/publications/Turning point - N SADHRIKA.pdf",
      pdfFileName: "Turning-Point-N-SADHRIKA.pdf"
    },
    {
      id: 5,
      title: "The Summit",
      category: "Story",
      author: "Sri Charan Kota",
      date: "December 4, 2025",
      image: "https://picsum.photos/seed/the-summit/400/300.jpg",
      type: "Story",
      pages: 2,
      downloads: 178,
      views: 445,
      likes: 89,
      featured: false,
      pdfFile: "/uploads/publications/The Summit- sri charan kota.pdf",
      pdfFileName: "The-Summit-Sri-Charan-Kota.pdf"
    },
    {
      id: 6,
      title: "The Courage to Be Delulu",
      category: "Poem",
      author: "Vineetha N",
      date: "December 17, 2025",
      image: "https://picsum.photos/seed/courage-delulu/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 34,
      views: 189,
      likes: 23,
      featured: false,
      pdfFile: "/uploads/publications/The Courage to Be Delulu - VINEETHA N.pdf",
      pdfFileName: "The-Courage-to-Be-Delulu-VINEETHA-N.pdf"
    },
    {
      id: 7,
      title: "The Chapter I'm in",
      category: "Poem",
      author: "Shaik Azra",
      date: "December 2, 2025",
      image: "https://picsum.photos/seed/chapter-im-in/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 28,
      views: 89,
      likes: 18,
      featured: false,
      pdfFile: "/uploads/publications/The Chapter I'm in - Shaik Azra.pdf",
      pdfFileName: "The-Chapter-Im-in-Shaik-Azra.pdf"
    },
    {
      id: 8,
      title: "Fire In Every Footstep",
      category: "Poem",
      author: "Yasaswy Potturi",
      date: "December 11, 2025",
      image: "https://picsum.photos/seed/poem-collection/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 92,
      views: 167,
      likes: 45,
      featured: false,
      pdfFile: "/uploads/publications/Poem - Yasaswy Potturi.pdf",
      pdfFileName: "Poem-Collection-Yasaswy-Potturi.pdf"
    },
    {
      id: 9,
      title: "A Fresh Start",
      category: "Poem",
      author: "Pranavi",
      date: "December 7, 2025",
      image: "https://picsum.photos/seed/literary-voices/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 156,
      views: 445,
      likes: 78,
      featured: false,
      pdfFile: "uploads/publications/A Fresh Start- Pranavi.pdf",
      pdfFileName: "A Fresh Start- Pranavi.pdf"
    },
    {
      id: 10,
      title: "Am I really an Engineer",
      category: "Poem",
      author: "Rohith Mangamuri",
      date: "December 17, 2025",
      image: "https://picsum.photos/seed/campus-chronicles/400/300.jpg",
      type: "Poem",
      pages: 2,
      downloads: 89,
      views: 234,
      likes: 34,
      featured: false,
      pdfFile: "uploads/publications/Am I really an Engineer - Rohith Mangamuri.pdf",
      pdfFileName: "Am-I-really-an-Engineer-Rohith-Mangamuri.pdf"
    },
    {
      id: 11,
      title: "Are You Niche or Performative",
      category: "Poem",
      author: "Ikshita",
      date: "December 17, 2025",
      image: "https://picsum.photos/seed/digital-poetry-review/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 45,
      views: 123,
      likes: 28,
      featured: false,
      pdfFile: "uploads/publications/Are You Niche or Performative - Ikshita.pdf",
      pdfFileName: "Are You Niche or Performative - Ikshita.pdf"
    },
    {
      id: 12,
      title: "Before the next bomb falls",
      category: "Poem",
      author: "Tasneem Firdous",
      date: "December 7, 2025",
      image: "https://picsum.photos/seed/creative-writing-workshop/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 67,
      views: 189,
      likes: 41,
      featured: false,
      pdfFile: "uploads/publications/Before the next bomb falls - Tasneem Firdous.pdf",
      pdfFileName: "Before the next bomb falls - Tasneem Firdous.pdf"
    },
    {
      id: 13,
      title: "Being vs Doing",
      category: "Poem",
      author: "sheripally Rakesh Goud",
      date: "December 17, 2025",
      image: "https://picsum.photos/seed/annual-literary-awards/400/300.jpg",
      type: "Poem",
      pages: 1,
      downloads: 234,
      views: 567,
      likes: 89,
      featured: false,
      pdfFile: "uploads/publications/Being vs Doing- sheripally Rakesh Goud.pdf",
      pdfFileName: "Being vs Doing- sheripally Rakesh Goud.pdf"
    },
    {
      id: 14,
      title: "Celestial Serenade",
      category: "Poem",
      author: "Dhruu",
      date: "December 17, 2025",
      image: "https://picsum.photos/seed/research-symposium/400/300.jpg",
      type: " Poem ",
      pages: 1,
      downloads: 78,
      views: 234,
      likes: 56,
      featured: false,
      pdfFile: "uploads/publications/Celestial Serenade - Dhruu.pdf",
      pdfFileName: "Celestial-Serenade - Dhruu.pdf"
    },
    {
      id: 15,
      title: "The Weight of Packed Bags",
      category: "Article",
      author: "Asiya Beig",
      date: "December 17, 2025",
      image: "https://picsum.photos/seed/student-spotlight/400/300.jpg",
      type: " Article ",
      pages: 2,
      downloads: 145,
      views: 389,
      likes: 67,
      featured: false,
      pdfFile: "uploads/publications/Document from Asiyabeig - Asiya Beig.pdf",
      pdfFileName: "Document from Asiyabeig - Asiya Beig.pdf"
    },
    {
      id: 16,
      title: "Finding yourself",
      category: "Article",
      author: "sasamrutha Moganti",
      date: "December 8, 2025",
      image: "https://picsum.photos/seed/poetry-slam-results/400/300.jpg",
      type: "Article",
      pages: 1,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFile: "uploads/publications/Finding yourself - Sasamrutha Moganti.pdf",
      pdfFileName: "Finding yourself - Sasamrutha Moganti.pdf"
    },
    {
      id: 17,
      title: "Part",
      category: "Story",
      author: "Chikkam Radhakrishna",
      date: "December 2, 2025",
      image: "https://picsum.photos/seed/poetry-slam-results/400/300.jpg",
      type: "Story",
      pages: 2,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFile: "uploads/publications/Part - Chikkam Radhakrishna.pdf",
      pdfFileName: "Part - Chikkam Radhakrishna.pdf"
    }
  ];

  const categories = [
    { id: "all", name: "All Publications", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Book", name: "Books", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Story", name: "Stories", icon: <FileText className="w-4 h-4" /> },
    { id: "Poem", name: "Poems", icon: <FileText className="w-4 h-4" /> },
    { id: "Article", name: "Articles", icon: <FileText className="w-4 h-4" /> }
  ];

  // Use database publications if available, otherwise use fallback
  const publications = publicationsFromDB.length > 0 ? publicationsFromDB : fallbackPublications;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      book: 'D4AF37',      // Gold
      magazine: '4A5568',  // Gray
      newspaper: '2D3748', // Dark gray
      journal: '1A202C',   // Almost black
      anthology: 'B8860B', // Dark gold
      article: '6B7280'    // Medium gray
    };
    return colors[category?.toLowerCase()] || '4A5568';
  };

  // Map database fields to display format
  const publicationsDisplay = publications.map((pub: any) => ({
    id: pub.id,
    title: pub.title,
    category: pub.category,
    author: pub.author,
    date: pub.publishDate || pub.date,
    description: pub.description,
    // Use cover image if available, otherwise use a placeholder with category-based color
    image: pub.coverImage || pub.image || `https://placehold.co/400x300/${getCategoryColor(pub.category)}/white?text=${encodeURIComponent(pub.title)}`,
    type: pub.category ? pub.category.charAt(0).toUpperCase() + pub.category.slice(1) : pub.type,
    pages: pub.pages,
    downloads: pub.downloads,
    views: pub.views,
    likes: pub.likes,
    featured: pub.featured,
    pdfFile: pub.pdfFile || null,
    pdfFileName: pub.pdfFileName || null
  }));

  const filteredPublications = selectedCategory === "all"
    ? localPublications.filter((pub: any) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : localPublications.filter((pub: any) =>
      (pub.category === selectedCategory) &&
      (pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleDownload = async (id: number, pdfFile: string | null, fileName: string | null) => {
    if (!pdfFile) {
      alert("PDF file not available");
      return;
    }

    // Show immediate feedback
    const updatedPublications = localPublications.map((pub: any) =>
      pub.id === id ? { ...pub, downloads: pub.downloads + 1 } : pub
    );
    setLocalPublications(updatedPublications);

    // Update database and then refetch
    try {
      const response = await fetch(`/api/publications/${id}/download`, { method: 'POST' });
      console.log('Download response:', response);
      if (response.ok) {
        console.log('Download count updated in database');
        // Refetch after a short delay to ensure database is updated
        setTimeout(() => refetch(), 1000);
      }
    } catch (error) {
      console.error("Error tracking download:", error);
    }

    // Download file
    const link = document.createElement("a");
    link.href = pdfFile;
    link.setAttribute("download", fileName || "publication.pdf");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Wrapper function for PublicationCard compatibility
  const handleDownloadWrapper = (pdfFile: string | null, fileName: string | null) => {
    handleDownload(0, pdfFile, fileName); // id is not used in new implementation
  };

  const handleView = async (id: number, pdfFile: string | null) => {
    if (!pdfFile) {
      alert("PDF file not available");
      return;
    }

    // Show immediate feedback
    const updatedPublications = localPublications.map((pub: any) =>
      pub.id === id ? { ...pub, views: pub.views + 1 } : pub
    );
    setLocalPublications(updatedPublications);

    // Update database and then refetch
    try {
      const response = await fetch(`/api/publications/${id}`, { method: 'POST' });
      console.log('View response:', response);
      if (response.ok) {
        console.log('View count updated in database');
        // Refetch after a short delay to ensure database is updated
        setTimeout(() => refetch(), 1000);
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    }

    // Open PDF in new tab
    window.open(pdfFile, '_blank');
  };

  const handleLike = async (id: number) => {
    // Show immediate feedback
    const updatedPublications = localPublications.map((pub: any) =>
      pub.id === id ? { ...pub, likes: pub.likes + 1 } : pub
    );
    setLocalPublications(updatedPublications);

    try {
      console.log('Attempting to like publication:', id);
      const response = await fetch(`/api/publications/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Like response status:', response.status);
      console.log('Like response ok:', response.ok);

      const responseData = await response.json();
      console.log('Like response data:', responseData);

      if (response.ok) {
        console.log('Like count updated in database');
        // Refetch after a short delay to ensure database is updated
        setTimeout(() => refetch(), 1000);
      } else {
        console.error('Like failed:', responseData);
        // Revert local change if API failed
        const revertedPublications = localPublications.map((pub: any) =>
          pub.id === id ? { ...pub, likes: pub.likes - 1 } : pub
        );
        setLocalPublications(revertedPublications);
      }
    } catch (error) {
      console.error("Like error:", error);
      // Revert local change if API failed
      const revertedPublications = localPublications.map((pub: any) =>
        pub.id === id ? { ...pub, likes: pub.likes - 1 } : pub
      );
      setLocalPublications(revertedPublications);
      alert("Failed to like publication");
    }
  };

  const handleLikeMagazine = () => {
    setMagazineLikes(prev => prev + 1);
    alert("You liked LIT'ERA Magazine! ❤️");
  };

  const handleShare = async (publication: any) => {
    const shareData = {
      title: publication.title,
      text: `Check out "${publication.title}" by ${publication.author}`,
      url: window.location.href
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (clipboardError) {
        alert("Unable to share. Please copy the URL manually.");
      }
    }
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
              Literary Publications & News
            </p>
            <p className="font-body text-ink/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our collection of newspapers, magazines, research journals, and creative anthologies.
              Discover the voices of our literary community and stay updated with club news and events.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                className="!bg-gold !text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:!bg-cream hover:!text-ink transition-all"
                onClick={() => setSubmissionOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Publication
              </Button>
              <Button
                className="bg-cream text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:bg-ink hover:text-cream transition-all border border-ink/20"
                onClick={handleLikeMagazine}
              >
                <Heart className="w-4 h-4 mr-2" />
                Like Magazine ({magazineLikes})
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>


      {/* Category Filter */}
      <section className="py-8 px-6 bg-cream">
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-6 lg:gap-8">
          {/* Search Bar */}
          <div className="w-full sm:w-[28rem] lg:w-96 flex-shrink-0">
            <div className="relative shadow-sm rounded-md overflow-hidden">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-[52px] border border-ink/20 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm shadow-inner transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-md font-accent text-sm tracking-wide transition-all duration-200 ${selectedCategory === category.id
                  ? "bg-ink text-white shadow-md border border-ink"
                  : "bg-white text-gold border border-gold hover:bg-gold hover:text-ink shadow-sm hover:shadow-md"
                  }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Publications */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
              All Publications
            </h2>
            <p className="font-body text-ink/70 max-w-2xl mx-auto">
              Complete collection of LIT'ERA publications including newspapers, magazines, journals, and creative anthologies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPublications.map((publication: any, index: number) => (
              <motion.div
                key={publication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={publication.image}
                    alt={publication.title}
                    className="w-full h-48 object-cover"
                  />
                  {publication.featured && (
                    <div className="absolute top-4 right-4 bg-gold text-ink px-3 py-1 rounded-full text-xs font-accent uppercase tracking-wider">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gold font-accent uppercase tracking-wider">
                      {publication.type}
                    </span>
                    <span className="text-sm text-ink/60">
                      {publication.pages} pages
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink mb-2">
                    {publication.title}
                  </h3>

                  <p className="font-body text-ink/70 text-sm mb-4 line-clamp-3">
                    {publication.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-accent text-sm text-ink/60">
                      {publication.author}
                    </span>
                    <span className="font-accent text-sm text-ink/60">
                      {publication.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-ink/60">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {publication.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {publication.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {publication.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-ink text-cream hover:bg-gold hover:text-ink transition-colors"
                      onClick={() => handleView(publication.id, publication.pdfFile)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-ink text-ink hover:bg-ink hover:text-cream transition-colors"
                      onClick={() => handleDownload(publication.id, publication.pdfFile, publication.pdfFileName)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-ink transition-colors"
                      onClick={() => handleLike(publication.id)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Section */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
              Submit Your Work
            </h2>
            <p className="font-body text-ink/70 mb-8">
              Share your literary creations with our community. We accept articles, poetry, short stories,
              research papers, and creative writing for publication in our magazines and journals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mx-auto max-w-lg w-full">
              <Button
                className="!bg-ink !text-cream font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:!bg-gold hover:!text-ink transition-all"
                onClick={() => setSubmissionOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Article
              </Button>
              <Button
                variant="outline"
                className="!border-ink !text-ink font-accent text-sm tracking-[0.2em] uppercase px-8 py-4 hover:!bg-ink hover:!text-cream transition-all"
                onClick={() => setGuidelinesOpen(true)}
              >
                Submission Guidelines
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Submission Modal */}
      <SubmissionModal isOpen={submissionOpen} onClose={() => setSubmissionOpen(false)} />

      {/* Magazine Guidelines Modal */}
      <MagazineGuidelinesModal isOpen={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </div>
  );
}


