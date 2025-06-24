import mongoose from "mongoose";
import Course from "../models/Course";
import Quiz from "../models/Quiz";
import advancedQuiz from "../data/java/advanced/Queues";
import beginnerQuiz from "../data/java/beginner/Queues";
import intermediateQuiz from "../data/java/intermediate/Queues";

const seedJavaQueuesQuizzes = async () => {
    try {
        const queuesCourse = await Course.findOne({ title: 'Queues' });

        if (!queuesCourse) {
            console.error("Could not find the 'Queues' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'Queues', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = queuesCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = queuesCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java Queues quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java Queues quizzes:", error);
        throw error;
    }
};

export default seedJavaQueuesQuizzes; 