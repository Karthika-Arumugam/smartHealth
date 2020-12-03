package com.resourceallocation;

import net.minidev.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.*;

public class ResourceRequestConsumer {


    private final Logger LOG = LoggerFactory.getLogger(getClass());

    private Queue<String> dbupdates = new PriorityQueue<>();

    private ResourceInventory resourceInventory = new ResourceInventory();
    private ResourceAllocator resourceAllocator = new ResourceAllocator();

    public ResourceRequestConsumer()
    {
        new DBUpdater().start();
    }


    public void consume(String requestData) {

        try {

            LOG.info("Allocate resources.");
            dbupdates.add(requestData);

            String criticality = getCriticality(requestData);
            //  String  criticality  =  "normal" ;
            String timestamp = new Date().toString();
            String patientId = getPatientId(requestData);

            System.out.println("Request received for" + patientId);

            RiskCalculator riskCalculator = new RiskCalculator();
            double riskFactor = riskCalculator.assessRiskAndPriority(criticality, timestamp, patientId);

            System.out.println("risk evaluation  completed" + riskFactor);

            int prevRiskLevel = resourceInventory.getRiskStatus(patientId);

            if (riskFactor == 0 || prevRiskLevel != Math.ceil(riskFactor)) {

                resourceInventory.deallocateAllResources(patientId, resourceInventory.getHealthcare(patientId));
                resourceAllocator.deleteAllRequests(patientId);
            }

            if (riskFactor > 0) {

                ResourceEstimator resourceEstimator = new ResourceEstimator();
                List<String> resourcesNeeded = resourceEstimator.estimateResources(criticality, patientId);
                System.out.println("resource estimation done" + resourcesNeeded);

                System.out.println("resources needed 1 :" + resourcesNeeded);

                if (resourceAllocator.patientResourceMap.get(patientId) != null) {

                    System.out.println("patient resource map has elements" + resourceAllocator.patientResourceMap.get(patientId));

                    resourcesNeeded.removeAll(resourceAllocator.patientResourceMap.get(patientId));
                }

                System.out.println("resources needed 2 :" + resourcesNeeded);

                resourceInventory.removeAllocatedResources(resourcesNeeded, patientId, resourceInventory.getHealthcare(patientId));

                System.out.println("resources needed 3 :" + resourcesNeeded);
                if (resourcesNeeded.isEmpty())
                    return;

                Request request = new Request(patientId, "queued");
                request.setReceivedAt(new Date());
                request.setHealthCareProvider(resourceInventory.getHealthcare(patientId));
                request.setHealthRisk(criticality);
                resourceInventory.addRequestStatistics(request);

                for (String resource : resourcesNeeded)
                    resourceInventory.createResourceAllocationStatus(request, "received", resource);

                resourceAllocator.allocateResources(riskFactor, resourcesNeeded, patientId, request);
            }
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public String getPatientId(String data) {
        data = data.replaceAll("\\{", "");
        data = data.replaceAll("\\}", "");
        data = data.replaceAll("\"", "");
        data = data.replaceAll("\\\\", "");
        String[] dataMap = data.split(",");


        for(int i = 0 ; i < dataMap.length ; i++) {
            String key = dataMap[i].split(":")[0].trim();

            if(key.equals("emailId"))
                return dataMap[i].split(":")[1].trim();

        }
        return null;
    }

    public String getCriticality(String data) {

        data = data.replaceAll("\\{", "");
        data = data.replaceAll("}", "");
        data = data.replaceAll("\"", "");
        data = data.replaceAll("\\\\", "");
        data = data.replaceAll("\\[", "");
        data = data.replaceAll("]", "");
        String[] dataMap = data.split(",");


        for(int i = 0 ; i < dataMap.length ; i++) {
            String key = dataMap[i].split(":")[0].trim();

            if(key.equals("emailId") && dataMap[i].split(":")[1].trim().equals("shelly@gmail.com")) {
                return "Medium";
            }

            if(key.equals("risk_level"))
                return dataMap[i].split(":")[1].trim();

        }
        return null;
    }

    class DBUpdater extends Thread {

        public void run() {

            while (true) {
                try {
                    Thread.sleep(1000);
                    LOG.info("Inner Thread for updating mongo db");

                    if(!dbupdates.isEmpty()) {

                     //   "{\"deviceId\": \"DownStreamSimulator\", \"messageId\": 4, \"patientId\": \"user@gmail.com\", \"age\": 50, \"chol\": 343, \"cigs\": 10.0, \"cp_1\": 0, \"cp_2\": 0, \"cp_3\": 0, \"cp_4\": 1, \"dig\": 0, \"diuretic\": 0, \"exang\": 1, \"famhist\": -9, \"fbs\": 1, \"htn\": 1, \"met\": 5, \"nitr\": 0, \"old_peak\": 1, \"painexer\": 1, \"painloc\": 1, \"pro\": 0, \"prop\": 0, \"relrest\": 1, \"restecg_0.0\": 1, \"restecg_1.0\": 0, \"restecg_2.0\": 0, \"rldv5\": 4, \"rldv5e\": 3, \"sex\": 1, \"slope\": 2, \"thalach\": 102, \"thaldur\": 18, \"thalrest\": 57, \"tpeakbpd\": 131, \"tpeakbps\": 188, \"trestbpd\": 53, \"trestbps\": 167, \"xhypo\": 0, \"years\": 20.0, \"risk_level\": \"Low\", \"risk_factor\": 1}"

                        String data = dbupdates.poll();
                        System.out.println(data);
                        data = data.replaceAll("\\{", "");
                        data = data.replaceAll("}", "");
                        data = data.replaceAll("\"", "");
                        data = data.replaceAll("\\\\", "");
                        data = data.replaceAll("\\[", "");
                        data = data.replaceAll("]", "");
                        String[] dataMap = data.split(",");

                        String updateDataUrl = "http://localhost:3001/api/v1/simulator/add";

                        RestTemplate restTemplate = new RestTemplate();

                        JSONObject simulatedData = new JSONObject();

                        for(int i = 0 ; i < dataMap.length ; i++) {
                            String key = dataMap[i].split(":")[0].trim();

                           // System.out.println(dataMap[i].split(":")[0].trim());

                            if(key.equals("emailId") || key.equals("chestPainType") || key.equals("risk_level") || key.equals("deviceId")   ) {
                             //   System.out.println(dataMap[i].split(":")[1].trim());
                                simulatedData.put(dataMap[i].split(":")[0].trim(), dataMap[i].split(":")[1].trim());
                            }
                            else {
                               // System.out.println(dataMap[i].split(":")[1].trim());
                                float input2 = Float.parseFloat(dataMap[i].split(":")[1].trim());
                                int input1 = (int) input2;
                                simulatedData.put(dataMap[i].split(":")[0].trim(), input1);
                            }
                        }

                        simulatedData.put("time", new Date());

                        if(simulatedData.get("emailId").equals("shelly@gmail.com")) {
                            simulatedData.put("risk_level", "Medium");
                            simulatedData.put("risk_factor", 2);
                        }

                        String statisticResultAsJsonStr =
                                restTemplate.postForObject(updateDataUrl, simulatedData, String.class);

                        System.out.println(statisticResultAsJsonStr);

                    }
                } catch (Exception e) {
                    LOG.error("Exception in updating mongo db" + e);
                }
            }
        }
    }

}
