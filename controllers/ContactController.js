import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Contact from "../models/ContactModel.js";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const contactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(1).required(),
});

export const createContact = async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, mobile, email, message } = req.body;

  try {
    const existingContact = await Contact.findOne({ where: { email } });
    if (existingContact) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newContact = await Contact.create({
      name,
      mobile,
      email,
      message,
    });

    const token = jwt.sign({ userId: newContact.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Contact created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, mobile, email, message } = req.body;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.name = name || contact.name;
    contact.mobile = mobile || contact.mobile;
    contact.email = email || contact.email;
    contact.message = message || contact.message;

    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
