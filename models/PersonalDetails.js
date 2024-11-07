import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PersonalDetails = sequelize.define('PersonalDetails', {
    dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    languagePreference: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    healthCondition: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
}, {
    tableName:"personal-Details",
    timestamps: true, 
});

export default PersonalDetails;