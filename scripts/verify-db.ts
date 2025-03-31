import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function verifyConnection() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection successful!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

verifyConnection(); 