import express from 'express';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import newsRoutes from './routes/news.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "eNewspaper Backend API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/v1/auth",
            protected: "/api/v1/protected"
        }
    });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1/news', newsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    // console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});