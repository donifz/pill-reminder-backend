import { config } from 'dotenv';

config();

function checkEnvironment() {
  console.log('Checking environment variables...');
  
  const requiredVars = ['DATABASE_URL', 'NODE_ENV'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  
  console.log('Environment variables check passed!');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
}

checkEnvironment(); 