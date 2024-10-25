import JobseekerQualification from '../models/jobseekerqualification.js';
import jwt from 'jsonwebtoken';

export const createJobseekerQualification = async (req, res) => {
  const { education, university, fieldOfStudy, graduationYear, grade, additionalInfo } = req.body;

  try {
    const qualification = await JobseekerQualification.create({
      education,
      university,
      fieldOfStudy,
      graduationYear,
      grade,
      additionalInfo,
    });


    const token = jwt.sign({ userId: qualification.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
    res.status(201).json({ message: 'Jobseeker qualification added successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getJobseekerQualifications = async (req, res) => {
  try {
    const qualifications = await JobseekerQualification.findAll();
    res.status(200).json(qualifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getJobseekerQualificationById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const qualification = await JobseekerQualification.findByPk(id);
  
      if (!qualification) {
        return res.status(404).json({ message: 'Qualification not found' });
      }
  
      res.status(200).json(qualification);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

export const updateJobseekerQualification = async (req, res) => {
    const { id } = req.params;
    const { education, university, fieldOfStudy, graduationYear, grade, additionalInfo } = req.body;
  
    try {
      const qualification = await JobseekerQualification.findByPk(id);
  
      if (!qualification) {
        return res.status(404).json({ message: 'Qualification not found' });
      }
  
      qualification.education = education;
      qualification.university = university;
      qualification.fieldOfStudy = fieldOfStudy;
      qualification.graduationYear = graduationYear;
      qualification.grade = grade;
      qualification.additionalInfo = additionalInfo;
  
      await qualification.save();
  
      res.status(200).json({ message: 'Qualification updated successfully', qualification });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
 
export const deleteJobseekerQualification = async (req, res) => {
    const { id } = req.params;
  
    try {
      const qualification = await JobseekerQualification.findByPk(id);
  
      if (!qualification) {
        return res.status(404).json({ message: 'Qualification not found' });
      }
  
      await qualification.destroy();
  
      res.status(200).json({ message: 'Qualification deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
