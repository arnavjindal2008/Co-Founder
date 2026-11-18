import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Middleware to read JSON data
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CoFounder API is running!',
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is healthy!',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CoFounder server running on port ${PORT}`);
});
