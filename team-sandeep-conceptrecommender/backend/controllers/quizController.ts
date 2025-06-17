//Author: Pentapati V V Satya Pavan Sandeep
import { Request, Response } from 'express';
import { Quiz } from '../models/Quiz';
import { UserTopic } from '../models/UserTopic';
import { Topic } from '../models/Topic';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
  };
}

export const getTopicQuiz = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { topicId } = req.params;

    // Get quiz for the topic
    const quiz = await Quiz.findOne({ topicId });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found for this topic' });
    }

    // Check if user has already taken this quiz
    const userTopic = await UserTopic.findOne({
      userId: req.user._id,
      topicId,
    });

    if (userTopic && userTopic.status === 'completed') {
      return res.status(400).json({ error: 'You have already completed this topic' });
    }

    // Return quiz without correct answers
    const quizWithoutAnswers = {
      ...quiz.toObject(),
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
      })),
    };

    res.json(quizWithoutAnswers);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { topicId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    // Get quiz and check answers
    const quiz = await Quiz.findOne({ topicId });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) correctAnswers++;
      return {
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    // Update user's topic status
    let userTopic = await UserTopic.findOne({
      userId: req.user._id,
      topicId,
    });

    if (!userTopic) {
      userTopic = new UserTopic({
        userId: req.user._id,
        topicId,
      });
    }

    userTopic.status = passed ? 'completed' : 'in-progress';
    userTopic.progress = passed ? 100 : Math.round(score);
    await userTopic.save();

    // Update topic status
    const topic = await Topic.findById(topicId);
    if (topic) {
      topic.status = passed ? 'completed' : 'in-progress';
      topic.progress = passed ? 100 : Math.round(score);
      await topic.save();
    }

    res.json({
      score,
      passed,
      results,
      topicStatus: userTopic.status,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { topicId, questions, passingScore, timeLimit, difficulty } = req.body;

    // Check if quiz already exists for this topic
    const existingQuiz = await Quiz.findOne({ topicId });
    if (existingQuiz) {
      return res.status(400).json({ error: 'Quiz already exists for this topic' });
    }

    const quiz = new Quiz({
      topicId,
      questions,
      passingScore: passingScore || 70,
      timeLimit: timeLimit || 30,
      difficulty,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
};
