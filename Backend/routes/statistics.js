const express = require("express");
const Statistics = require("../schema/Statistics");
const Resource = require("../schema/Statistics");
const router = express.Router();

router.post('/add', async (req, res) => {

//   if (!(req.cookies.cookie)) {
//     return res.status(401).json({ message: "You are not logged in,please login to continue" });
//   }
  // Create a new statistic record
  try {
    const data = new Statistics(req.body);
    await data.save();
    res.status(201).send({ message : "Statistic saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unable to add Statistic"});
  }
});

router.post('/update', async (req, res) => {

    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }

      let statistic;
      try {
     
        statistic= await Statistics.update(req.body);
    
        if(!statistic)
          return res.status(400).json({ message: "Invalid data"});

        res.json({ message: "Statistic updated successfully"});
    
    
      } catch (error) {
        return res.status(500).json({ message: "Unable to update Statistics"});
      }
  });

  router.get('/avgResponseTime', async (req, res) => {
    // if (!(req.cookies.cookie)) {
    //     return res.status(401).json({ message: "You are not logged in,please login to continue" });
    //   }
   
      let avgResponseTime,result;
      try {
        avgResponseTime  = await Statistics.getAverageResponseTime(req);
        result = JSON.parse(JSON.stringify(avgResponseTime));
        res.json(result);

      } catch (error) {
        res.status(400).send({ message: "Invalid data"});
      }
  });


  router.get('/efficiency', async (req, res) => {
    // if (!(req.cookies.cookie)) {
    //     return res.status(401).json({ message: "You are not logged in,please login to continue" });
    //   }
   
      let efficiency,result;
      try {
        efficiency  = await Statistics.getAverageAllocations(req.body);
        result = JSON.parse(JSON.stringify(efficiency));
        res.json(result);

      } catch (error) {
        res.status(400).send({ message: "Invalid data"});
      }
  });
  

module.exports = router;
