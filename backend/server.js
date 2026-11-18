import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CoFounder API is running!',
  });
});

// Database health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      success: true,
      message: 'Backend and database are connected!',
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`CoFounder server running on port ${PORT}`);
});
