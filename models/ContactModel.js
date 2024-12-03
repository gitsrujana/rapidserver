import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ContactDetails = sequelize.define(
  'ContactDetails',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{10}$/, 
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, 
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 500], 
      },
    },
  },
  {
    tableName: 'contact_details', 
    timestamps: true, 
    underscored: true, 
  }
);

export default ContactDetails;
