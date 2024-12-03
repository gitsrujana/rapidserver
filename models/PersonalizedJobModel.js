import { DataTypes } from "sequelize";
import sequelize  from "../config/db.js"

const Job = sequelize.define("Job", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  postedDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},

{
    tableName: 'personalizedjobs', 
    timestamps: true, 
});

export default Job;
