import mongoose from "mongoose";
import Course from "../../models/Course";
import Quiz from "../../models/Quiz";
import advancedQuiz from "../../data/java/advanced/LinkedLists";
import beginnerQuiz from "../../data/java/beginner/LinkedLists";
import intermediateQuiz from "../../data/java/intermediate/LinkedLists";

const seedJavaLinkedListsQuizzes = async () => {
    try {
        const linkedListsCourse = await Course.findOne({ title: 'LinkedLists' });

        if (!linkedListsCourse) {
            console.error("Could not find the 'LinkedLists' course. Skipping quiz insertion.");
            return;
        }

        await Quiz.deleteMany({ 'topic.courseName': 'LinkedLists', language: 'java' });

        const quizzes = [advancedQuiz, beginnerQuiz, intermediateQuiz];
        for (const quizData of quizzes) {
            if (quizData.topic) {
                quizData.topic.courseID = linkedListsCourse._id as mongoose.Types.ObjectId;
                quizData.topic.courseName = linkedListsCourse.title;
            }

            await Quiz.create(quizData);
            console.log(`Inserted quiz: ${quizData.title}`);
        }
        console.log("Java LinkedLists quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java LinkedLists quizzes:", error);
        throw error;
    }
};

export default seedJavaLinkedListsQuizzes; 