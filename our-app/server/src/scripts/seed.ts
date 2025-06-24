import mongoose from "mongoose";
import seedCourses from "./seedCourses";
import seedUsers from "./seedUsers";
import seedJavaBeginnerQuizzes from "./difficulty-based/seedJavaBeginnerQuizzes";
import seedJavaIntermediateQuizzes from "./difficulty-based/seedJavaIntermediateQuizzes";
import seedJavaAdvancedQuizzes from "./difficulty-based/seedJavaAdvancedQuizzes";

// Topic-based seeding is available but not used by default
// import seedJavaTopicQuizzes from "./topic-based/seedJavaTopicQuizzes";

async function seedDatabase() {
    const link = process.env.MONGODB_URI || 'mongodb://localhost:27017/our-app-db';
    try {
        await mongoose.connect(link);
        console.log("Connected to MongoDB");

        await seedCourses();
        await seedUsers();

        // Using difficulty-based seeding approach
        await seedJavaBeginnerQuizzes();
        await seedJavaIntermediateQuizzes();
        await seedJavaAdvancedQuizzes();

        // Alternative topic-based approach
        // await seedJavaTopicQuizzes();

        console.log("Database seeding completed successfully.");
    } catch (error) {
        console.error("Error during database seeding:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seedDatabase(); 