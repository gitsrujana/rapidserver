import express from 'express';
import {
    registerEmployerJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,

} from '../controllers/emplpoyerjobsController.js'

const router = express.Router();




router.post('/jobs', registerEmployerJobPost);
router.get('/jobs', getAllJobPosts);
router.get('/jobs/:id', getJobPostById);
router.put('/jobs/:id', updateJobPost);
router.delete('/jobs/:id', deleteJobPost);

export default router;
