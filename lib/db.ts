import mongoose from 'mongoose';

const connextDb = async (): Promise<void> => {
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL environment variable is not defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("hello mongoose");
    } catch (error) {
        console.error("Database connection failed:", (error as Error).message);
        process.exit(1);
    }
}

export default connextDb;