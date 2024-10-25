import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const JobseekerQualification = sequelize.define('JobseekerQualification', {
  education: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  university: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fieldOfStudy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
},{
    tableName:'jobseeker-qualification',
    timestamps: true,
});

export default JobseekerQualification;
