import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProfessionalSkills = sequelize.define('ProfessionalSkills', {
  profession: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  experienceMonths: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  certifications: {
    type: DataTypes.STRING,
  },
  objective: {
    type: DataTypes.TEXT,
  },
},{
    tableName:"professional-skills",
    timestamps: true,
});

export default ProfessionalSkills;