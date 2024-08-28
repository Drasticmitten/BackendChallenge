import mongoose from "mongoose";

interface Options {
    mongoUri: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect(options: Options): Promise<void> {
        const { mongoUri, dbName } = options;
        try {
            await mongoose.connect(mongoUri, {
                dbName,
            });
        } catch (error) {
            console.error('Error connecting to MongoDB', error);
            throw error;
        }
    }
}
    