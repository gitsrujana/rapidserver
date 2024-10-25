import express from "express";
import {
  createJobseekerProfessionalDetails,
  getAllJobseekerProfessionalDetails,
  updateJobseekerProfessionalDetails,
  deleteJobseekerProfessionalDetails,
} from "../controllers/jobseekerProfessionalDetailsController.js"; 

const router = express.Router();

router.post("/add", createJobseekerProfessionalDetails);
router.get("/", getAllJobseekerProfessionalDetails);
router.put("/:id", updateJobseekerProfessionalDetails);
router.delete("/:id", deleteJobseekerProfessionalDetails);

export default router;
