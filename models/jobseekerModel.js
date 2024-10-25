

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const JobSeeker = sequelize.define('JobSeeker', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
   
  },
  middleName: {
    type: DataTypes.STRING,
  },
  surName:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
  },
},{
  tableName:'jobseeker-register',
  timestamps: true,
});

export default JobSeeker;
