import mongoose from "mongoose";
import Course from "../models/Course";
import { coursesData } from "../data/coursesData";
import Quiz from "../models/Quiz";



async function setupDatabase() {
    const link = process.env.MONGODB_URI || 'mongodb://localhost:27017/our-app-db';
    try {
        await mongoose.connect(link);
        console.log("Connected to MongoDB");
        // You can call insertCourses here if needed
        await Course.deleteMany({});
        await Course.insertMany(coursesData);
        console.log("Courses inserted successfully");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

setupDatabase().catch((error) => {
    console.error("Error during setup:", error);
});