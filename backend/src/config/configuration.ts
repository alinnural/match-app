export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
    whatsapp: {
        sessionPath: process.env.WA_SESSION_PATH || './.wwebjs_auth',
    },
});
