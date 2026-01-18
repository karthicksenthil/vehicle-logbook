import express, { Application } from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload';
import vehicleRoutes from './routes/vehicles';
import { errorHandler } from './middleware/errorHandler';

function createApp(): Application {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/', uploadRoutes);
  app.use('/', vehicleRoutes);
  
  // Error handling
  app.use(errorHandler);
  
  return app;
}

export default createApp;