import { DataTypes } from 'sequelize';
import sequelize  from '../config/db.js';

const JobseekerProfessionalDetails = sequelize.define('JobseekerProfessionalDetails', {
  professionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentJob: {
    type: DataTypes.STRING,
  },
  experience: {
    type: DataTypes.STRING, 
  },
  technicalSkills: {
    type: DataTypes.STRING,
  },
  licenses: {
    type: DataTypes.STRING,
  },
  careerObjective: {
    type: DataTypes.TEXT,
  }
}, {
  timestamps: true,
  tableName: 'job_seeker_professional_details' 
});

export default JobseekerProfessionalDetails;
