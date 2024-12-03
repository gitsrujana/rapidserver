import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  // Assuming you have a database configuration file

const EducationalDetails = sequelize.define(
  'EducationalDetails',
  {
    educationType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    university: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    graduationYear: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1900,  // Adjust this based on your use case
        max: new Date().getFullYear(),  // Ensure the year is not in the future
      },
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    additionalDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500], 
      },
    },
    postGraduationFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    graduationFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    underCertificationFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sscFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'educational_details',
    timestamps: true,  
    underscored: true,  
  }
);

export default EducationalDetails;
