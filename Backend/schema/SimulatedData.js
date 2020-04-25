const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_KEY} = require('../config.js');

const simulatedDataSchema = mongoose.Schema({

  emailId: {
    type: String,
    required: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },

  time: {
    type: Date,
    required: true
  },

  chestPainType : {
    type: String,
    required: false
  },

  cholesterol : {
    type: Number,
    required: false
  },
  bloodPressure : {
    type: Number,
    required: false
  },

  fbs : {
    type: Boolean,
    required: false 
  },
  exang : {
    type: Boolean,
    required: false 
  },

  heartRate : {
    type: Number,
    required: false
  }

});

simulatedDataSchema.pre("save", async function (next) {

  // add pre conditions before saving patient's info (securiy purpose)

  next();
});

simulatedDataSchema.statics.getHeartrate = async (emailId) => {
  // get heartbeat data details  by email 
  const data = await  SimulatedData.find({ emailId },{   heartRate : 1}).sort({ time : -1}).limit(20);
  
  if (!data) {
    throw new Error({ error: "Invalid Details" });
  }
 return data;
};

const SimulatedData = mongoose.model("SimulatedData", simulatedDataSchema, "SimulatedData");

module.exports = SimulatedData;
