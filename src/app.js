import express from 'express';
import logger from '#config/logger.js';
import helmet from "helmet";
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#modules/authentication/auth.routes.js';
import userRoutes from '#modules/users/users.routes.js';
import classStreamsRoutes from '#modules/class-streams/class-streams.routes.js';

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
export default app;
