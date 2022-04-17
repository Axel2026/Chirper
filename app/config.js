const config = {
    port: process.env.PORT || 3001,
    databaseUrl: process.env.MONGODB_URI || 'mongodb://admin:12345@cluster0-shard-00-00.r6n5m.mongodb.net:27017,cluster0-shard-00-01.r6n5m.mongodb.net:27017,cluster0-shard-00-02.r6n5m.mongodb.net:27017/usersdb?replicaSet=atlas-vwzeec-shard-0&ssl=true&authSource=admin',
    JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;
