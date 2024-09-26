const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password:{
      type: String,
      required: true,
      minlength: 4,
    },
    Association: [
      {
        associationName: {
          type: String,
          required: false,
        },
        associationNumber: {
          type: Number,
          required: false,
        },
      }
    ],
    // Association: [{
    //   type: String,
    //   required: false,
    // }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);