const mongoose = require("mongoose");


const resourceSchema = mongoose.Schema({

  type: {
    type: String,
    required: true
  },

  healthcareProvider : {
    type: String,
    required: true
  },

  totalCount : {
    type : Number,
    required: true
  },

  available : {
    type : Number,
    required: false
  },

  owner : {
    type: String,
    required: true
  },

  createdDate : {
    type: Date,
    required: true
  }


});


resourceSchema.statics.getAvailability = async (req) => {
    // get available resources count
    const data = await  Resource.findOne({ 'type' : req.type , 'healthcareProvider' : req.healthcareProvider  });
    
    if (!data) {
      throw new Error({ error: "Invalid resource details" });
    }
   return data;
  };

resourceSchema.statics.getAll = async (req) => {
    // get available resources count
    const data = await  Resource.find(req);
    
    if (!data) {
      throw new Error({ error: "Invalid resource details" });
    }
   return data;
  };

resourceSchema.statics.update = async (req) => {

    const result =  await Resource.findOne({'type' : req.type , 'healthcareProvider' : req.healthcareProvider });
  
    if(!result)
      return result;
  
    result.set(req);
    const resource = await result.save();
  
    if(!resource)
      throw new Error({ message: "unable to update resource" });
    
      return resource;
  };

  resourceSchema.statics.delete = async (req) => {

    const result =  await Resource.remove({'type' : req.type , 'healthcareProvider' : req.healthcareProvider });

    if(!result)
      throw new Error({ message: "unable to update resource" });

    return result;

  };


  resourceSchema.statics.increment = async (req) => {

    const resource =  await Resource.findOne({'type' : req.resourceType , 'healthcareProvider' : req.healthcareProvider });

    if(!resource)
        throw new Error({ message: "Invalid resource details" });

    var set = {
        available  : resource.available+1
    }

    resource.set(set);
    const result = await resource.save();
    return result;
  };


  resourceSchema.statics.decrement = async (req) => {

   console.log(req.type)
   console.log( req.healthcareProvider )

    const resource =  await Resource.findOne({'type' : req.resourceType , 'healthcareProvider' : req.healthcareProvider });

    if(!resource) {
        console.log("decrement details")
        throw new Error({ message: "Invalid resource details" });
    }

    var set = {
        available  : resource.available-1
    }

    resource.set(set);
    const result = await resource.save();
    return result;

  };

const Resource = mongoose.model("Resource", resourceSchema, "Resource");

module.exports = Resource;
