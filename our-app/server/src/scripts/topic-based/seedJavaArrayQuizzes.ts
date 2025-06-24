import mongoose from "mongoose";
import Course from "../../models/Course";
import Quiz from "../../models/Quiz";
import advancedQuiz from "../../data/java/advanced/Arrays";
import beginnerQuiz from "../../data/java/beginner/Arrays";
import intermediateQuiz from "../../data/java/intermediate/Arrays";

const seedJavaArrayQuizzes = async () => {
    try {
        const arraysCourse = await Course.findOne({ title: 'Arrays' });

        if (!arraysCourse) {
            console.error("Could not find the 'Arrays' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'Arrays', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = arraysCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = arraysCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java Arrays quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java Arrays quizzes:", error);
        throw error;
    }
};

export default seedJavaArrayQuizzes; 