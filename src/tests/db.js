const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

// connect to db
module.exports.connect = async () => {
    if (!mongod) {
        // This will create an new instance of "MongoMemoryServer" and
        // automatically start it
        mongod = await MongoMemoryServer.create();

        const uri = await mongod.getUri();
        const mongooseOpts = {
            useUnifiedTopology: true,
            maxPoolsize: 10,
        };

        await mongoose.connect(uri, mongooseOpts);
    }
};

// To stop the db server
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
        await mongod.stop();
    }
};

// to remove all the documents from all the collections of db
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        collection.deleteMany();
    }
};
