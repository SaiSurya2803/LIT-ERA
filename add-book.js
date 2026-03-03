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

// Check if book already exists
const existing = db.prepare('SELECT * FROM publications WHERE id = 1').get();

if (existing) {
  // Update existing book
  const update = db.prepare(`
    UPDATE publications 
    SET title = ?,
        category = ?,
        author = ?,
        description = ?,
        cover_image = ?,
        pdf_file = ?,
        pdf_file_name = ?,
        pages = ?,
        publish_date = ?,
        featured = ?,
        is_active = ?
    WHERE id = 1
  `);
  
  update.run(
    '19th Year on Earth',
    'book',
    'LIT\'ERA Club',
    'A collection of thoughts, experiences, and reflections from the 19th year of life. This anthology captures the essence of youth, growth, and self-discovery.',
    '/uploads/publications/19th-year-on-earth-cover.jpg',
    '/uploads/publications/19th-Year-on-Earth.pdf',
    '19th-Year-on-Earth.pdf',
    24,
    '2026-03-01',
    1, // featured
    1  // is_active
  );
  
  console.log('✅ Updated "19th Year on Earth" in the database!');
} else {
  // Insert new book
  const insert = db.prepare(`
    INSERT INTO publications (
      title, category, author, description, cover_image, 
      pdf_file, pdf_file_name, pages, publish_date, featured, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insert.run(
    '19th Year on Earth',
    'book',
    'LIT\'ERA Club',
    'A collection of thoughts, experiences, and reflections from the 19th year of life. This anthology captures the essence of youth, growth, and self-discovery.',
    '/uploads/publications/19th-year-on-earth-cover.jpg',
    '/uploads/publications/19th-Year-on-Earth.pdf',
    '19th-Year-on-Earth.pdf',
    24,
    '2026-03-01',
    1, // featured
    1  // is_active
  );
  
  console.log('✅ Added "19th Year on Earth" to the database!');
}

// Show all publications
const all = db.prepare('SELECT * FROM publications').all();
console.log('\n📚 All publications in database:');
console.table(all);

db.close();
