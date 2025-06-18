import express, { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import UserCourseProgress, { IUserCourseProgress } from '../models/UserCourseProgress';
import User, { IUser } from '../models/User';

const router = express.Router();

// GET topic list with status for frontend display
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    

    const allCourses: ICourse[] = await Course.find().lean();

    let userProgress = await UserCourseProgress.findOne({ userId });

    if (!userProgress) {
      userProgress = new UserCourseProgress({ userId, mastered: [], ready: ['basic_programming'] });
      
    }

    const mastered = userProgress.mastered || [];
    const ready = userProgress.ready || ['basic_programming'];

    const topics = allCourses.map(course => {
      const courseId = course._id.toString();
      let status: 'locked' | 'ready' | 'mastered' = 'locked';
      if (mastered.includes(courseId)) status = 'mastered';
      else if (ready.includes(courseId)) status = 'ready';

      return {
        id: courseId,
        name: course.name,
        prerequisites: course.prerequisites,
        status
      };
    });

    res.json(topics);
  } catch (err) {
    console.error("Error in /:id route:", err);
    res.status(500).json({ error: 'Error loading topics' });
  }
});

// POST update progress after quiz
router.post('/complete', async (req: Request, res: Response) => {
  const { userId, courseId, passed } = req.body;

  try {
    let progress = await UserCourseProgress.findOne({ userId });

    if (!progress) {
      progress = new UserCourseProgress({ userId, mastered: [], ready: ['basic_programming'] });
    }

    if (passed) {
      if (!progress.mastered.includes(courseId)) {
        progress.mastered.push(courseId);
      }

      // Remove from ready if present
      progress.ready = progress.ready.filter(id => id !== courseId);

      const course: ICourse | null = await Course.findById(courseId);
      if (course) {
        for (const prereq of course.prerequisites) {
          if (!progress.ready.includes(prereq) && !progress.mastered.includes(prereq)) {
            progress.ready.push(prereq);
          }
        }
      }
    } else {
      if (!progress.ready.includes(courseId) && !progress.mastered.includes(courseId)) {
        progress.ready.push(courseId);
      }
    }

    await progress.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error in /complete route:", err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;
