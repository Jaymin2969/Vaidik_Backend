import mongoose from 'mongoose';
import { MONGO_URL } from './../config/index.js';
const connectDB = async() => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};
export { connectDB };