const config = {
    port: process.env.PORT || 3001,
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://admin:12345@cluster0.r6n5m.mongodb.net/usersdb',
    JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;
