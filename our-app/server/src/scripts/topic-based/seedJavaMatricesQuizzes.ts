import mongoose from "mongoose";
import Course from "../models/Course";
import Quiz from "../models/Quiz";
import advancedQuiz from "../data/java/advanced/Matrices";
import beginnerQuiz from "../data/java/beginner/Matrices";
import intermediateQuiz from "../data/java/intermediate/Matrices";

const seedJavaMatricesQuizzes = async () => {
    try {
        const matricesCourse = await Course.findOne({ title: 'Matrices' });

        if (!matricesCourse) {
            console.error("Could not find the 'Matrices' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'Matrices', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = matricesCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = matricesCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java Matrices quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java Matrices quizzes:", error);
        throw error;
    }
};

export default seedJavaMatricesQuizzes; 