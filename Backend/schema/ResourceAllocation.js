const mongoose = require("mongoose");


const resourceAllocationSchema = mongoose.Schema({

  patient: {
    type: String,
    required: true
  },

  requestId : {
    type: Number,
    required: true
  },

  healthRisk : {
    type: String,
    required: false 
  },

  healthcareProvider : {
    type: String,
    required: true
  },

  resourceType : {
    type : String,
    required: true
  },

  allocatedTime : {
    type: Date,
    required: true
  },

  allocationStatus : {
    type : String,
    required: true
  }

});

resourceAllocationSchema.statics.deallocate = async (req) => {

    const result =  await ResourceAllocation.findOne(req);
  
    if(!result)
      return result;

      var set = {
        allocationStatus  : "deallocated"
    }
    
    result.set(set);

    const resource = await result.save();
  
    if(!resource)
      throw new Error({ message: "unable to deallocate resource" });
    
      return resource;
  };



resourceAllocationSchema.statics.allocatedResourceInfo = async (req) => {
    // get allocated resources  aggregated count

    console.log("inside")

    const result =  await ResourceAllocation.aggregate([
      {
         "$group": {
            "_id":  "$resourceType" ,
            "allocatedResourcesCount": { $sum: 1 }
     } 
  }   

  ]);
 
 if (!result) {
   throw new Error({ error: "Invalid resource details" });
 }
return result;
};

const ResourceAllocation = mongoose.model("ResourceAllocation", resourceAllocationSchema, "ResourceAllocation");

module.exports = ResourceAllocation;
