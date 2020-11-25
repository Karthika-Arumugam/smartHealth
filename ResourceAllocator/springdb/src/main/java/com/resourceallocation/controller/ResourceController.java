package com.resourceallocation.controller;


import com.resourceallocation.*;
import com.resourceallocation.bean.Resource;
import com.resourceallocation.repository.ResourceRepository;
import net.minidev.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/resource")
public class ResourceController {

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Resource> getAllResources() {
        LOG.info("Getting all resources.");
        final String uri = "http://localhost:3001/api/v1/resource/all";

        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);

        System.out.println(result);
        return resourceRepository.findAll();
    }

    @RequestMapping(value = "allocateResources", method = RequestMethod.POST)
    public String allocateResources() {

        LOG.info("Allocate resources.");

       String  criticality  =  "medium" ;
       String timestamp = "2018-12-25 15:27:53" ;
       String patientId = "xyz@gmail.com";

       RiskCalculator riskCalculator = new RiskCalculator();
       double riskFactor = riskCalculator.assessRiskAndPriority(criticality,timestamp,patientId);

        Request request = new Request(patientId,"queued");
        request.setReceivedAt(new Date());

        ResourceInventory resourceInventory = new ResourceInventory();
        resourceInventory.addRequestStatistics(request);


       if(riskFactor > 0) {
           ResourceEstimator resourceEstimator = new ResourceEstimator();
           List<String> resourcesNeeded = resourceEstimator.estimateResources(criticality,patientId);

           ResourceAllocator resourceAllocator = new ResourceAllocator();
           resourceAllocator.allocateResources(riskFactor,resourcesNeeded,patientId,request);
       }

        return "Resource allocation in progress";

    }
}
