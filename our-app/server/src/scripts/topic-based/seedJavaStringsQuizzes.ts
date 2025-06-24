import mongoose from "mongoose";
import Course from "../../models/Course";
import Quiz from "../../models/Quiz";
import advancedQuiz from "../../data/java/advanced/Strings";
import beginnerQuiz from "../../data/java/beginner/Strings";
import intermediateQuiz from "../../data/java/intermediate/Strings";

const seedJavaStringsQuizzes = async () => {
    try {
        const stringsCourse = await Course.findOne({ title: 'Strings' });

        if (!stringsCourse) {
            console.error("Could not find the 'Strings' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'Strings', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = stringsCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = stringsCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java Strings quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java Strings quizzes:", error);
        throw error;
    }
};

export default seedJavaStringsQuizzes; 