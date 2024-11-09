import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const JobSeeker = sequelize.define('JobSeeker', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
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
      
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [10, 15], 
        },
    },
    workStatus: {
        type: DataTypes.ENUM('fresher', 'experienced'),
        allowNull: false,
    },
    promotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'jobseekers-registration',
    timestamps: true,
});

export default JobSeeker;
