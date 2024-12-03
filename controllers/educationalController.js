import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import EducationalDetails from "../models/educationalModel.js";

const educationalDetailsSchema = Joi.object({
  educationType: Joi.string().required().messages({
    "string.base": "Education Type should be a string",
    "string.empty": "Education Type is required",
  }),
  university: Joi.string().required().messages({
    "string.base": "University should be a string",
    "string.empty": "University is required",
  }),
  fieldOfStudy: Joi.string().required().messages({
    "string.base": "Field of Study should be a string",
    "string.empty": "Field of Study is required",
  }),
  graduationYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Graduation Year must be a number",
      "number.min": "Graduation Year must be after 1900",
      "number.max": "Graduation Year cannot be in the future",
      "number.empty": "Graduation Year is required",
    }),
  grade: Joi.string().required().messages({
    "string.base": "Grade should be a string",
    "string.empty": "Grade is required",
  }),
  additionalDetails: Joi.string().optional().max(500).messages({
    "string.base": "Additional Details should be a string",
    "string.max": "Additional Details should not exceed 500 characters",
  }),
  postGraduationFile: Joi.string().optional(),
  graduationFile: Joi.string().optional(),
  underCertificationFile: Joi.string().optional(),
  sscFile: Joi.string().optional(),
});

const createEducationalDetails = async (req, res) => {
  const { error } = educationalDetailsSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const newEducationalDetail = await EducationalDetails.create(req.body);
    const token = jwt.sign(
      { Id: newEducationalDetail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ message: " posted successfully", newEducationalDetail, token });
  } catch (error) {
    console.error("Error creating :", error);
    res.status(500).json({ message: "Failed to post ", error: error.message });
  }
};

const getAllEducationalDetails = async (req, res) => {
  try {
    const educationalDetails = await EducationalDetails.findAll();
    res.status(200).json({ data: educationalDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getEducationalDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    const educationalDetail = await EducationalDetails.findByPk(id);
    if (!educationalDetail) {
      return res.status(404).json({ message: "Educational detail not found" });
    }
    res.status(200).json({ data: educationalDetail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateEducationalDetail = async (req, res) => {
  const { id } = req.params;

  const { error } = educationalDetailsSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const [updated] = await EducationalDetails.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Educational detail not found" });
    }

    const updatedEducationalDetail = await EducationalDetails.findByPk(id);
    res.status(200).json({
      message: "Educational detail updated successfully",
      data: updatedEducationalDetail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEducationalDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await EducationalDetails.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Educational detail not found" });
    }

    res
      .status(200)
      .json({ message: "Educational detail deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createEducationalDetails,
  getAllEducationalDetails,
  getEducationalDetailById,
  updateEducationalDetail,
  deleteEducationalDetail,
};
