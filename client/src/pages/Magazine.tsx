import { motion } from "framer-motion";
import { FileText, BookOpen, Newspaper, Plus, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import SubmissionModal from "@/components/SubmissionModal";
import MagazineGuidelinesModal from "@/components/MagazineGuidelinesModal";
import PublicationCard from "@/components/PublicationCard";
import { usePublications } from "@/hooks/use-publications";

export default function Magazine() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [magazineLikes, setMagazineLikes] = useState(0);
  
  // Fetch publications from database
  const { data: publicationsFromDB = [], isLoading, refetch } = usePublications();

  // Listen for custom event to open submission modal from guidelines
  useEffect(() => {
    const handleOpenSubmission = () => setSubmissionOpen(true);
    window.addEventListener('openSubmissionModal', handleOpenSubmission);
    return () => window.removeEventListener('openSubmissionModal', handleOpenSubmission);
  }, []);

  // Fallback publications for display (will be replaced by database data)
  const fallbackPublications = [
    {
      id: 1,
      title: "19th Year on Earth",
      category: "book",
      author: "Yashwanth Rishindra",
      date: "January 11, 2026",
      description: "The 19th year on Earth represents a critical bridge between adolescence and adulthood, often characterized by intense personal growth, self-discovery, and significant life shifts. It is a phase of exploring identity, purpose, and independence, marking the transition away from high school and into higher education, early career, or personal freedom.",
      image: "https://www.amazon.in/19th-Year-Earth-YASHWANTH-RISHINDRA-ebook/dp/B0GG6GTKJ4",
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
      category: "magazine",
      author: "Pooja Sirasala",
      date: "March 10, 2026",
      description: "A heartwarming short story about the small moments that bring joy and meaning to our lives.",
      image: "https://picsum.photos/seed/you-made-my-day/400/300.jpg",
      type: "Magazine",
      pages: 12,
      downloads: 67,
      views: 234,
      likes: 43,
      featured: true,
      pdfFile: "/uploads/publications/You Just Made My Day Short Story- Pooja Sirasala.pdf",
      pdfFileName: "You-Just-Made-My-Day.pdf"
    },
    {
      id: 3,
      title: "Unipath",
      category: "journal",
      author: "Pranathi Chitte",
      date: "March 5, 2026",
      description: "A personal journey through the paths of self-discovery and academic exploration.",
      image: "https://picsum.photos/seed/unipath-journey/400/300.jpg",
      type: "Research Journal",
      pages: 24,
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
      category: "newspaper",
      author: "N SADHRIKA",
      date: "February 15, 2026",
      description: "An insightful exploration of life's defining moments - those critical junctures where decisions shape our future, challenges test our resolve, and new paths emerge from old ones. This article examines how recognizing and navigating these turning points can lead to personal growth and transformative change.",
      image: "https://picsum.photos/seed/turning-point/400/300.jpg",
      type: "Newspaper",
      pages: 6,
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
      category: "anthology",
      author: "Sri Charan Kota",
      date: "February 28, 2026",
      description: "A poetic exploration of reaching new heights and overcoming challenges.",
      image: "https://picsum.photos/seed/the-summit/400/300.jpg",
      type: "Anthology",
      pages: 32,
      downloads: 178,
      views: 445,
      likes: 89,
      featured: true,
      pdfFile: "/uploads/publications/The Summit- sri charan kota.pdf",
      pdfFileName: "The-Summit-Sri-Charan-Kota.pdf"
    },
    {
      id: 6,
      title: "The Courage to Be Delulu",
      category: "journal",
      author: "VINEETHA N",
      date: "February 20, 2026",
      description: "A critical analysis of modern social phenomena and the courage to embrace authenticity.",
      image: "https://picsum.photos/seed/courage-delulu/400/300.jpg",
      type: "Journal",
      pages: 16,
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
      category: "article",
      author: "Shaik Azra",
      date: "March 1, 2026",
      description: "A reflective journey through the chapters of life, exploring how each phase brings its own lessons, challenges, and opportunities for growth. This personal narrative delves into the transitions between different stages of existence, examining how we navigate the spaces between who we were and who we are becoming.",
      image: "https://picsum.photos/seed/chapter-im-in/400/300.jpg",
      type: "Article",
      pages: 4,
      downloads: 28,
      views: 89,
      likes: 18,
      featured: false,
      pdfFile: "/uploads/publications/The Chapter I'm in - Shaik Azra.pdf",
      pdfFileName: "The-Chapter-Im-in-Shaik-Azra.pdf"
    },
    {
      id: 8,
      title: "Poem Collection",
      category: "anthology",
      author: "Yasaswy Potturi",
      date: "February 25, 2026",
      description: "A collection of original poems exploring themes of love, loss, and hope.",
      image: "https://picsum.photos/seed/poem-collection/400/300.jpg",
      type: "Anthology",
      pages: 28,
      downloads: 92,
      views: 167,
      likes: 45,
      featured: true,
      pdfFile: "/uploads/publications/Poem - Yasaswy Potturi.pdf",
      pdfFileName: "Poem-Collection-Yasaswy-Potturi.pdf"
    },
    {
      id: 9,
      title: "Literary Voices",
      category: "magazine",
      author: "Various Authors",
      date: "March 15, 2026",
      description: "A collection of diverse literary works from our talented community members, showcasing different writing styles and perspectives.",
      image: "https://picsum.photos/seed/literary-voices/400/300.jpg",
      type: "Magazine",
      pages: 48,
      downloads: 156,
      views: 445,
      likes: 78,
      featured: true,
      pdfFile: "/uploads/publications/Literary Voices - Various Authors.pdf",
      pdfFileName: "Literary-Voices-Various-Authors.pdf"
    },
    {
      id: 10,
      title: "Campus Chronicles",
      category: "newspaper",
      author: "Student Editorial Team",
      date: "March 8, 2026",
      description: "Monthly updates on campus events, student achievements, and institutional developments from our dedicated editorial team.",
      image: "https://picsum.photos/seed/campus-chronicles/400/300.jpg",
      type: "Newspaper",
      pages: 12,
      downloads: 89,
      views: 234,
      likes: 34,
      featured: false,
      pdfFile: "/uploads/publications/Campus Chronicles - Student Editorial Team.pdf",
      pdfFileName: "Campus-Chronicles-Student-Editorial-Team.pdf"
    },
    {
      id: 11,
      title: "Digital Poetry Review",
      category: "article",
      author: "Sarah Mitchell",
      date: "March 12, 2026",
      description: "An in-depth analysis of contemporary digital poetry platforms and their impact on traditional poetic expression.",
      image: "https://picsum.photos/seed/digital-poetry-review/400/300.jpg",
      type: "Article",
      pages: 6,
      downloads: 45,
      views: 123,
      likes: 28,
      featured: false,
      pdfFile: "/uploads/publications/Digital Poetry Review - Sarah Mitchell.pdf",
      pdfFileName: "Digital-Poetry-Review-Sarah-Mitchell.pdf"
    },
    {
      id: 12,
      title: "Creative Writing Workshop",
      category: "article",
      author: "Michael Chen",
      date: "March 18, 2026",
      description: "A comprehensive guide to creative writing techniques, exercises, and best practices for aspiring writers.",
      image: "https://picsum.photos/seed/creative-writing-workshop/400/300.jpg",
      type: "Article",
      pages: 8,
      downloads: 67,
      views: 189,
      likes: 41,
      featured: false,
      pdfFile: "/uploads/publications/Creative Writing Workshop - Michael Chen.pdf",
      pdfFileName: "Creative-Writing-Workshop-Michael-Chen.pdf"
    },
    {
      id: 13,
      title: "Annual Literary Awards",
      category: "magazine",
      author: "Literature Department",
      date: "March 22, 2026",
      description: "Celebrating excellence in literary achievement across all categories including poetry, fiction, non-fiction, and academic writing.",
      image: "https://picsum.photos/seed/annual-literary-awards/400/300.jpg",
      type: "Magazine",
      pages: 24,
      downloads: 234,
      views: 567,
      likes: 89,
      featured: true,
      pdfFile: "/uploads/publications/Annual Literary Awards - Literature Department.pdf",
      pdfFileName: "Annual-Literary-Awards-Literature-Department.pdf"
    },
    {
      id: 14,
      title: "Research Symposium",
      category: "journal",
      author: "Dr. Rachel Green",
      date: "March 25, 2026",
      description: "Academic proceedings from our annual research symposium featuring scholarly articles on literary theory and contemporary literature.",
      image: "https://picsum.photos/seed/research-symposium/400/300.jpg",
      type: "Research Journal",
      pages: 36,
      downloads: 78,
      views: 234,
      likes: 56,
      featured: false,
      pdfFile: "/uploads/publications/Research Symposium - Dr. Rachel Green.pdf",
      pdfFileName: "Research-Symposium-Dr-Rachel-Green.pdf"
    },
    {
      id: 15,
      title: "Student Spotlight",
      category: "magazine",
      author: "Emma Thompson",
      date: "March 28, 2026",
      description: "Featuring outstanding student writers and their exceptional works selected from our monthly submissions and writing workshops.",
      image: "https://picsum.photos/seed/student-spotlight/400/300.jpg",
      type: "Magazine",
      pages: 16,
      downloads: 145,
      views: 389,
      likes: 67,
      featured: true,
      pdfFile: "/uploads/publications/Student Spotlight - Emma Thompson.pdf",
      pdfFileName: "Student-Spotlight-Emma-Thompson.pdf"
    },
    {
      id: 16,
      title: "Poetry Slam Results",
      category: "anthology",
      author: "Various Poets",
      date: "March 30, 2026",
      description: "Collection of winning poems and performances from our annual poetry slam competition, showcasing raw talent and emotional expression.",
      image: "https://picsum.photos/seed/poetry-slam-results/400/300.jpg",
      type: "Anthology",
      pages: 20,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFile: "/uploads/publications/Poetry Slam Results - Various Poets.pdf",
      pdfFileName: "Poetry-Slam-Results-Various-Poets.pdf"
    }
  ];

  const categories = [
    { id: "all", name: "All Publications", icon: <BookOpen className="w-4 h-4" /> },
    { id: "newspaper", name: "Newspapers", icon: <Newspaper className="w-4 h-4" /> },
    { id: "magazine", name: "Magazines", icon: <FileText className="w-4 h-4" /> },
    { id: "journal", name: "Journals", icon: <BookOpen className="w-4 h-4" /> },
    { id: "anthology", name: "Anthologies", icon: <FileText className="w-4 h-4" /> },
    { id: "article", name: "Articles", icon: <FileText className="w-4 h-4" /> }
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
    ? publicationsDisplay.filter((pub: any) => 
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : publicationsDisplay.filter((pub: any) => 
        (pub.category === selectedCategory) && 
        (pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         pub.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
         pub.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const handleDownload = (id: number, pdfFile: string | null, fileName: string | null) => {
    if (!pdfFile) {
      alert("PDF file not available");
      return;
    }

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
    
    // Increment view count
    try {
      await fetch(`/api/publications/${id}`, { method: 'GET' });
      // Refetch publications to show updated view count
      refetch();
    } catch (error) {
      console.error("Error tracking view:", error);
    }
    
    // Open PDF in new tab
    window.open(pdfFile, '_blank');
  };

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`/api/publications/${id}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Refetch publications to show updated like count
        refetch();
      }
    } catch (error) {
      console.error("Like error:", error);
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
      <section className="py-6 px-6 bg-cream">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-6">
          {/* Search Bar */}
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 h-10 border border-ink/20 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm"
              />
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {categories.map((category: any) => (
              <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "bg-ink text-white px-4 py-2 rounded-md"
                      : "border border-gold text-gold bg-transparent px-4 py-2 rounded-md hover:bg-gold hover:text-black"
                  }
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
              <PublicationCard
                key={publication.id}
                publication={publication}
                index={index}
                onDownload={handleDownloadWrapper}
                onView={handleView}
                onLike={handleLike}
              />
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


