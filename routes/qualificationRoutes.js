import express from "express";
import {
  submitQualification,
  getQualifications,
  getQualificationById,
  updateQualification,
  deleteQualification,
} from "../controllers/qualificationController.js";

const router = express.Router();

router.post("/register", submitQualification);
router.get("/", getQualifications);
router.get("/:id", getQualificationById);
router.put("/:id", updateQualification);
router.delete("/:id", deleteQualification);

export default router;
