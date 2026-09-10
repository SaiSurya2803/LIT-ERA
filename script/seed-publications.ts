import "dotenv/config";
import pg from "pg";
import { readFileSync, existsSync } from "fs";
import path from "path";

const { Pool } = pg;

function findPostgresUrl(): string {
  const standardKeys = [
    "POSTGRES_URL",
    "DATABASE_URL",
  ];
  for (const k of standardKeys) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) {
      return val;
    }
  }
  return "";
}

async function seed() {
  const rawDbUrl = findPostgresUrl();
  if (!rawDbUrl) {
    throw new Error("PostgreSQL connection string not found in .env");
  }

  console.log("Connecting to PostgreSQL database...");
  const pool = new Pool({ connectionString: rawDbUrl });

  const publications = [
    {
      title: "Litera Club Newsletter",
      category: "Magazine",
      author: "Litera Club",
      publish_date: "March 25, 2026",
      description: "The official newsletter of the Litera Club, featuring literary news, updates, and more.",
      cover_image: "https://picsum.photos/seed/litera-newsletter/400/300.jpg",
      pages: 1,
      downloads: 12,
      views: 45,
      likes: 8,
      featured: true,
      pdfFileName: "Litera-Club-Newsletter.pdf"
    },
    {
      title: "19th Year on Earth",
      category: "Book",
      author: "Yashwanth Rishindra",
      publish_date: "January 11, 2026",
      description: "The 19th year on Earth represents a critical bridge between adolescence and adulthood, often characterized by intense personal growth, self-discovery, and significant life shifts.",
      cover_image: "https://m.media-amazon.com/images/I/61WYKDK6nSL._UF1000,1000_QL80_.jpg",
      pages: 24,
      downloads: 234,
      views: 892,
      likes: 67,
      featured: true,
      pdfFileName: "19th-Year-on-Earth.pdf"
    },
    {
      title: "You Just Made My Day",
      category: "Story",
      author: "Pooja Sirasala",
      publish_date: "December 5, 2025",
      description: "A heartwarming short story about small acts of kindness.",
      cover_image: "https://picsum.photos/seed/you-made-my-day/400/300.jpg",
      pages: 1,
      downloads: 67,
      views: 234,
      likes: 43,
      featured: false,
      pdfFileName: "You Just Made My Day Short Story- Pooja Sirasala.pdf"
    },
    {
      title: "Unipath",
      category: "Poem",
      author: "Pranathi Chitte",
      publish_date: "December 10, 2025",
      description: "A poem about finding your unique journey in life.",
      cover_image: "https://picsum.photos/seed/unipath-journey/400/300.jpg",
      pages: 1,
      downloads: 45,
      views: 156,
      likes: 29,
      featured: false,
      pdfFileName: "Unipath - Pranathi Chitte.pdf"
    },
    {
      title: "Turning Point",
      category: "Article",
      author: "N SADHRIKA",
      publish_date: "December 2, 2025",
      description: "An article exploring life's pivotal moments and how they shape us.",
      cover_image: "https://picsum.photos/seed/turning-point/400/300.jpg",
      pages: 4,
      downloads: 89,
      views: 234,
      likes: 54,
      featured: false,
      pdfFileName: "Turning point - N SADHRIKA.pdf"
    },
    {
      title: "The Summit",
      category: "Story",
      author: "Sri Charan Kota",
      publish_date: "December 4, 2025",
      description: "A compelling story of ambition, perseverance, and reaching new heights.",
      cover_image: "https://picsum.photos/seed/the-summit/400/300.jpg",
      pages: 2,
      downloads: 178,
      views: 445,
      likes: 89,
      featured: false,
      pdfFileName: "The Summit- sri charan kota.pdf"
    },
    {
      title: "The Courage to Be Delulu",
      category: "Poem",
      author: "Vineetha N",
      publish_date: "December 17, 2025",
      description: "A bold poem celebrating the courage to dream beyond reason.",
      cover_image: "https://picsum.photos/seed/courage-delulu/400/300.jpg",
      pages: 1,
      downloads: 34,
      views: 189,
      likes: 23,
      featured: false,
      pdfFileName: "The Courage to Be Delulu - VINEETHA N.pdf"
    },
    {
      title: "The Chapter I'm in",
      category: "Poem",
      author: "Shaik Azra",
      publish_date: "December 2, 2025",
      description: "A reflective poem about the current chapter of life.",
      cover_image: "https://picsum.photos/seed/chapter-im-in/400/300.jpg",
      pages: 1,
      downloads: 28,
      views: 89,
      likes: 18,
      featured: false,
      pdfFileName: "The Chapter I'm in - Shaik Azra.pdf"
    },
    {
      title: "Fire In Every Footstep",
      category: "Poem",
      author: "Yasaswy Potturi",
      publish_date: "December 11, 2025",
      description: "A fiery poem about passion and determination in every step.",
      cover_image: "https://picsum.photos/seed/poem-collection/400/300.jpg",
      pages: 1,
      downloads: 92,
      views: 167,
      likes: 45,
      featured: false,
      pdfFileName: "Poem - Yasaswy Potturi.pdf"
    },
    {
      title: "A Fresh Start",
      category: "Poem",
      author: "Pranavi",
      publish_date: "December 7, 2025",
      description: "A poem about new beginnings and the hope they bring.",
      cover_image: "https://picsum.photos/seed/literary-voices/400/300.jpg",
      pages: 1,
      downloads: 156,
      views: 445,
      likes: 78,
      featured: false,
      pdfFileName: "A Fresh Start- Pranavi.pdf"
    },
    {
      title: "Am I really an Engineer",
      category: "Poem",
      author: "Rohith Mangamuri",
      publish_date: "December 17, 2025",
      description: "A humorous yet introspective poem about engineering student life.",
      cover_image: "https://picsum.photos/seed/campus-chronicles/400/300.jpg",
      pages: 2,
      downloads: 89,
      views: 234,
      likes: 34,
      featured: false,
      pdfFileName: "Am I really an Engineer - Rohith Mangamuri.pdf"
    },
    {
      title: "Are You Niche or Performative",
      category: "Poem",
      author: "Ikshita",
      publish_date: "December 17, 2025",
      description: "A thought-provoking poem questioning authenticity in creative expression.",
      cover_image: "https://picsum.photos/seed/digital-poetry-review/400/300.jpg",
      pages: 1,
      downloads: 45,
      views: 123,
      likes: 28,
      featured: false,
      pdfFileName: "Are You Niche or Performative - Ikshita.pdf"
    },
    {
      title: "Before the next bomb falls",
      category: "Poem",
      author: "Tasneem Firdous",
      publish_date: "December 7, 2025",
      description: "A powerful poem about peace, loss, and the fragility of life.",
      cover_image: "https://picsum.photos/seed/creative-writing-workshop/400/300.jpg",
      pages: 1,
      downloads: 67,
      views: 189,
      likes: 41,
      featured: false,
      pdfFileName: "Before the next bomb falls - Tasneem Firdous.pdf"
    },
    {
      title: "Being vs Doing",
      category: "Poem",
      author: "Sheripally Rakesh Goud",
      publish_date: "December 17, 2025",
      description: "A philosophical poem exploring the tension between existence and action.",
      cover_image: "https://picsum.photos/seed/annual-literary-awards/400/300.jpg",
      pages: 1,
      downloads: 234,
      views: 567,
      likes: 89,
      featured: false,
      pdfFileName: "Being vs Doing- sheripally Rakesh Goud.pdf"
    },
    {
      title: "Celestial Serenade",
      category: "Poem",
      author: "Dhruu",
      publish_date: "December 17, 2025",
      description: "A lyrical poem inspired by the cosmos and the music of the universe.",
      cover_image: "https://picsum.photos/seed/research-symposium/400/300.jpg",
      pages: 1,
      downloads: 78,
      views: 234,
      likes: 56,
      featured: false,
      pdfFileName: "Celestial Serenade - Dhruu.pdf"
    },
    {
      title: "The Weight of Packed Bags",
      category: "Article",
      author: "Asiya Beig",
      publish_date: "December 17, 2025",
      description: "An evocative article about travel, departure, and the emotions of leaving home.",
      cover_image: "https://picsum.photos/seed/student-spotlight/400/300.jpg",
      pages: 2,
      downloads: 145,
      views: 389,
      likes: 67,
      featured: false,
      pdfFileName: "Document from Asiyabeig - Asiya Beig.pdf"
    },
    {
      title: "Finding yourself",
      category: "Article",
      author: "Sasamrutha Moganti",
      publish_date: "December 8, 2025",
      description: "An introspective article on the journey of self-discovery.",
      cover_image: "https://picsum.photos/seed/poetry-slam-results/400/300.jpg",
      pages: 1,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFileName: "Finding yourself - Sasamrutha Moganti.pdf"
    },
    {
      title: "Part",
      category: "Story",
      author: "Chikkam Radhakrishna",
      publish_date: "December 2, 2025",
      description: "A short story about the parts we play in each other's lives.",
      cover_image: "https://picsum.photos/seed/poetry-slam-results2/400/300.jpg",
      pages: 2,
      downloads: 89,
      views: 345,
      likes: 78,
      featured: false,
      pdfFileName: "Part - Chikkam Radhakrishna.pdf"
    }
  ];

  const client = await pool.connect();
  
  try {
    for (const pub of publications) {
      console.log(`Seeding publication: ${pub.title}`);
      
      const filePath = path.join(process.cwd(), "uploads", "publications", pub.pdfFileName);
      let pdfFile = null;
      
      if (existsSync(filePath)) {
        pdfFile = `uploads/publications/${pub.pdfFileName}`;
      } else {
        console.warn(`Warning: PDF file not found at ${filePath}`);
      }
      
      const query = `
        INSERT INTO publications (
          title, category, author, description, cover_image, 
          pdf_file, pdf_file_name, pages, publish_date, 
          featured, views, downloads, likes
        ) VALUES (
          $1, $2, $3, $4, $5, 
          $6, $7, $8, $9, 
          $10, $11, $12, $13
        )
      `;
      
      await client.query(query, [
        pub.title, pub.category, pub.author, pub.description, pub.cover_image,
        pdfFile, pub.pdfFileName, pub.pages, pub.publish_date,
        pub.featured, pub.views, pub.downloads, pub.likes
      ]);
    }
    
    console.log(`✓ Successfully seeded ${publications.length} publications!`);
  } catch (error) {
    console.error("Error seeding publications:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
