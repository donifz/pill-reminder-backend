import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

async function verifyConnection() {
  console.log('Starting database connection verification...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    connectTimeoutMS: 10000, // 10 seconds timeout
    extra: {
      max: 1, // Use only one connection for verification
    }
  });

  try {
    console.log('Attempting to connect to database...');
    await dataSource.initialize();
    console.log('Database connection successful!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Connection details:', {
      type: 'postgres',
      ssl: process.env.NODE_ENV === 'production',
      timeout: '10s'
    });
    process.exit(1);
  }
}

verifyConnection(); 