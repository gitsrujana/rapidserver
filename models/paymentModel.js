import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PaymentDetails = sequelize.define(
  'PaymentDetails',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, 
      },
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{16}$/, 
      },
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 
      },
    },
    cvc: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{3,4}$/,
      },
    },
    cardholderName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50], 
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [5, 255], 
      },
    },
    isBusiness: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    saveInfo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'payment_details', 
    timestamps: true,
    underscored: true,
  }
);

export default PaymentDetails;
