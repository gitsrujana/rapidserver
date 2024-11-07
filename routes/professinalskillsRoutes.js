import express from "express";
import {
  registerProfessionalSkills,
  getAllProfessionalSkills,
  getProfessionalSkillsById,
  updateProfessionalSkills,
  deleteProfessionalSkills,
} from "../controllers/professionalskillsController.js";

const router = express.Router();

router.post("/register", registerProfessionalSkills);
router.get("/", getAllProfessionalSkills);
router.get("/:id", getProfessionalSkillsById);
router.put("/:id", updateProfessionalSkills);
router.delete("/:id", deleteProfessionalSkills);
export default router;
