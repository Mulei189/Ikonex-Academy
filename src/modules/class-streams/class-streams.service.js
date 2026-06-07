import { asc, eq } from 'drizzle-orm';
import { classStreams } from './class-streams.models.js';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { desc } from "drizzle-orm";

// ClassStreamService class to handle business logic related to class streams
class ClassStreamService {
    async create(data) {
        try {
            const [stream] = await db
            .insert(classStreams)
            .values(data)
            .returning();
            logger.info(`Class stream created with ID: ${stream.id}`);
            return stream;
        } catch (error) {
            console.error("DB ERROR:", error);
            console.error("CAUSE:", error.cause);
            logger.error(`Error creating class stream: ${error.message}`);
            throw error;
        }
    }

    // Get all class streams with pagination
    async getAll(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
                const streams = await db
                    .select()
                    .from(classStreams)
                    .orderBy(asc(classStreams.createdAt))
                    .limit(limit)
                    .offset(offset);
                    logger.info(`Fetched class streams - Page: ${page}, Limit: ${limit}`);
                return streams;
        } catch (error) {
            logger.error(`Error fetching class streams: ${error.message}`);
            throw error;
        }
    }

    // Get a single class stream by ID
    async getById(id) {
        try {
            const [stream] = await db
                .select()
                .from(classStreams)
                .where(eq(classStreams.id, id));
            return stream;
        } catch (error) {
            logger.error(`Error fetching class stream: ${error.message}`);
            throw error;
        }
    }

    // Update a class stream by ID
    async update(id, data) {
        const [updatedStream] = await db
            .update(classStreams)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(classStreams.id, id))
            .returning();
        logger.info(`Class stream with ID: ${id} updated`);
        return updatedStream;
    }  

    // Delete a class stream by ID
    async delete(id) {
        const [stream] = await db
            .delete(classStreams)
            .where(eq(classStreams.id, id))
            .returning();
        logger.info(`Class stream with ID: ${id} deleted`);
        return stream;
    }

}

export default new ClassStreamService();
