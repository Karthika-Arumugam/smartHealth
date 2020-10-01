const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_KEY} = require('../config.js');

const patientSchema = mongoose.Schema({
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

  time: [{
    type: Date,
    required: true,
  }],

  riskStatus : [{
    type : Number,
    required: true

  }],

  healthcareProvider : {
    type : String,
    required: false
  },



  alerts: [
    {
      alertMessage: {
        type: String,
        required: false,
      },

      sender : {
        type: String,
        required: false
      },

      alertTime : {
         type : Date,
        required: false
      }
    },
  ],

  medications : [
    {
      name :  {
      type : String,
      required: false
      },

      instructions : {
        type : String,
        required: false
      }
    }
  ],

  allocatedResources : [
    {
      type : {
        type : String,
        required: false
      },

      allocatedTime : {
        type : Date,
        required: false
      },

      allocatedTill : {
        type : Date,
        required: false
      },

      count : {
        type : Number,
        required: false
      },

      currentStatus : {
        type : String,
        required: false
      }
    }
  ],

  allocatedSpecialists : [
    {
      name : {
        type : String,
        required: false
      },

      emergencyContact : {
        type : String,
        required: false
      }
    }
  ],

  deviceName : {
    type : String,
    required : false
  },

  deviceType : {
    type : String,
    required : false
  },

  deviceStatus : {
    type : Boolean,
    required : true,
    default : false
  } 
});

patientSchema.pre("save", async function (next) {

  // add pre conditions before saving patient's info (security purpose)

  next();
});

patientSchema.statics.getDashboard = async (emailId) => {
  // get patient dashboard details  by email 
  const patient = await Patient.findOne({ emailId });

  patient.riskStatus = patient.riskStatus.reverse().splice(0,20);
  patient.time = patient.time.reverse().splice(0,20);

  
  if (!patient) {
    throw new Error({ error: "Invalid Details" });
  }
 return patient;
};

patientSchema.statics.updateRiskStatus = async (emailId,riskStatus) => {
  // get patient dashboard details  by email 
  const patient = await Patient.findOne({ emailId });

  var set = {
    emailId : emailId,
    riskStatus : [...patient.riskStatus,riskStatus],
    time : [...patient.time,new Date()]
}

  if (!patient) {
    const newPatient = new Patient(set);
    await newPatient.save();
    return newPatient;
  }

patient.set(set);
const doc = await patient.save();
  
  if (!doc) {
    throw new Error({ error: "Cannot update risk status" });
  }

 return doc;
};



patientSchema.statics.activateDevice = async (emailId) => {
  

  const result =  await Patient.findOne({'emailId' : emailId });

  if(!result)
    throw new Error({ error: "Invalid input details" });

  var set = {
      deviceStatus : true
  }
  
  result.set(set);
  const patient = await result.save();

  if(!patient)
    throw new Error({ error: "unable to activate device" });
  
    return patient;

};

patientSchema.statics.deactivateDevice = async (emailId) => {

const result =  await Patient.findOne({'emailId' : emailId });

if(!result)
  throw new Error({ error: "Invalid input details" });

var set = {
    deviceStatus : false
}

result.set(set);
const patient = await result.save();

if(!patient)
  throw new Error({ error: "unable to deactivate device" });

  return patient;

};

patientSchema.statics.activeDevicesCount = async (req) => {

  console.log("start")

  const result =  await Patient.countDocuments({ deviceStatus : true});
  
  if(!result)
    throw new Error({ error: "Invalid input details" });

  return result;
  
  };

const Patient = mongoose.model("Patient", patientSchema, "Patient");

module.exports = Patient;
