import PersonalDetails from "../models/PersonalDetails.js";
import jwt from "jsonwebtoken";

export const submitDetails = async (req, res) => {
  const {
    dateOfBirth,
    gender,
    nationality,
    languagePreference,
    healthCondition,
  } = req.body;

  if (!dateOfBirth || !gender || !nationality || !languagePreference) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    const newDetails = await PersonalDetails.create({
      dateOfBirth,
      gender,
      nationality,
      languagePreference,
      healthCondition,
    });

    const token = jwt.sign({ userId: newDetails.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Job Seeker registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllDetails = async (req, res) => {
  try {
    const details = await PersonalDetails.findAll();
    res.status(200).json(details);
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    const details = await PersonalDetails.findByPk(id);
    if (!details) {
      return res.status(404).json({ message: "Details not found" });
    }
    res.status(200).json(details);
  } catch (error) {
    console.error("Error fetching personal details by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDetails = async (req, res) => {
  const { id } = req.params;
  const {
    dateOfBirth,
    gender,
    nationality,
    languagePreference,
    healthCondition,
  } = req.body;

  try {
    const details = await PersonalDetails.findByPk(id);
    if (!details) {
      return res.status(404).json({ message: "Details not found" });
    }

    details.dateOfBirth = dateOfBirth || details.dateOfBirth;
    details.gender = gender || details.gender;
    details.nationality = nationality || details.nationality;
    details.languagePreference =
      languagePreference || details.languagePreference;
    details.healthCondition = healthCondition || details.healthCondition;

    await details.save();
    res
      .status(200)
      .json({ message: "Details updated successfully", data: details });
  } catch (error) {
    console.error("Error updating personal details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const details = await PersonalDetails.findByPk(id);
    if (!details) {
      return res.status(404).json({ message: "Details not found" });
    }

    await details.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting personal details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
