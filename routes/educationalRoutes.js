import express from 'express';
import {
  
  createEducationalDetails,
  getAllEducationalDetails,
  getEducationalDetailById,
  updateEducationalDetail,
  deleteEducationalDetail,
} from '../controllers/educationalController.js'

const router = express.Router();

// Public routes
router.get('/educational-details', getAllEducationalDetails);
router.get('/educational-details/:id', getEducationalDetailById);

// Private routes (requires token)
router.post('/register', createEducationalDetails);
router.put('/educational-details/:id',  updateEducationalDetail);
router.delete('/educational-details/:id',  deleteEducationalDetail);

export default router;
