import Employer from "../models/employerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerEmployer = async (req, res) => {
  const { companyName, email, password, contactNumber } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = await Employer.create({
      companyName,
      email,
      password: hashedPassword,
      contactNumber,
    });

    const token = jwt.sign({ userId: newEmployer.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ message: "Employer registered successfully.", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.findAll();

    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getEmployerById = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findByPk(id);

    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const { companyName, email, contactNumber } = req.body;

  try {
    const employer = await Employer.findByPk(id);

    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    employer.companyName = companyName || employer.companyName;
    employer.email = email || employer.email;
    employer.contactNumber = contactNumber || employer.contactNumber;

    await employer.save();

    res
      .status(200)
      .json({ message: "Employer updated successfully.", employer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteEmployer = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findByPk(id);

    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    await employer.destroy();

    res.status(200).json({ message: "Employer deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginEmployer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return res.status(400).json({ message: "Employer not found." });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: employer.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
