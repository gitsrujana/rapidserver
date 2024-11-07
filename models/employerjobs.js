import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const employerjobs = sequelize.define('Job', {
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  openings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  experienceLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minSalary: {
    type: DataTypes.INTEGER,
  },
  maxSalary: {
    type: DataTypes.INTEGER,
  },
  bonus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'No',
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},{
    tableName: 'employer-job-post', 
    timestamps: true, 
});

export default employerjobs;
