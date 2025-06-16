//Author: Nabarupa, Banik
import { Request, Response } from 'express';
import { GNNRecommendationService } from '../services/gnnRecommendationService';
import { Recommendation } from '../models/Recommendation';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check for cached recommendations
    const cachedRecommendations = await Recommendation.findOne({
      userId: req.user.id,
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Less than 24 hours old
    });

    if (cachedRecommendations) {
      return res.json(cachedRecommendations);
    }

    // Generate new recommendations using GNN
    const recommendations = await GNNRecommendationService.generateRecommendations(req.user.id);
    return res.json({ recommendedTopics: recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
};

export const refreshRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Generate new recommendations using GNN
    const recommendations = await GNNRecommendationService.generateRecommendations(req.user.id);
    return res.json({ recommendedTopics: recommendations });
  } catch (error) {
    console.error('Error refreshing recommendations:', error);
    res.status(500).json({ message: 'Error refreshing recommendations' });
  }
};
