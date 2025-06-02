import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './controllers/auth.js';
import bookRoutes from './controllers/books.js';
import reviewRoutes from './controllers/review.js';
import searchRoutes from './controllers/search.js';
import cors from 'cors'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', searchRoutes);  
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', reviewRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
