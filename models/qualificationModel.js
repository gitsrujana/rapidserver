import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Qualification = sequelize.define('Qualification', {
    education: {
        type: DataTypes.ENUM('Bachelor\'s', 'Master\'s', 'PhD'),
        allowNull: false,
    },
    university: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fieldOfStudy: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    additional: {
        type: DataTypes.TEXT,
        allowNull: true, 
    },
}, {
    tableName: 'qualifications', 
    timestamps: true, 
});

export default Qualification;