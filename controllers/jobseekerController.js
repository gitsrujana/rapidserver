import JobSeeker from '../models/jobseekerModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from 'dotenv';

dotenv.config();

const registrationSchema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords must match' }),
    mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    workStatus: Joi.string().valid('fresher', 'experienced').required(),
    promotions: Joi.boolean(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});


const otps = new Map();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    debug: true, 
    logger: true,
});


export const sendOtp = async (req, res) => {
    const { email } = req.body;

    const otp = uuidv4().slice(0, 6);
    otps.set(email, otp);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Job Portal Registration',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('OTP sent: ' + info.response); 
      return { message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { message: 'Error sending OTP', error: error.message };
    }
  };


const otpStore = {};
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


export const storeOtp = async (email, otp) => {
  const hashedOtp = await bcrypt.hash(otp, 10);
  otpStore[email] = { otp: hashedOtp, expires: Date.now() + 5 * 60 * 1000 }; 
};

export const verifyOtp = async(req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email]) {
      const { otp: storedOtp, expires } = otpStore[email];

      if (Date.now() > expires) {
          return res.status(400).json({ message: 'OTP expired' });
      }

      const isOtpValid = await bcrypt.compare(otp, storedOtp);

      if (isOtpValid) {
       
          await JobSeeker.update({ isVerified: true }, { where: { email } });
          delete otpStore[email];  
          return res.status(200).json({ message: 'OTP verified successfully' });
      }
  }

  return res.status(400).json({ message: 'Invalid or expired OTP' });
};


export const registerJobSeeker = async (req, res) => {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, middleName, lastName, surname, email, password, mobileNumber, workStatus, promotions } = req.body;

    try {
        const existingJobSeeker = await JobSeeker.findOne({ where: { email } });
        if (existingJobSeeker) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (!otps.has(email)) {
            return res.status(403).json({ message: 'OTP not verified. Please verify your email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newJobSeeker = await JobSeeker.create({
            firstName,
            middleName,
            lastName,
            surname,
            email,
            password: hashedPassword,
            mobileNumber,
            workStatus,
            promotions,
        });

        const token = jwt.sign({ userId: newJobSeeker.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        res.status(201).json({
            message: 'Job Seeker registered successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.findAll();
        res.status(200).json(jobSeekers);
    } catch (error) {
        console.error('Error fetching job seekers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getJobSeekerById = async (req, res) => {
    try {
        const jobSeeker = await JobSeeker.findByPk(req.params.id);
        if (!jobSeeker) {
            return res.status(404).json({ message: 'Job Seeker not found' });
        }
        res.status(200).json(jobSeeker);
    } catch (error) {
        console.error('Error fetching job seeker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateJobSeeker = async (req, res) => {
    const { error } = registrationSchema.validate(req.body, { allowUnknown: true });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const jobSeeker = await JobSeeker.findByPk(req.params.id);
        if (!jobSeeker) {
            return res.status(404).json({ message: 'Job Seeker not found' });
        }

        const { password, ...updatedData } = req.body;
        
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        await jobSeeker.update(updatedData);
        res.status(200).json({ message: 'Job Seeker updated successfully', data: jobSeeker });
    } catch (error) {
        console.error('Error updating job seeker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteJobSeeker = async (req, res) => {
    try {
        const jobSeeker = await JobSeeker.findByPk(req.params.id);
        if (!jobSeeker) {
            return res.status(404).json({ message: 'Job Seeker not found' });
        }

        await jobSeeker.destroy();
        res.status(200).json({ message: 'Job Seeker deleted successfully' });
    } catch (error) {
        console.error('Error deleting job seeker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
