import Qualification from "../models/qualificationModel.js";
import jwt from "jsonwebtoken";
export const submitQualification = async (req, res) => {
  const {
    education,
    university,
    fieldOfStudy,
    graduationYear,
    grade,
    additional,
  } = req.body;

  if (!education || !university) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    const newQualification = await Qualification.create({
      education,
      university,
      fieldOfStudy,
      graduationYear,
      grade,
      additional,
    });

    const token = jwt.sign(
      { userId: newQualification.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
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

export const getQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    return res.status(200).json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getQualificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    return res.status(200).json(qualification);
  } catch (error) {
    console.error("Error fetching qualification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQualification = async (req, res) => {
  const { id } = req.params;
  const {
    education,
    university,
    fieldOfStudy,
    graduationYear,
    grade,
    additional,
  } = req.body;

  try {
    const updatedQualification = await Qualification.findByIdAndUpdate(
      id,
      {
        education,
        university,
        fieldOfStudy,
        graduationYear,
        grade,
        additional,
      },
      { new: true }
    );

    if (!updatedQualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }

    return res.status(200).json({
      message: "Qualification updated successfully!",
      data: updatedQualification,
    });
  } catch (error) {
    console.error("Error updating qualification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQualification = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQualification = await Qualification.findByIdAndDelete(id);
    if (!deletedQualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }

    return res
      .status(200)
      .json({ message: "Qualification deleted successfully!" });
  } catch (error) {
    console.error("Error deleting qualification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
