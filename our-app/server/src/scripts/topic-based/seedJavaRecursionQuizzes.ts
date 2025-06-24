import mongoose from "mongoose";
import Course from "../../models/Course";
import Quiz from "../../models/Quiz";
import advancedQuiz from "../../data/java/advanced/Recursion";
import beginnerQuiz from "../../data/java/beginner/Recursion";
import intermediateQuiz from "../../data/java/intermediate/Recursion";

const seedJavaRecursionQuizzes = async () => {
    try {
        const recursionCourse = await Course.findOne({ title: 'Recursion' });

        if (!recursionCourse) {
            console.error("Could not find the 'Recursion' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'Recursion', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = recursionCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = recursionCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java Recursion quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java Recursion quizzes:", error);
        throw error;
    }
};

export default seedJavaRecursionQuizzes; 