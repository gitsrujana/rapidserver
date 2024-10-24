

import express from 'express';
import { deleteJobSeeker, loginJobSeeker, registerJobSeeker, updateJobSeeker, uploadPhoto } from '../controllers/jobseekerController.js';
import { getAllJobSeekers ,getJobSeekerById} from '../controllers/jobseekerController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/register', uploadPhoto, registerJobSeeker);
router.get('/get-all-jobseekers', getAllJobSeekers);
router.get('/get-all-jobseekers/:id', getJobSeekerById);
router.put('/update-jobseekers/:id',protect,updateJobSeeker)
router.delete('/delete-jobseekers/:id',protect,deleteJobSeeker)


router.post('/jobseekers/login', loginJobSeeker);
export default router;
