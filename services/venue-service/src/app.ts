import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes';
import venueRoutes from './routes/venue.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/health', healthRoutes);
app.use('/api/venues', venueRoutes);

// Generic 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Register global error handler middleware
app.use(errorHandler);

export default app;
