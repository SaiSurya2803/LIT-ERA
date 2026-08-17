import "dotenv/config";
import mysql from "mysql2/promise";

async function init() {
  console.log("Connecting to TiDB Cloud...");
  const connection = await mysql.createConnection({
    host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "7EghEhEouyQyPKz.root",
    password: "vGYAtF15WcdMOtQG",
    database: "test",
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  });

  console.log("Connected! Creating database tables...");

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      club VARCHAR(100) DEFAULT "LIT'ERA",
      is_admin BOOLEAN DEFAULT FALSE,
      join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS contact_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT,
      reason TEXT,
      message TEXT NOT NULL,
      submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      event_date TEXT,
      is_active BOOLEAN DEFAULT TRUE
    );`,

    `CREATE TABLE IF NOT EXISTS game_scores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36),
      game_type VARCHAR(50) NOT NULL,
      score INT,
      completion_time INT,
      completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX game_scores_game_type_idx (game_type),
      INDEX game_scores_user_id_idx (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS puzzles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      data TEXT NOT NULL,
      publish_date VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX puzzles_type_date_idx (type, publish_date),
      INDEX puzzles_publish_date_idx (publish_date)
    );`,

    `CREATE TABLE IF NOT EXISTS content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      answer TEXT,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      file_name TEXT,
      file_size INT,
      original_file_name TEXT,
      file_path TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS publications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_image TEXT,
      pdf_file TEXT,
      pdf_file_name TEXT,
      pages INT,
      publish_date TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      views INT DEFAULT 0,
      downloads INT DEFAULT 0,
      likes INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS event_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36),
      event_id INT NOT NULL,
      event_title TEXT NOT NULL,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS mun_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      committee TEXT,
      experience TEXT,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`
  ];

  for (const q of queries) {
    await connection.query(q);
  }

  console.log("✓ All 10 tables created successfully in TiDB Cloud!");
  await connection.end();
}

init().catch((err) => {
  console.error("Init DB Error:", err);
  process.exit(1);
});
