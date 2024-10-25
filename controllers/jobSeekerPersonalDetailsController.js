
import JobSeekerPersonalDetails from '../models/JobSeekerPersonalDetails.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi'; 

const personalDetailsSchema = Joi.object({
  dateOfBirth: Joi.date().iso().required(), 
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  nationality: Joi.string().required(),
  languagePreference: Joi.string().required(),
  disabilityOrHealthCondition: Joi.string().allow('').optional(), 
});
export const addPersonalDetails = async (req, res) => {
  const { error } = personalDetailsSchema.validate(req.body); 

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { dateOfBirth, gender, nationality, languagePreference, disabilityOrHealthCondition } = req.body;

    const newDetails = await JobSeekerPersonalDetails.create({
      dateOfBirth,
      gender,
      nationality,
      languagePreference,
      disabilityOrHealthCondition,
    });
          

    
    const token = jwt.sign({ userId: newDetails.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).json({
      message: 'Job Seeker  personal details registered successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getPersonalDetails = async (req, res) => {
  try {
    const details = await JobSeekerPersonalDetails.findAll();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personal details', error });
  }
};


export const updatePersonalDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const { dateOfBirth, gender, nationality, languagePreference, disabilityOrHealthCondition } = req.body;
  
      
      const updatedDetails = await JobSeekerPersonalDetails.update({
        dateOfBirth,
        gender,
        nationality,
        languagePreference,
        disabilityOrHealthCondition,
      }, {
        where: { id }, 
      });
  
      if (updatedDetails[0] === 0) {
        return res.status(404).json({ message: 'No record found with that ID' });
      }
  
      res.status(200).json({ message: 'Personal details updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating personal details', error });
    }
  };
  


export const deletePersonalDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedDetails = await JobSeekerPersonalDetails.destroy({
        where: { id }, 
      });
  
      if (deletedDetails === 0) {
        return res.status(404).json({ message: 'No record found with that ID' });
      }
  
      res.status(200).json({ message: 'Personal details deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting personal details', error });
    }
  };
    
