import express from "express";
import {
  registerEmployer,
  getAllEmployers,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
} from "../controllers/employerController.js";

const router = express.Router();

router.post("/", registerEmployer);

router.get("/", getAllEmployers);
router.get("/:id", getEmployerById);

router.put("/:id", updateEmployer);

router.delete("/:id", deleteEmployer);

export default router;
