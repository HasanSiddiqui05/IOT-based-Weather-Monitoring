import express from 'express';
import { handleUpload,handleFetch } from '../Controllers/sensorController.js';

const router = express.Router();


router.post('/upload',handleUpload)


router.get('/fetch',handleFetch)


export default router;
