require('dotenv').config();
const { sql } = require('@vercel/postgres');



async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        fid INTEGER NOT NULL,
        transaction_hash VARCHAR(255) NOT NULL UNIQUE,
        sender_address VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        label VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();