import Database from 'better-sqlite3';

const db = new Database('./litera_club.db');

const insert = db.prepare(`
  INSERT INTO publications (
    title, category, author, description, cover_image, 
    pdf_file, pdf_file_name, pages, publish_date, featured, is_active
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Extract author name from filename (after the dash)
function getAuthor(filename) {
  const match = filename.match(/-\s*(.+?)\.pdf$/i);
  return match ? match[1].trim() : 'LIT\'ERA Club';
}

// Extract title from filename (before the dash)
function getTitle(filename) {
  const match = filename.match(/^(.+?)\s*-/);
  return match ? match[1].trim() : filename.replace('.pdf', '').replace('.PDF', '');
}

const articles = [
  'Are You Niche or Performative - Ikshita.pdf',
  'A Fresh Start- Pranavi.pdf',
  'Before the next bomb falls - Tasneem Firdous.pdf',
  'Celestial Serenade - Dhruu.pdf',
  'Document from Asiyabeig - Asiya Beig.pdf',
  'Finding yourself - Sasamrutha Moganti.pdf',
  'Being vs Doing- sheripally Rakesh Goud.pdf',
  'Poem - Yasaswy Potturi.pdf',
  'Am I really an Engineer - Rohith Mangamuri.pdf',
  'The Chapter I\'m in - Shaik Azra.pdf',
  'The Courage to Be Delulu - VINEETHA N.pdf',
  'The Summit- sri charan kota.pdf',
  'Turning point - N SADHRIKA.pdf',
  'Unipath - Pranathi Chitte.pdf',
  'You Just Made My Day Short Story- Pooja Sirasala.pdf'
];

console.log('Adding articles to database...\n');

articles.forEach(filename => {
  const title = getTitle(filename);
  const author = getAuthor(filename);
  
  insert.run(
    title,
    'article',
    author,
    '',  // No description for articles
    null,  // No cover image - will use placeholder
    `/uploads/publications/${filename}`,
    filename,
    null,  // No page count
    '2026-03-01',
    0,  // not featured
    1   // active
  );
  
  console.log(`✅ Added: "${title}" by ${author}`);
});

console.log('\n📚 All publications in database:');
const all = db.prepare('SELECT id, title, category, author FROM publications ORDER BY id').all();
console.table(all);

db.close();
