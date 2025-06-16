import multer, { diskStorage } from 'multer';
import path from 'path';

<<<<<<< HEAD:team-parthan-assessment/backend/src/middlewares/uploadMiddleware.ts


const upload = multer({ dest: 'uploads/' });
=======
const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });
>>>>>>> aba7c5d6916189a4a4cfee98ddb1f6e0ed96a84d:project-assessment/backend/middlewares/uploadMiddleware.ts
export default upload;
