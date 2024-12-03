
import express from "express";
import {
  createCompanyDetails,
  getAllCompanyDetails,
  getCompanyDetailsById,
  updateCompanyDetails,
  deleteCompanyDetails,
} from '../controllers/companydetailsController.js'

const router = express.Router();

router.post("/register", createCompanyDetails);
router.get("/getdata", getAllCompanyDetails);
router.get("/getdata/:id", getCompanyDetailsById);
router.put("/update/:id", updateCompanyDetails);
router.delete("/delete/:id", deleteCompanyDetails);

export default router;
