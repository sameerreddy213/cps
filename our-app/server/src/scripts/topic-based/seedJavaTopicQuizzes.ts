import mongoose from "mongoose";
import Course from "../../models/Course";
import Quiz from "../../models/Quiz";

// Import all topic quizzes
import advancedArrays from "../../data/java/advanced/Arrays";
import intermediateArrays from "../../data/java/intermediate/Arrays";
import beginnerArrays from "../../data/java/beginner/Arrays";

import advancedLinkedLists from "../../data/java/advanced/LinkedLists";
import intermediateLinkedLists from "../../data/java/intermediate/LinkedLists";
import beginnerLinkedLists from "../../data/java/beginner/LinkedLists";

import advancedMatrices from "../../data/java/advanced/Matrices";
import intermediateMatrices from "../../data/java/intermediate/Matrices";
import beginnerMatrices from "../../data/java/beginner/Matrices";

import advancedQueues from "../../data/java/advanced/Queues";
import intermediateQueues from "../../data/java/intermediate/Queues";
import beginnerQueues from "../../data/java/beginner/Queues";

import advancedRecursion from "../../data/java/advanced/Recursion";
import intermediateRecursion from "../../data/java/intermediate/Recursion";
import beginnerRecursion from "../../data/java/beginner/Recursion";

import advancedStacks from "../../data/java/advanced/Stacks";
import intermediateStacks from "../../data/java/intermediate/Stacks";
import beginnerStacks from "../../data/java/beginner/Stacks";

import advancedStrings from "../../data/java/advanced/Strings";
import intermediateStrings from "../../data/java/intermediate/Strings";
import beginnerStrings from "../../data/java/beginner/Strings";

// Topic-based seeding functions
const seedJavaArraysQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'Arrays', language: 'java' });
    const quizzes = [advancedArrays, intermediateArrays, beginnerArrays];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} Arrays quiz`);
    }
};

const seedJavaLinkedListsQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'LinkedLists', language: 'java' });
    const quizzes = [advancedLinkedLists, intermediateLinkedLists, beginnerLinkedLists];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} LinkedLists quiz`);
    }
};

const seedJavaMatricesQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'Matrices', language: 'java' });
    const quizzes = [advancedMatrices, intermediateMatrices, beginnerMatrices];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} Matrices quiz`);
    }
};

const seedJavaQueuesQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'Queues', language: 'java' });
    const quizzes = [advancedQueues, intermediateQueues, beginnerQueues];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} Queues quiz`);
    }
};

const seedJavaRecursionQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'Recursion', language: 'java' });
    const quizzes = [advancedRecursion, intermediateRecursion, beginnerRecursion];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} Recursion quiz`);
    }
};

const seedJavaStacksQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'Stacks', language: 'java' });
    const quizzes = [advancedStacks, intermediateStacks, beginnerStacks];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} Stacks quiz`);
    }
};

const seedJavaStringsQuizzes = async (course: any) => {
    await Quiz.deleteMany({ 'topic.courseName': 'Strings', language: 'java' });
    const quizzes = [advancedStrings, intermediateStrings, beginnerStrings];

    for (const quizData of quizzes) {
        if (quizData.topic) {
            quizData.topic.courseID = course._id;
            quizData.topic.courseName = course.title;
        }
        await Quiz.create(quizData);
        console.log(`Inserted ${quizData.topic?.difficulty} Strings quiz`);
    }
};

// Main topic-based seeding function
const seedJavaTopicQuizzes = async () => {
    try {
        const courses = await Course.find({
            title: {
                $in: ['Arrays', 'LinkedLists', 'Matrices', 'Queues',
                    'Recursion', 'Stacks', 'Strings']
            }
        });

        const courseMap = courses.reduce((map, course) => {
            map[course.title] = course;
            return map;
        }, {} as { [key: string]: any });

        // Seed each topic
        await seedJavaArraysQuizzes(courseMap['Arrays']);
        await seedJavaLinkedListsQuizzes(courseMap['LinkedLists']);
        await seedJavaMatricesQuizzes(courseMap['Matrices']);
        await seedJavaQueuesQuizzes(courseMap['Queues']);
        await seedJavaRecursionQuizzes(courseMap['Recursion']);
        await seedJavaStacksQuizzes(courseMap['Stacks']);
        await seedJavaStringsQuizzes(courseMap['Strings']);

        console.log("All Java topic quizzes inserted successfully.");
    } catch (error) {
        console.error("Error seeding Java topic quizzes:", error);
        throw error;
    }
};

export default seedJavaTopicQuizzes; 