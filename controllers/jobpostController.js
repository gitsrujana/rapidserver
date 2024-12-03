import Joi from "joi";
import JobPost from "../models/JobPost.js"; 
import jwt from "jsonwebtoken";


const JWT_SECRET = "your_jwt_secret_key"; 


const jobPostSchema = Joi.object({
  jobTitle: Joi.string().required().messages({
    "string.empty": "Job title is required",
  }),
  jobLocation: Joi.string().required().messages({
    "string.empty": "Job location is required",
  }),
  openings: Joi.number().integer().required().messages({
    "number.base": "Openings must be a number",
    "any.required": "Number of openings is required",
  }),
  experienceLevel: Joi.string().valid("Any", "Freshers Only", "Experienced only"),
  minSalary: Joi.number().integer().optional(),
  maxSalary: Joi.number().integer().optional(),
  bonus: Joi.string().valid("Yes", "No").default("No"),
  jobDescription: Joi.string().required().messages({
    "string.empty": "Job description is required",
  }),
});


export const createJobPost = async (req, res) => {
  try {
    const { error } = jobPostSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((e) => e.message) });
    }

    const jobPost = await JobPost.create(req.body);
    const token = jwt.sign({ jobPosttId: jobPost.id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Job post created successfully", jobPost ,token});
  } catch (err) {
    console.error("Error creating job post:", err);
    res.status(500).json({ message: "Failed to create job post" });
  }
};


export const getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.findAll();
    res.status(200).json(jobPosts);
  } catch (err) {
    console.error("Error fetching job posts:", err);
    res.status(500).json({ message: "Failed to fetch job posts" });
  }
};


export const getJobPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findByPk(id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(200).json(jobPost);
  } catch (err) {
    console.error("Error fetching job post:", err);
    res.status(500).json({ message: "Failed to fetch job post" });
  }
};


export const updateJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = jobPostSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ errors: error.details.map((e) => e.message) });
    }

    const jobPost = await JobPost.findByPk(id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    await jobPost.update(req.body);
    res.status(200).json({ message: "Job post updated successfully", jobPost });
  } catch (err) {
    console.error("Error updating job post:", err);
    res.status(500).json({ message: "Failed to update job post" });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findByPk(id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    await jobPost.destroy();
    res.status(200).json({ message: "Job post deleted successfully" });
  } catch (err) {
    console.error("Error deleting job post:", err);
    res.status(500).json({ message: "Failed to delete job post" });
  }
};
