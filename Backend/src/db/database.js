import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
        
        if (!mongoUrl) {
            throw new Error("MONGODB_URL or MONGODB_URI is not defined in environment variables!");
        }

        // Clean up any trailing slash from the URL to prevent double slashes
        const baseUri = mongoUrl.endsWith('/') ? mongoUrl.slice(0, -1) : mongoUrl;

        const connectionParameter = await mongoose.connect(`${baseUri}/${DB_NAME}`);
        console.log(`\nDatabase Connected Successfully!! DB host:${connectionParameter.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Failed", error);
        process.exit(1);
    }
};

export default connectDB;