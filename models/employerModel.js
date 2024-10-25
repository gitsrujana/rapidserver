import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Employer = sequelize.define('Employer', {
  companyName: {
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
  contactNumber: {
    type: DataTypes.STRING,
  },
},{
    tableName:'employer-registration',
   timestamps: true,
});

export default Employer;