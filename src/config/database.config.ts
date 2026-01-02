import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Handle connection string format
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port, 10),
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      synchronize: true, // Never use synchronize in production
      ssl: false, // Disable SSL
      logging: !isProduction,
      migrationsRun: true, // Automatically run migrations on startup
      migrationsTableName: 'migrations', // Name of the migrations table
    };
  }

  // Fallback to individual environment variables
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'miramax92',
    database: process.env.DB_DATABASE || 'pill_reminder',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: true, // Never use synchronize in production
    ssl: false, // Disable SSL
    logging: !isProduction,
    migrationsRun: true, // Automatically run migrations on startup
    migrationsTableName: 'migrations', // Name of the migrations table
  };
});
