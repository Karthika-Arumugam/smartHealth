const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_KEY} = require('../config.js');

const userSchema = mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  userGroup: {
    type: String,
    required: true,
  },

  address : {
    type : String,
    required: true

  },

  state : {
    type : String,
    required: true
  },

  city : {
    type : String,
    required: true
  },

  zip : {
    type : String,
    required: true
  },

  phone : {
    type : String,
    required: true

  },

  firstName : {
    type : String,
    required: true
  },
  lastName : {
    type : String,
    required: true
  },

  healthCareProvider : {
    type : String,
    required: function() {
      return this.userGroup === "Healthcare" ? true : false
    } 
  },

  emergencyContact : {
    type : String,
    required: function() {
      return this.userGroup === "Patient" ? true : false
    } 
  },

  age : {
    type : Number,
    required: function() {
      return this.userGroup === "Patient" ? true : false
    } 

  },

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
    required : false
  },

  gender : {
    type : String,
    required : false
  },

  smokingyears : {
    type : Number,
    required : false
  },

  cigperday : {
    type : Number,
    required : false
  }


});

userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (emailId, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ emailId});
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

userSchema.statics.getProfile = async (emailId) => {
  // Search for a user by email and password.
  const user = await User.findOne({ emailId });
  if (!user) {
    throw new Error({ error: "Invalid Details" });
  }

  return user;
};


userSchema.statics.getDeviceName = async (emailId) => {
  // Search for a user by email and password.
  const device = await User.findOne({ emailId }, {deviceName : 1});
  if (!device) {
    throw new Error({ error: "Invalid Details" });
  }

  return device.deviceName;
};

userSchema.statics.updateProfile = async (req) => {

  let email = req.emailId;

  const result =  await User.findOne({'emailId' : email });

  if(!result)
    return result;

  result.set(req);
  const user = await result.save();

  if(!user)
    throw new Error({ message: "unable to update profile" });
  
    return user;

};

userSchema.statics.activateDevice = async (emailId) => {
  

    const result =  await User.findOne({'emailId' : emailId });

    if(!result)
      return result;

    var set = {
        deviceStatus : true
    }
    
    result.set(set);
    const user = await result.save();

    if(!user)
      throw new Error({ error: "unable to activate device" });
    
      return user;
 
};

userSchema.statics.deactivateDevice = async (emailId) => {

  const result =  await User.findOne({'emailId' : emailId });

  if(!result)
    return result;

  var set = {
      deviceStatus : false
  }
  
  result.set(set);
  const user = await result.save();

  if(!user)
    throw new Error({ error: "unable to deactivate device" });
  
    return user;

};


const User = mongoose.model("User", userSchema, "User");

module.exports = User;
