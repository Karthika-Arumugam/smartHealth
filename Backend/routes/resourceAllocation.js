const express = require("express");
const ResourceAllocation = require("../schema/ResourceAllocation");
const Resource = require("../schema/Resource");
const router = express.Router();

router.post('/allocate', async (req, res) => {
    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
      // update resource
      let resource;
      try {
       resource= await Resource.decrement(req.body);
        resource = new ResourceAllocation(req.body);
        await resource.save();
        res.status(201).send({ message : "Resource saved successfully" });
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





module.exports = router;
