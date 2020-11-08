const express = require("express");
const Resource = require("../schema/Resource");
const router = express.Router();

router.post('/add', async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // Create a new resource
  try {
    const data = new Resource(req.body);
    await data.save();
    res.status(201).send({ message : "Resource saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unable to add resource, resource type already exists"});
  }
});

router.post('/update', async (req, res) => {

    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
      // update resource
      let resource;
      try {
     
        resource= await Resource.update(req.body);
    
        if(!resource)
          return res.status(400).json({ message: "Invalid details"});

        res.json({ message: "Resource updated successfully"});
    
    
      } catch (error) {
        return res.status(500).json({ message: "Unable to update resource"});
      }
  });

router.delete('/delete', async (req, res) => {

    if (!(req.cookies.cookie)) {
      return res.status(401).json({ message: "You are not logged in,please login to continue" });
    }
    // Create a new resource
    try {
     
        resource= await Resource.delete(req.body);
    
        if(!resource)
             return res.status(400).json({ message: "Invalid details"});

        res.json({ message: "Resource deleted successfully"});
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Unable to delete resource"});
    }
  });

  router.get('/getAvailability', async (req, res) => {
    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
      // get available resources count
      let resource,result;
      try {
        resource  = await Resource.getAvailability(req.body);
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
      // get all resources
      let resource,result;
      try {
        resource  = await Resource.getAll(req);
        result = JSON.parse(JSON.stringify(resource));
        res.json(result);

      } catch (error) {
        res.status(400).send({ message: "Invalid resource details"});
      }
  });

  router.get('/availabilityInfo', async (req, res) => {
    if (!(req.cookies.cookie)) {
        return res.status(401).json({ message: "You are not logged in,please login to continue" });
      }
      // get all resources
      let resource,result;
      try {
        resource  = await Resource.availableResourceInfo(req);
        result = JSON.parse(JSON.stringify(resource));
        res.json(result);

      } catch (error) {
        res.status(400).send({ message: "Invalid resource details"});
      }
  });
  

module.exports = router;
