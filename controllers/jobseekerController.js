

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import JobSeeker from '../models/jobseekerModel.js'
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


const registrationSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  middleName: Joi.string().allow('').optional(),
  contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required(), 
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerJobSeeker = async (req, res) => {
  const { error } = registrationSchema.validate(req.body); 

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { firstName, lastName, middleName, contactNumber, email, password } = req.body;

  try {
    const existingJobSeeker = await JobSeeker.findOne({ where: { email } });
    if (existingJobSeeker) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newJobSeeker = await JobSeeker.create({
      firstName,
      lastName,
      middleName,
      contactNumber,
      email,
      password: hashedPassword,
      photo: req.file ? req.file.filename : null,
    });

    const token = jwt.sign({ userId: newJobSeeker.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Job Seeker registered successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobSeekers = async (req, res) => {
    try {
      const jobSeekers = await JobSeeker.findAll();
      res.status(200).json(jobSeekers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  export const getJobSeekerById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const jobSeeker = await JobSeeker.findByPk(id);
      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }
      res.status(200).json(jobSeeker);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const updateJobSeeker = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, middleName, contactNumber, email, photo } = req.body;
  
    try {
      const jobSeeker = await JobSeeker.findByPk(id);
      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }
  

      jobSeeker.firstName = firstName;
      jobSeeker.lastName = lastName;
      jobSeeker.middleName = middleName;
      jobSeeker.contactNumber = contactNumber;
      jobSeeker.email = email;
      jobSeeker.photo = photo;
  
      await jobSeeker.save();
      res.status(200).json(jobSeeker);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
 
  export const deleteJobSeeker = async (req, res) => {
    const { id } = req.params;
  
    try {
      const jobSeeker = await JobSeeker.findByPk(id);
      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }
  
      await jobSeeker.destroy();
      res.status(204).send(); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
           



     
  export const loginJobSeeker = async (req, res) => {


    const { error } = loginSchema.validate(req.body); 

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
  
    try {
      
      const jobSeeker = await JobSeeker.findOne({ where: { email } });
      if (!jobSeeker) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }
  
    
      const isPasswordValid = await bcrypt.compare(password, jobSeeker.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      
      const token = jwt.sign(
        { id: jobSeeker.id, email: jobSeeker.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '1h' }
      );
  
   
      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const uploadPhoto = upload.single('photo');
