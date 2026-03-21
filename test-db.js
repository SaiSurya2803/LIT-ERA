const pg = require('pg');

async function testConnection() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/litera_club'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    await client.end();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify password in DATABASE_URL');
    console.log('3. Ensure database "litera_club" exists');
    console.log('4. Check if port 5432 is available');
  }
}

testConnection();
