
import { DataTypes } from 'sequelize';
import  sequelize  from '../config/db.js';

const JobSeekerPersonalDetails = sequelize.define('JobSeekerPersonalDetails', {
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  languagePreference: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  disabilityOrHealthCondition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'job_seeker_personal_detail',
  timestamps: true,
});

export default JobSeekerPersonalDetails;
