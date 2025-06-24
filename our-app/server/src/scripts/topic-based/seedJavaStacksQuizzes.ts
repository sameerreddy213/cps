import mongoose from "mongoose";
import Course from "../models/Course";
import Quiz from "../models/Quiz";
import advancedQuiz from "../data/java/advanced/Stacks";
import beginnerQuiz from "../data/java/beginner/Stacks";
import intermediateQuiz from "../data/java/intermediate/Stacks";

const seedJavaStacksQuizzes = async () => {
    try {
        const stacksCourse = await Course.findOne({ title: 'Stacks' });

        if (!stacksCourse) {
            console.error("Could not find the 'Stacks' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'Stacks', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = stacksCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = stacksCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java Stacks quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java Stacks quizzes:", error);
        throw error;
    }
};

export default seedJavaStacksQuizzes; 