import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,

} from "../controllers/PersonalizedJobController.js"

const router = express.Router();


router.post("/create", createJob);


router.get("/get", getAllJobs);


router.get("/:id", getJobById);


router.put("/update/:id", updateJob);


router.delete("/delete/:id",deleteJob);

export default router;
