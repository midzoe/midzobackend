import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database.js';
// Import routes
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import countryRoutes from './routes/countries.js';
import universityRoutes from './routes/universities.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/universities', universityRoutes);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});
// Start server
async function startServer() {
    try {
        // Test database connection
        console.log('🔌 Connecting to database with Prisma...');
        const dbConnected = await connectDatabase();
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Please check your configuration.');
            process.exit(1);
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
            console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Graceful shutdown initiated...');
    await disconnectDatabase();
    console.log('✅ Database disconnected');
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🔄 Graceful shutdown initiated...');
    await disconnectDatabase();
    console.log('✅ Database disconnected');
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map