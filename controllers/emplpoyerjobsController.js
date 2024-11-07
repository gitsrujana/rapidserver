import employerjobs from '../models/employerjobs.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi';


const SECRET_KEY = 'your_secret_key';


const employerJobPostSchema = Joi.object({
  jobTitle: Joi.string().required(),
  jobLocation: Joi.string().required(),
  openings: Joi.number().integer().positive().required(),
  experienceLevel: Joi.string().valid('Any', 'Freshers Only', 'Experienced only').required(),
  minSalary: Joi.number().integer().positive().allow(null, ''),
  maxSalary: Joi.number().integer().positive().allow(null, ''),
  bonus: Joi.string().valid('Yes', 'No').required(),
  jobDescription: Joi.string().min(20).required(),
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token is required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};


export const registerEmployerJobPost = async (req, res) => {

    const { error } = employerJobPostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

   
    const { jobTitle, jobLocation, openings, experienceLevel, minSalary, maxSalary, bonus, jobDescription } = req.body;

    try {
    
        const existingJobPost = await employerjobs.findOne({ where: { jobTitle, jobLocation } });
        if (existingJobPost) {
            return res.status(400).json({ message: 'A job post with this title and location already exists.' });
        }

       
        const newJobPost = await employerjobs.create({
            jobTitle,
            jobLocation,
            openings,
            experienceLevel,
            minSalary,
            maxSalary,
            bonus,
            jobDescription,
        });

    
        const token = jwt.sign({ jobId: newJobPost.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            message: 'Job posted successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getAllJobPosts = async (req, res) => {
  try {
    const jobs = await employerjobs.findAll();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve job posts' });
  }
};


export const getJobPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await employerjobs.findOne({ where: { id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve job post' });
  }
};


export const updateJobPost = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = employerJobPostSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const [updated] = await employerjobs.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Job not found' });

    const updatedJob = await employerjobs.findOne({ where: { id } });
    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job post' });
  }
};


export const deleteJobPost = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await employerjobs.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Job not found' });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job post' });
  }
};


export const generateToken = (req, res) => {
  const user = { id: req.body.id }; 
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token });
};
