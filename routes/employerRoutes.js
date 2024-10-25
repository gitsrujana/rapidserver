import express from "express";
import {
  registerEmployer,
  loginEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  getAllEmployers,
} from "../controllers/employerController.js";

const router = express.Router();

router.post("/register", registerEmployer);
router.get("/", getAllEmployers);
router.get("/:id", getEmployerById);
router.put("/:id", updateEmployer);
router.delete("/:id", deleteEmployer);

router.post("/login", loginEmployer);
export default router;
