const mongoose = require("mongoose");
const { all } = require("../app");


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

    let result =  await ResourceAllocation.aggregate([
      {
         "$group": {
            "_id":  "$resourceType" ,
            "allocatedResourcesCount": { $sum: 1 }
     } 
  }   

  ]);

  console.log(result)

  // const result2 =  await ResourceAllocation.aggregate([
  //   {
  //     "$group": {
  //       "_id": {  "allocationStatus" : "$allocated" },
  //       "allocationCount": { $sum: 1 }
  //     }
  //   }

  // ]);

  var allocationStatus = {
    allocationCount : await ResourceAllocation.countDocuments({ allocationStatus : "allocated" })
  }

  var pendingStatus = {
    pendingCount : await ResourceAllocation.countDocuments({ allocationStatus : "pending" })
  }


  var completedStatus = {
    completedCount : await ResourceAllocation.countDocuments({ allocationStatus : "deallocated" })
  }
 
  let result2 = [allocationStatus,pendingStatus,completedStatus];

  let result3 = result.concat(...result2)

 if (!result3) {
   throw new Error({ error: "Invalid resource details" });
 }
return result3;
};

const ResourceAllocation = mongoose.model("ResourceAllocation", resourceAllocationSchema, "ResourceAllocation");

module.exports = ResourceAllocation;
