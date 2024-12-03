
import Joi from "joi";
import CompanyDetails from "../models/CompanyDetails.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key";


const companyDetailsSchema = Joi.object({
  jobTimings: Joi.string().optional(),
  interviewDetails: Joi.string().optional(),
  companyName: Joi.string().required().messages({
    "string.empty": "Company name is required",
  }),
  contactPersonName: Joi.string().required().messages({
    "string.empty": "Contact person name is required",
  }),
  phoneNumber: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  contactPersonProfile: Joi.string().required().messages({
    "string.empty": "Contact person profile is required",
  }),
  sizeOfOrganization: Joi.string().required().messages({
    "string.empty": "Size of organization is required",
  }),
  jobAddress: Joi.string().required().messages({
    "string.empty": "Job address is required",
  }),
  hiringFrequency: Joi.string().required().messages({
    "any.required": "Hiring frequency is required",
    "any.only": "Hiring frequency must be one of the specified options",
  }),
  termsAccepted: Joi.boolean().valid(true).required().messages({
    "any.required": "Terms acceptance is required",
  }),
  logo: Joi.any().optional(),
});

export const createCompanyDetails = async (req, res) => {
  try {
    const { error } = companyDetailsSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((e) => e.message) });
    }

    const companyDetails = await CompanyDetails.create(req.body);
    const token = jwt.sign({ companyDetailsId: companyDetails.id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Company details created successfully", companyDetails, token });
  } catch (err) {
    console.error("Error creating company details:", err);
    res.status(500).json({ message: "Failed to create company details" });
  }
};

export const getAllCompanyDetails = async (req, res) => {
  try {
    const companyDetails = await CompanyDetails.findAll();
    res.status(200).json(companyDetails);
  } catch (err) {
    console.error("Error fetching company details:", err);
    res.status(500).json({ message: "Failed to fetch company details" });
  }
};

export const getCompanyDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyDetails = await CompanyDetails.findByPk(id);
    if (!companyDetails) {
      return res.status(404).json({ message: "Company details not found" });
    }
    res.status(200).json(companyDetails);
  } catch (err) {
    console.error("Error fetching company details:", err);
    res.status(500).json({ message: "Failed to fetch company details" });
  }
};

export const updateCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = companyDetailsSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((e) => e.message) });
    }

    const companyDetails = await CompanyDetails.findByPk(id);
    if (!companyDetails) {
      return res.status(404).json({ message: "Company details not found" });
    }

    await companyDetails.update(req.body);
    res.status(200).json({ message: "Company details updated successfully", companyDetails });
  } catch (err) {
    console.error("Error updating company details:", err);
    res.status(500).json({ message: "Failed to update company details" });
  }
};

export const deleteCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const companyDetails = await CompanyDetails.findByPk(id);
    if (!companyDetails) {
      return res.status(404).json({ message: "Company details not found" });
    }

    await companyDetails.destroy();
    res.status(200).json({ message: "Company details deleted successfully" });
  } catch (err) {
    console.error("Error deleting company details:", err);
    res.status(500).json({ message: "Failed to delete company details" });
  }
};
