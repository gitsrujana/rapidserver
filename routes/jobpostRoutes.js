import express from "express";
import {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,

} from '../controllers/jobpostController.js';

const router = express.Router();

router.post("/register",  createJobPost); // Create a new job post
router.get("/",  getAllJobPosts); // Get all job posts
router.get("/:id",  getJobPostById); // Get job post by ID
router.put("/:id",  updateJobPost); // Update job post by ID
router.delete("/:id",  deleteJobPost); // Delete job post by ID

export default router;
