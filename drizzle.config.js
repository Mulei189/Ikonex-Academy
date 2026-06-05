import 'dotenv/config';

export default {
    schema: './src/models/*.js',
    out: './drizzle',
    dialaect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};