import 'dotenv/config';
import express from 'express';

import pool from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';

const app = express();

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CoFounder API is running!'
    });
});

// Database health check
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.status(200).json({
            success: true,
            message: 'Server and database are connected.',
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        console.error('Health check error:', error);

        res.status(500).json({
            success: false,
            message: 'Database connection failed.'
        });
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});