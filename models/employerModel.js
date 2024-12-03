import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  

const Employer = sequelize.define(
  'Employer',
  {
    CompanyName: {
      type: DataTypes.STRING,
      allowNull: false,
    
    },
    ContactNumber: {
        type: DataTypes.STRING,
        allowNull: false,
     
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
     
     
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
     
    },
  
 
    confirmPassword: {
        type: DataTypes.VIRTUAL,
        validate: {
          matchesPassword(value) {
            if (value !== this.password) {
              throw new Error("Passwords do not match.");
            }
          },
        },
      },
      GstNo: {
        type: DataTypes.STRING,
        allowNull: false,
      
      },
      PancardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
       
      },
    UploadGstFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },

   
  },
  {
    tableName: 'employer-registration',
    timestamps: true,  
   
  }
);

export default Employer;
