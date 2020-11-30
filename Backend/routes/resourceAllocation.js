const express = require("express");
const ResourceAllocation = require("../schema/ResourceAllocation");
const Resource = require("../schema/Resource");
const Patient = require("../schema/Patient");
const router = express.Router();

router.post('/add', async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // Create a new  Resource Allocation
  try {
    const data = new ResourceAllocation(req.body);
    await data.save();

    res.status(201).send({ message : "Resource Allocation saved successfully" });
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error.message});
  }
});

router.post('/allocate', async (req, res) => {
      // update resource
      let resource;
      if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }

      try {
       resource= await Resource.decrement(req.body);

       let patient;

       console.log(req.body.emailId)
       console.log(req.body.resourceType)

      //  if(req.body.resourceType === "Medical Prescription") {

      //  patient = await Patient.getDashboard(req.body.emailId);
      //  var set = {
      //   emailId : req.body.emailId,
      //   medications : [...medications,req.body.resourceType]
      //   }
       
      //  patient.set(set);
      //  await patient.save();

      //  console.log("medications updated")

      //  }

      //  if(req.body.resourceType === "Cardiologist") {

      //   patient = await Patient.getDashboard(req.body.emailId);
      //   var set = {
      //    emailId : req.body.emailId,
      //    allocatedSpecialists : [...allocatedSpecialists,req.body.resourceType]
      //    }
        
      //   patient.set(set);
      //   await patient.save();
 
      //   console.log("Allocated Specialists updated")
         
      // }

      //  resource= await ResourceAllocation.update(req);
      res.json({ message: " resource request updated successfully"});
    
      } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Invalid resource details"});
      }
});

router.post('/deallocate', async (req, res) => {
    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
      // update resource
      let resource;
      try {
        resource= await ResourceAllocation.deallocate(req.body);

        resource= await Resource.increment(req.body);
    


        res.json({ message: "Resource updated successfully"});
      } catch (error) {
        return res.status(400).json({ message: "Unable to update resource"});
      }
  });


  router.get('/allocationInfo', async (req, res) => {
    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
      // get all resources
      let resource,result;
      try {
        resource  = await ResourceAllocation.allocatedResourceInfo(req.body);
        result = JSON.parse(JSON.stringify(resource));
        res.json(result);

      } catch (error) {
        res.status(400).send({ message: "Invalid resource details"});
      }
  });

  router.get('/all', async (req, res) => {
    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
    
      let resource,result;
      try {
        resource  = await ResourceAllocation.getAll(req);
        result = JSON.parse(JSON.stringify(resource));
        res.json(result);

      } catch (error) {
        res.status(400).send({ message: "Couldn't get resource allocation details"});
      }
  });

  router.post("/update", async (req, res) => {

    if (!(req.cookies.cookie)) {
      return res.status(401).json({ message: "You are not logged in,please login to continue" });
    }
    // update user profile
    let resource ;
    try {
   
      resource= await ResourceAllocation.update(req);
      res.json({ message: " resource request updated successfully"});
  
  
    } catch (error) {
      return res.status(500).json({ message: "Unable to update resource allocation"});
    }
  });




module.exports = router;
