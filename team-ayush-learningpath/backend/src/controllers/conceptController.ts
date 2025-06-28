// src/controllers/conceptController.ts
import { Request, Response } from 'express';
import Concept from '../models/conceptModel';

/**
 * @desc    Fetch all available learning concepts (course catalog).
 * @route   GET /api/concepts
 * @access  Private
 */
export const getAllConcepts = async (req: Request, res: Response) => {
    try {
        // Only select fields needed for a catalog view to keep the payload small.
        const concepts = await Concept.find({}).select('title description complexity estLearningTimeHours level category');
        console.log('Found concepts:', concepts.length);
        res.status(200).json(concepts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Search concepts by title
 * @route   GET /api/concepts/search?q=query
 * @access  Private
 */
export const searchConcepts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        
        console.log('Searching for concepts with query:', q);
        
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const concepts = await Concept.find({
            title: { $regex: q, $options: 'i' }
        }).select('title description complexity estLearningTimeHours level category _id');

        console.log('Search results:', concepts.length, 'concepts found');
        res.status(200).json(concepts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Test endpoint to check if concepts exist
 * @route   GET /api/concepts/test
 * @access  Public
 */
export const testConcepts = async (req: Request, res: Response) => {
    try {
        const count = await Concept.countDocuments();
        const sampleConcepts = await Concept.find({}).limit(5).select('title _id');
        
        res.status(200).json({
            totalConcepts: count,
            sampleConcepts: sampleConcepts,
            message: count > 0 ? 'Concepts found in database' : 'No concepts found in database'
        });
    } catch (error) {
        console.error('Test concepts error:', error);
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

/**
 * @desc    Fetch a single, detailed concept by its ID.
 * @route   GET /api/concepts/:id
 * @access  Private
 */
export const getConceptById = async (req: Request, res: Response) => {
    try {
        // Populate prerequisites to show their titles, creating the visible graph.
        const concept = await Concept.findById(req.params.id)
            .populate('prerequisites', 'title');
            
        if (concept) {
            res.status(200).json(concept);
        } else {
            res.status(404).json({ message: 'Concept not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
