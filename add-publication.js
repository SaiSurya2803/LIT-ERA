import Database from 'better-sqlite3';

const db = new Database('./litera_club.db');

// Create publications table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    pdf_file TEXT,
    pdf_file_name TEXT,
    pages INTEGER,
    publish_date TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER DEFAULT (unixepoch())
  )
`);

// Add your publication here
const insert = db.prepare(`
  INSERT INTO publications (
    title, category, author, description, cover_image, 
    pdf_file, pdf_file_name, pages, publish_date, featured, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Example: Add a new publication
// EDIT THE VALUES BELOW:
insert.run(
  'Your Article Title',           // title
  'magazine',                      // category: 'book', 'magazine', 'newspaper', 'journal', 'anthology'
  'Author Name',                   // author
  'Description of your article',   // description
  null,                            // cover image path (use null for auto-generated placeholder)
  '/uploads/publications/your-article.pdf',        // pdf file path
  'your-article.pdf',              // pdf file name
  10,                              // number of pages
  '2026-03-01',                    // publish date (YYYY-MM-DD)
  0,                               // featured (0 = no, 1 = yes)
  1                                // is_active (0 = no, 1 = yes)
);

console.log('✅ Publication added successfully!');

// Show all publications
const all = db.prepare('SELECT id, title, category, author, pages, featured FROM publications').all();
console.log('\n📚 All publications in database:');
console.table(all);

db.close();
