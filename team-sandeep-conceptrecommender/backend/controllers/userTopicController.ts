Author: Nabarupa, Banik
import { Request, Response } from 'express';
import { UserTopic } from '../models/UserTopic';
import { Topic } from '../models/Topic';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
  };
}

export const selectTopics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { topicIds } = req.body;

    if (!Array.isArray(topicIds)) {
      return res.status(400).json({ error: 'topicIds must be an array' });
    }

    // Validate that all topics exist
    const topics = await Topic.find({ _id: { $in: topicIds } });
    if (topics.length !== topicIds.length) {
      return res.status(400).json({ error: 'One or more topics not found' });
    }

    // Create user-topic relationships
    const userTopics = await Promise.all(
      topicIds.map(async (topicId) => {
        try {
          const userTopic = new UserTopic({
            userId: req.user._id,
            topicId,
            status: 'selected',
          });
          return await userTopic.save();
        } catch (error) {
          // If the user-topic relationship already exists, ignore the error
          if (error.code === 11000) {
            return null;
          }
          throw error;
        }
      })
    );

    // Filter out null values (duplicate entries)
    const savedUserTopics = userTopics.filter((ut) => ut !== null);

    res.status(201).json({
      message: 'Topics selected successfully',
      selectedTopics: savedUserTopics,
    });
  } catch (error) {
    console.error('Error selecting topics:', error);
    res.status(500).json({ error: 'Failed to select topics' });
  }
};

export const getUserTopics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userTopics = await UserTopic.find({ userId: req.user._id })
      .populate('topicId')
      .sort({ createdAt: -1 });

    res.json(userTopics);
  } catch (error) {
    console.error('Error fetching user topics:', error);
    res.status(500).json({ error: 'Failed to fetch user topics' });
  }
};

export const updateTopicProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { topicId } = req.params;
    const { progress, status } = req.body;

    const userTopic = await UserTopic.findOne({
      userId: req.user._id,
      topicId,
    });

    if (!userTopic) {
      return res.status(404).json({ error: 'Topic not found for this user' });
    }

    if (progress !== undefined) {
      userTopic.progress = Math.min(Math.max(progress, 0), 100);
    }

    if (status) {
      userTopic.status = status;
    }

    userTopic.lastAccessed = new Date();
    await userTopic.save();

    res.json(userTopic);
  } catch (error) {
    console.error('Error updating topic progress:', error);
    res.status(500).json({ error: 'Failed to update topic progress' });
  }
};
