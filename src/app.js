import express from 'express';
import logger from '#config/logger.js';
import helmet from "helmet";
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#modules/authentication/auth.routes.js';
import userRoutes from '#modules/users/users.routes.js';
import classStreamsRoutes from '#modules/class-streams/class-streams.routes.js';
import studentsRoutes from '#modules/students/students.routes.js';
import subjectsRoutes from '#modules/subjects/subjects.routes.js';
import assessmentsRoutes from "#modules/assessments/assessments.routes.js";
import gradingScaleRoutes from "#modules/grading-scale/grading-scale.routes.js";
import resultsRoutes from "#modules/results/results.routes.js"
import reportsRoutes from "#modules/reports/reports.routes.js"
import { errorHandler, notFoundHandler } from '#middlewares/error.middleware.js'

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

app.get('/', (req, res) => {
  logger.info('Hello from the Ikonex Academy API!');
  res.send('Hello and welcome to Ikonex Academy!');
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Ikonex Academy API is working' });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/class-streams', classStreamsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use("/api/assessments", assessmentsRoutes);
app.use("/api/grading-scales", gradingScaleRoutes);
app.use("/api/results",  resultsRoutes);
app.use("/api/reports", reportsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
