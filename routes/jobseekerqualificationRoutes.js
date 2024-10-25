import express from "express";
import {
  createJobseekerQualification,
  getJobseekerQualifications,
  updateJobseekerQualification,
  deleteJobseekerQualification,
  getJobseekerQualificationById,
} from "../controllers/jobseekerqualificationController.js";

const router = express.Router();

router.post("/create", createJobseekerQualification);
router.get("/", getJobseekerQualifications);
router.get("/:id", getJobseekerQualificationById);
router.put("/:id", updateJobseekerQualification);
router.delete("/:id", deleteJobseekerQualification);

export default router;
