import PaymentDetails from '../models/paymentModel.js'
import Joi from "joi";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const paymentValidationSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } }) 
      .required()
      .messages({
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.',
      }),
  
    cardNumber: Joi.string()
      .pattern(/^[0-9]{16}$/) 
      .required()
      .messages({
        'string.pattern.base': 'Card number must be a 16-digit number.',
        'any.required': 'Card number is required.',
      }),
  
    expiryDate: Joi.string()
      .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
      .required()
      .messages({
        'string.pattern.base': 'Expiry date must be in the format MM/YY.',
        'any.required': 'Expiry date is required.',
      }),
  
    cvc: Joi.string()
      .pattern(/^[0-9]{3,4}$/) 
      .required()
      .messages({
        'string.pattern.base': 'CVC must be a 3 or 4-digit number.',
        'any.required': 'CVC is required.',
      }),
  
    cardholderName: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.min': 'Cardholder name must be at least 3 characters long.',
        'string.max': 'Cardholder name must not exceed 50 characters.',
        'any.required': 'Cardholder name is required.',
      }),
  
    country: Joi.string()
  
      .required()
      .messages({
        'any.required': 'Country is required.',
      }),
  
    address: Joi.string()
      .min(5)
      .max(255)
      .optional()
      .messages({
        'string.min': 'Address must be at least 5 characters long.',
        'string.max': 'Address must not exceed 255 characters.',
      }),
  
    isBusiness: Joi.boolean()
      .required()
      .messages({
        'any.required': 'isBusiness field is required.',
      }),
  
    saveInfo: Joi.boolean()
      .required()
      .messages({
        'any.required': 'saveInfo field is required.',
      }),
  });



export const createPayment = async (req, res) => {
 
    const { error } = paymentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const {
      email,
      cardNumber,
      expiryDate,
      cvc,
      cardholderName,
      country,
      address,
      isBusiness,
      saveInfo,
    } = req.body;

   

   try{
    const payment = await PaymentDetails.create({
      email,
      cardNumber,
      expiryDate,
      cvc,
      cardholderName,
      country,
      address,
      isBusiness,
      saveInfo,
    });
           
    const token = jwt.sign({ paymentId: payment.id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: " Payment details saved successfully!",
      data: payment,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentDetails.findAll();
    return res.status(200).json({ data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentDetails.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    return res.status(200).json({ data: payment });
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const payment = await PaymentDetails.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    await payment.update(updatedData);

    return res.status(200).json({
      message: 'Payment details updated successfully!',
      data: payment,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await PaymentDetails.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    await payment.destroy();

    return res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
