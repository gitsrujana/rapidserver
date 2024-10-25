import express from "express";
import {
  addPersonalDetails,
  getPersonalDetails,
  updatePersonalDetails,
  deletePersonalDetails,
} from "../controllers/jobSeekerPersonalDetailsController.js";

const router = express.Router();

router.post("/add", addPersonalDetails);
router.get("/", getPersonalDetails);
router.patch("/:id", updatePersonalDetails);
router.delete("/:id", deletePersonalDetails);
export default router;
