import JobSeeker from "../models/jobseekerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const registrationSchema = Joi.object({
  firstName: Joi.string().required(),
  middleName: Joi.string().optional().allow(''),
  lastName: Joi.string().optional().allow(''),
  surname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords must match" }),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  workStatus: Joi.string().valid("fresher", "experienced").required(),
  promotions: Joi.boolean(),
  otp: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const otps = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "srujanabadepally123@gmail.com",
    pass: "cvvx itcg soyq lksq",
  },
});

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = uuidv4().slice(0, 6);
  otps.set(email, otp);

  const mailOptions = {
    from: "srujanabadepally123@gmail.com",
    to: email,
    subject: "Your OTP for Job Portal Registration",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const otpStore = {};
export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();


export const storeOtp = async (email, otp) => {
  const hashedOtp = await bcrypt.hash(otp, 10);
  otpStore[email] = { otp: hashedOtp, expires: Date.now() + 5 * 60 * 1000 };
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
console.log('email:', email);
console.log('otp:', otp);
console.log('otps: ', otps)
console.log('otps.get(email) === otp: ', otps.get(email) === otp);


  if (otps.get(email) === otp) {
    otps.delete(email);
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
};

export const registerJobSeeker = async (req, res) => {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const {
      firstName,
      middleName,
      lastName,
      surname,
      email,
      password,
      confirmPassword, 
      mobileNumber,
      workStatus,
      promotions,
    } = req.body;
  
    try {

      const existingJobSeeker = await JobSeeker.findOne({ where: { email } });
      if (existingJobSeeker) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
   
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
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
  
      
      const token = jwt.sign(
        { userId: newJobSeeker.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({
        message: "Job Seeker registered successfully",
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
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
      return res.status(404).json({ message: "Job seeker not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, jobSeeker.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: jobSeeker.id, email: jobSeeker.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await JobSeeker.findByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = jwt.sign({ userId: user.id }, RESET_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await JobSeeker.setResetToken(email, resetToken, resetTokenExpires);

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `Please use the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
    const user = await JobSeeker.findByResetToken(token);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await JobSeeker.updatePassword(user.id, passwordHash);

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.findAll();
    res.status(200).json(jobSeekers);
  } catch (error) {
    console.error("Error fetching job seekers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobSeekerById = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findByPk(req.params.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker not found" });
    }
    res.status(200).json(jobSeeker);
  } catch (error) {
    console.error("Error fetching job seeker:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJobSeeker = async (req, res) => {
  const { error } = registrationSchema.validate(req.body, {
    allowUnknown: true,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const jobSeeker = await JobSeeker.findByPk(req.params.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker not found" });
    }

    const { password, ...updatedData } = req.body;

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await jobSeeker.update(updatedData);
    res
      .status(200)
      .json({ message: "Job Seeker updated successfully", data: jobSeeker });
  } catch (error) {
    console.error("Error updating job seeker:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJobSeeker = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findByPk(req.params.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: "Job Seeker not found" });
    }

    await jobSeeker.destroy();
    res.status(200).json({ message: "Job Seeker deleted successfully" });
  } catch (error) {
    console.error("Error deleting job seeker:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
