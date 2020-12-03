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
    required: true 
  },

  healthcareProvider : {
    type: String,
    required: true
  },

  resourceType : {
    type : String,
    required: true
  },

  lastUpdatedAt : {
    type: Date,
    required: true
  },

  status : {
    type : String,
    required: true
  }

});



resourceAllocationSchema.statics.update = async (req) => {


  const result =  await ResourceAllocation.findOne({'requestId' : req.body.requestId , 'resourceType' : req.body.resourceType });

  if(!result)
    return result;

  result.set(req.body);
  const request = await result.save();

  if(!request)
    throw new Error({ message: "unable to update resource allocation request" });
  
    return request;

};

resourceAllocationSchema.statics.deallocate = async (req) => {

    const result =  await ResourceAllocation.findOne(req);
  
    if(!result)
      return result;

      var set = {
        lastUpdatedAt : new Date(),
        status  : "deallocated"
    }
    
    result.set(set);

    const resource = await result.save();
  
    if(!resource)
      throw new Error({ message: "unable to deallocate resource" });
    
      return resource;
  };



resourceAllocationSchema.statics.allocatedResourceInfo = async (req) => {
    // get allocated resources  aggregated count

    let allocationCount =await ResourceAllocation.countDocuments({ status : "allocated" })
    let pendingCount =await ResourceAllocation.countDocuments({ status : "pending" })
    let completedCount =await ResourceAllocation.countDocuments({ status : "deallocated" })

    let map = new Map()
    map['allocationCount'] = allocationCount/(allocationCount+pendingCount+completedCount)
    map['pendingCount'] = pendingCount/(allocationCount+pendingCount+completedCount)
    map['completedCount'] = completedCount/(allocationCount+pendingCount+completedCount)

    let result =  await ResourceAllocation.aggregate([
      {
         "$group": {
            "_id":  "$resourceType" ,
            "allocatedResourcesCount": { $sum: 1 }
     } 
  }   

  ]);

  let result2 = [map,result];

 if (!result2) {
   throw new Error({ error: "Couldn't get resource allocation details" });
 }
return result2;
};

resourceAllocationSchema.statics.getAll = async (req) => {

  let data;

  if(req.query.healthcareProvider) {
     data = await ResourceAllocation.find({'healthcareProvider' : req.query.healthcareProvider}).sort( { lastUpdatedAt : -1 } )
  }
  else {
    data = await ResourceAllocation.find().sort( { lastUpdatedAt : -1 } );
  }

  if (!data) {
    throw new Error({ error: "Couldn't get resource allocation details" });
  }

  let filteredData = []
  let ambulancePatients = []

  data.forEach(element => {
    if(element.resourceType !== 'Ambulance' || !ambulancePatients.includes(element.patient)) {

      if(element.resourceType === 'Ambulance') {
          ambulancePatients.push(element.patient);
      }
      filteredData.push(element)
    }
  });
  return filteredData;
};


resourceAllocationSchema.statics.allocations = async (req) => {


  let data = await ResourceAllocation.find(req);
  if (!data) {
    throw new Error({ error: "Couldn't get resource allocation details" });
  }
  return data;
};

const ResourceAllocation = mongoose.model("ResourceAllocation", resourceAllocationSchema, "ResourceAllocation");

module.exports = ResourceAllocation;
