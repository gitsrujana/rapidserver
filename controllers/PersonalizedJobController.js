import jwt from "jsonwebtoken";
import Joi from "joi";
import Job from "../models/PersonalizedJobModel.js"
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const jobSchema = Joi.object({
  title: Joi.string().min(3).required(),
  company: Joi.string().min(2).required(),
  location: Joi.string().min(2).required(),
  experience: Joi.string().min(0).required(),
  salary: Joi.string().min(0).required(),
  description: Joi.string().min(20).required(),
  tags: Joi.array().items(Joi.string()),
  postedDate: Joi.date().required(),
});





export const createJob = async (req, res) => {
  const { error } = jobSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, company, location, experience, salary, description, tags, postedDate } = req.body;

  try {
    const newJob = await Job.create({
      title,
      company,
      location,
      experience,
      salary,
      description,
      tags,
      postedDate,
    });

    const token = jwt.sign({ jobId: newJob.id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};


export const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};


export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { error } = jobSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, company, location, experience, salary, description, tags, postedDate } = req.body;

  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.title = title;
    job.company = company;
    job.location = location;
    job.experience = experience;
    job.salary = salary;
    job.description = description;
    job.tags = tags;
    job.postedDate = postedDate;

    await job.save();
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};


export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};
