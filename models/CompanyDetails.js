
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CompanyDetails = sequelize.define(
  "CompanyDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobTimings: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "job_timings",
    },
    interviewDetails: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "interview_details",
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "company_name",
    },
    contactPersonName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "contact_person_name",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone_number",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email",
    },
    contactPersonProfile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "contact_person_profile",
    },
    sizeOfOrganization: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "size_of_organization",
    },
    jobAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "job_address",
    },
    hiringFrequency: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "hiring_frequency",
    },
    termsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "terms_accepted",
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "logo",
    },
  },
  {
    tableName: "aboutcompany",
    timestamps: true, 
  }
);

export default CompanyDetails;
