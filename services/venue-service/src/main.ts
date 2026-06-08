import 'dotenv/config';
import app from './app';
import { connectDb, disconnectDb } from './prisma';

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  try {
    await connectDb();
    const server = app.listen(PORT, () => {
      console.log(`Venue Service listening on port ${PORT}`);
    });

    const gracefulShutdown = async () => {
      console.log('Shutting down gracefully...');
      server.close(async () => {
        await disconnectDb();
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
}

void bootstrap();
