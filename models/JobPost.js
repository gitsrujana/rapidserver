import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobPost = sequelize.define(
  "JobPost",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "job_title", 
    },
    jobLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "job_location", 
    },
    openings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    experienceLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "experience_level", 
    },
    minSalary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "min_salary", 
    },
    maxSalary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "max_salary", 
    },
    bonus: {
      type: DataTypes.ENUM("Yes", "No"),
      allowNull: false,
      defaultValue: "No",
    },
    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "job_description", 
    },
  },
  {
    tableName: "jobposts", 
    timestamps: true, 
  }
);

export default JobPost;
