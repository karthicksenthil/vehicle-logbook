import { Router } from 'express';
import upload from '../middleware/fileUpload';
import { handleUpload, healthCheck } from '../controllers/uploadController';

const router = Router();

// Upload endpoint
router.post('/upload', upload.single('logbook'), handleUpload);

// Health check endpoint
router.get('/health', healthCheck);

export default router;