import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employer from "../models/employerModel.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const registrationSchema = Joi.object({
  companyName: Joi.string().min(1).required(),
  contactNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerEmployer = async (req, res) => {
  const { error } = registrationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { companyName, contactNumber, email, password } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = await Employer.create({
      companyName,
      contactNumber,
      email,
      password: hashedPassword,
      photo: req.file ? req.file.filename : null,
    });

    const token = jwt.sign({ userId: newEmployer.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Employer registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.findAll();
    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployerById = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findByPk(id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const { companyName, contactNumber, email, photo } = req.body;

  try {
    const employer = await Employer.findByPk(id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    employer.companyName = companyName;
    employer.contactNumber = contactNumber;
    employer.email = email;
    employer.photo = photo;

    await employer.save();
    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmployer = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findByPk(id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    await employer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const loginEmployer = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, employer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: employer.id, email: employer.email },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
