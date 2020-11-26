const mongoose = require("mongoose");
const SLAResponseTime = 900;


const statisticsSchema = mongoose.Schema({

  requestId: {
    type: Number,
    required: true
  },

  patientId : {
    type: String,
    required: true
  },

  healthcareProvider : {
    type: String,
    required: false
  },

  receivedAt : {
    type : Date,
    required: true
  },

  status : {
    type : String,
    required: false
  },

  servedAt : {
    type : Date,
    required: false
  },

  responseTimeInSeconds : {
    type : Number,
    required: false
  }

});

statisticsSchema.statics.update = async (req) => {

    const result =  await Statistics.findOne({'requestId' : req.requestId});
  
    if(!result)
        throw new Error({ message: "unable to get data" });
  
    result.set(req);

    const statistic = await result.save();
  
    if(!statistic)
      throw new Error({ message: "unable to update statistic" });
    
    return statistic;
  };

  

  statisticsSchema.statics.getAverageResponseTime = async (req) => {

     const result =  await  Statistics.aggregate([
        {
           "$group": {
              "_id": null,
              "avgResponseTime": {
                 "$avg": "$responseTimeInSeconds"
              }
           }
        }
     ]);
  
    if(!result)
        throw new Error({ message: "unable to get data" });

    return result[0].avgResponseTime/SLAResponseTime;
  };

  statisticsSchema.statics.getAverageAllocations = async (req) => {

    const allocated =  await Statistics.countDocuments({'status' : 'completed'});
    console.log(allocated)
    const waiting =  await Statistics.countDocuments({'status' : 'pending'});
    const queued =  await Statistics.countDocuments({'status' : 'queued'});

   const efficiency = allocated/(allocated+waiting+queued) ;

   if(!efficiency)
       throw new Error({ message: "unable to get data" });

   return efficiency;
 };

const Statistics = mongoose.model("Statistics", statisticsSchema, "Statistics");

module.exports = Statistics;
