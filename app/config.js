const config = {
    port: process.env.PORT || 3001,
    // databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://conversations:12345@cluster0.jet0b.mongodb.net/conversations',
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://admin:12345@cluster0.r6n5m.mongodb.net/usersdb',
    databaseUrlSendCastle: process.env.MONGODB_URI || 'mongodb+srv://conversations:12345@cluster0.jet0b.mongodb.net/conversations',
    JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;
