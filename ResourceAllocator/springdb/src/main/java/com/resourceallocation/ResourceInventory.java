package com.resourceallocation;

import net.minidev.json.JSONObject;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class ResourceInventory {

    private String cookie = "null";

    public ResourceInventory() {
        userSignin();
    }


    public boolean isResourceAvailable(String patientId, String resource, Request request) {

        System.out.println("checking resource availability for " + resource);

        final String resourceAvailability = "http://localhost:3001/api/v1/resource/getAvailability";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject statistic = new JSONObject();
        statistic.put("type", resource);
        statistic.put("healthcareProvider", request.getHealthCareProvider() );

        HttpEntity requestEntity = new HttpEntity(statistic, requestHeaders);
        ResponseEntity response = restTemplate.exchange(resourceAvailability, HttpMethod.POST, requestEntity, String.class);
        System.out.println(" resource availability data received" + response.getBody());

        if(Integer.parseInt(response.getBody().toString()) > 0)
            return true;

        return false;
    }


    public String getHealthcare(String patientId) {

        System.out.println(" Fetching healthcare data for patient :  " + patientId);

        final String gethealthcare = "http://localhost:3001/api/v1/patient/getHealthcare?emailId="+patientId;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject healthcare = new JSONObject();

        HttpEntity requestEntity = new HttpEntity(healthcare, requestHeaders);
        ResponseEntity response = restTemplate.exchange(gethealthcare, HttpMethod.GET, requestEntity, String.class);
        System.out.println(" healthcare data received" + response.getBody().toString().replaceAll("\"",""));

        return response.getBody().toString().replaceAll("\"","");
    }

    public void allocateresource(String patientId, String resource, Request request) {

        final String resourceAllocation = "http://localhost:3001/api/v1/resourceAllocation/allocate";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject allocationRequest = new JSONObject();
        allocationRequest.put("requestId", request.getId());
        allocationRequest.put("emailId", request.getPatientId());
        allocationRequest.put("healthRisk", request.getHealthRisk());
        allocationRequest.put("healthcareProvider", request.getHealthCareProvider());
        allocationRequest.put("resourceType",resource);
        allocationRequest.put("lastUpdatedAt", new Date());
        allocationRequest.put("status", "allocated");

        HttpEntity requestEntity = new HttpEntity(allocationRequest, requestHeaders);
        ResponseEntity response = restTemplate.exchange(resourceAllocation, HttpMethod.POST, requestEntity, String.class);

        System.out.println("resource allocated :" + resource);

    }

    public void userSignin() {

        final String signinUrl = "http://localhost:3001/api/v1/users/login";

        JSONObject login = new JSONObject();
        login.put("emailId", "deeps5@gmail.com");
        login.put("password", "deeps");

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<JSONObject> request = new HttpEntity<>(login);
        HttpEntity<String> response = restTemplate.exchange(signinUrl, HttpMethod.POST, request, String.class);
        HttpHeaders headers = response.getHeaders();
        String set_cookie = headers.getFirst(headers.SET_COOKIE);
        System.out.println("login output");
        System.out.println(set_cookie);
        this.setCookie(set_cookie);

    }

    public void addRequestStatistics(Request request) {

        final String statisticsUrl = "http://localhost:3001/api/v1/statistics/add";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject statistic = new JSONObject();
        statistic.put("requestId", request.getId());
        statistic.put("patientId", request.getPatientId());
        statistic.put("receivedAt", request.getReceivedAt());
        statistic.put("status", request.getStatus());

        HttpEntity requestEntity = new HttpEntity(statistic, requestHeaders);
        ResponseEntity response = restTemplate.exchange(statisticsUrl, HttpMethod.POST, requestEntity, String.class);
        System.out.println("statistics added");
    }

    public void updateRequestStatistics(Request request) {

        final String statisticsUrl = "http://localhost:3001/api/v1/statistics/update";

        RestTemplate restTemplate = new RestTemplate();
        JSONObject statistic = new JSONObject();
        statistic.put("requestId", request.getId());
        statistic.put("status", request.getStatus());

        if(request.getServedAt() != null) {
            statistic.put("servedAt", request.getServedAt());
            long responseTime = (request.getServedAt().getTime()-request.getReceivedAt().getTime())/1000;
            request.setResponseTimeInSeconds(responseTime);
            statistic.put("responseTimeInSeconds",responseTime);
        }

        String statisticResultAsJsonStr =
                restTemplate.postForObject(statisticsUrl, statistic, String.class);

        System.out.println(statisticResultAsJsonStr);
        System.out.println("statistics updated");


    }

    public void updateResourceAllocationStatus(Request request, String status, String resource) {

        final String allocationUpdateUrl = "http://localhost:3001/api/v1/resourceAllocation/update";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());
        //TODO update resource allocation status

        JSONObject allocationRequest = new JSONObject();
        allocationRequest.put("requestId", request.getId());
        allocationRequest.put("patient", request.getPatientId());
        allocationRequest.put("healthRisk", request.getHealthRisk());
        allocationRequest.put("healthcareProvider", request.getHealthCareProvider());
        allocationRequest.put("resourceType",resource);
        allocationRequest.put("lastUpdatedAt", new Date());
        allocationRequest.put("status", status);

        HttpEntity requestEntity = new HttpEntity(allocationRequest, requestHeaders);
        ResponseEntity response = restTemplate.exchange(allocationUpdateUrl, HttpMethod.POST, requestEntity, String.class);
        System.out.println("resource allocation updated " + request.getId());

    }

    public void createResourceAllocationStatus(Request request, String status, String resource) {

        final String allocationUpdateUrl = "http://localhost:3001/api/v1/resourceAllocation/add";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());
        //TODO update resource allocation status

        JSONObject allocationRequest = new JSONObject();
        allocationRequest.put("requestId", request.getId());
        allocationRequest.put("patient", request.getPatientId());
        allocationRequest.put("healthRisk", request.getHealthRisk());
        allocationRequest.put("healthcareProvider", request.getHealthCareProvider());
        allocationRequest.put("resourceType",resource);
        allocationRequest.put("lastUpdatedAt", new Date());
        allocationRequest.put("status", status);

        HttpEntity requestEntity = new HttpEntity(allocationRequest, requestHeaders);
        ResponseEntity response = restTemplate.exchange(allocationUpdateUrl, HttpMethod.POST, requestEntity, String.class);
        System.out.println("resource allocation creation added");

    }

    public String getCookie() {
        return cookie;
    }

    public void setCookie(String cookie) {
        this.cookie = cookie;
    }

    public void deallocateAllResources(String patientId, String healthcare) {

        //get all allocated resources
        //deallocate each


        final String resourcedeAllocation = "http://localhost:3001/api/v1/resourceAllocation/deallocateAll";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject deallocationRequest = new JSONObject();
        deallocationRequest.put("patient",patientId );
        deallocationRequest.put("healthcareProvider", healthcare);
        deallocationRequest.put("status", "allocated");

        HttpEntity requestEntity = new HttpEntity(deallocationRequest, requestHeaders);
        ResponseEntity response = restTemplate.exchange(resourcedeAllocation, HttpMethod.POST, requestEntity, String.class);

        System.out.println("resources deallocated  for patient : " + patientId);

    }

    public int getRiskStatus(String patientId) {

        System.out.println(" Fetching previous risk status data for patient :  " + patientId);

        final String getRiskstatus = "http://localhost:3001/api/v1/patient/getRiskStatus?emailId="+patientId;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject riskstatus = new JSONObject();

        HttpEntity requestEntity = new HttpEntity(riskstatus, requestHeaders);
        ResponseEntity response = restTemplate.exchange(getRiskstatus, HttpMethod.GET, requestEntity, String.class);
        System.out.println(" previous risk status data received" + response.getBody().toString().replaceAll("\"",""));

        return Integer.parseInt(response.getBody().toString().replaceAll("\"",""));
    }

    public void removeAllocatedResources(List<String> resourcesNeeded, String patientId, String healthcare) {

        System.out.println(" Checking allocated resources for  patient:  " + patientId);

        final String getAllocations = "http://localhost:3001/api/v1/resourceAllocation/getAllocations";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("Cookie", getCookie());

        JSONObject allocationRequest = new JSONObject();
        allocationRequest.put("patient",patientId );
        allocationRequest.put("healthcareProvider", healthcare);
        allocationRequest.put("status", "allocated");

        HttpEntity requestEntity = new HttpEntity(allocationRequest, requestHeaders);
       // ResponseEntity response = restTemplate.exchange(getAllocations, HttpMethod.POST, requestEntity, ArrayList.class);

        ResponseEntity<String[]> responseEntity = restTemplate.postForEntity(getAllocations,requestEntity, String[].class);
        List<String> resources = Arrays.asList(responseEntity.getBody());

        System.out.println("resources allocations  for patient : " + resources);

      resourcesNeeded.removeAll(resources);
    }
}
