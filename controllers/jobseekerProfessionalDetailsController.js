
import JobseekerProfessionalDetails from "../models/JobSeekerProfessionalDetails.js";
import jwt from 'jsonwebtoken';
import Joi from 'joi'; 

const professionalDetailsSchema = Joi.object({
  professionName: Joi.string().min(3).max(50).required(),
  currentJob: Joi.string().min(3).max(50).optional(),
  experience: Joi.string().pattern(/^\d+ months$/).optional(),
  technicalSkills: Joi.string().optional(),
  licenses: Joi.string().optional(),
  careerObjective: Joi.string().max(500).optional(),
});
export const createJobseekerProfessionalDetails = async (req, res) => {
    const { error } = professionalDetailsSchema.validate(req.body); 

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  const { professionName, currentJob, experience, technicalSkills, licenses, careerObjective } = req.body;
  
  try {
    const newDetails = await JobseekerProfessionalDetails.create({
      professionName,
      currentJob,
      experience,
      technicalSkills,
      licenses,
      careerObjective,
    });


    const token = jwt.sign({ userId: newDetails.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Job Seeker professional details registered successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

 


export const getAllJobseekerProfessionalDetails = async (req, res) => {
  try {
    const allDetails = await JobseekerProfessionalDetails.findAll();
    res.status(200).json(allDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateJobseekerProfessionalDetails = async (req, res) => {
    const { id } = req.params; 
    const { professionName, currentJob, experience, technicalSkills, licenses, careerObjective } = req.body;
  
    try {
      const [updated] = await JobseekerProfessionalDetails.update(
        { professionName, currentJob, experience, technicalSkills, licenses, careerObjective },
        { where: { id } } 
      );
  
      if (updated) {
        const updatedDetails = await JobseekerProfessionalDetails.findOne({ where: { id } });
        return res.status(200).json(updatedDetails);
      }
      throw new Error('Jobseeker professional details not found');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  export const deleteJobseekerProfessionalDetails = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await JobseekerProfessionalDetails.destroy({ where: { id } }); 
  
      if (deleted) {
        return res.status(204).send(); 
      }
      throw new Error('Jobseeker professional details not found');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
