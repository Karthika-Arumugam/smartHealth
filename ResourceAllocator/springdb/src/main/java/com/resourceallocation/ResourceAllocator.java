package com.resourceallocation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ResourceAllocator {

    private Map<String,Request> patientRequestMap = new ConcurrentHashMap<>();

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    private Map<String,List<String>> patientResourceMap = new ConcurrentHashMap<>();

    private PriorityQueue<Map.Entry<String,Double>> priorityQueue = new PriorityQueue<>(new Comparator<Map.Entry<String, Double>>() {
        @Override
        public int compare(Map.Entry<String, Double> a, Map.Entry<String, Double> b) {
            return a.getValue().equals(b.getValue()) ? b.getKey().compareTo(a.getKey()) : (int) (a.getValue()-b.getValue());
        }
    });

    private List<Map.Entry<String,List<String>>> waitQueue = new ArrayList<>();

    public ResourceAllocator() {
        new PriorityBasedAllocator().start();
        new WaitingResourceAllocator().start();
    }

    public void allocateResources(double riskFactor, List<String> resources, String patientId, Request request) {

        patientResourceMap.put(patientId,resources);
        patientRequestMap.put(patientId,request);
        priorityQueue.add( new AbstractMap.SimpleEntry<>(patientId, riskFactor));

    }

    class PriorityBasedAllocator extends Thread {

        public void run() {

            ResourceInventory resourceInventory = new ResourceInventory();

            while (true) {
                try {
                    Thread.sleep(30000);
                    LOG.info("Inner Thread for resource allocation");

                    if (!priorityQueue.isEmpty()) {
                        Map.Entry<String, Double> request = priorityQueue.poll();

                        System.out.println("polling new request" + request.getKey());

                        List<String> resourcesNeeded = patientResourceMap.get(request.getKey());

                        List<String> waitList = new ArrayList<>();

                        for (String resource : resourcesNeeded) {

                            if (resourceInventory.isResourceAvailable(request.getKey(), resource,patientRequestMap.get(request.getKey()))) {
                                resourceInventory.allocateresource(request.getKey(), resource, patientRequestMap.get(request.getKey()));
                                resourceInventory.updateResourceAllocationStatus(patientRequestMap.get(request.getKey()),"allocated",resource);
                            }
                            else {
                                waitList.add(resource);
                                resourceInventory.updateResourceAllocationStatus(patientRequestMap.get(request.getKey()),"pending",resource);
                            }
                        }

                        if (!waitList.isEmpty()) {
                            patientRequestMap.get(request.getKey()).setStatus("waiting");
                            waitQueue.add(new AbstractMap.SimpleEntry<>(request.getKey(), waitList));
                            resourceInventory.updateRequestStatistics(patientRequestMap.get(request.getKey()));
                        }
                        else {
                            patientRequestMap.get(request.getKey()).setServedAt(new Date());
                            patientRequestMap.get(request.getKey()).setStatus("completed");
                            resourceInventory.updateRequestStatistics(patientRequestMap.get(request.getKey()));
                        }

                    }

                } catch (Exception e) {
                    LOG.error("Exception in allocating resources." + e);
                }
            }
        }
    }

    class WaitingResourceAllocator extends Thread {

        public void run() {
            ResourceInventory resourceInventory = new ResourceInventory();

            while (true) {
                try {
                    Thread.sleep(60000);
                    LOG.info("Inner Thread for wait queue resource allocation");

                    for(Map.Entry<String,List<String>> waitRequest : waitQueue) {

                        List<String> waitList = new ArrayList<>();

                        for (String resource : waitRequest.getValue()) {

                            LOG.info("waiting for" + resource);
                            if (resourceInventory.isResourceAvailable(waitRequest.getKey(), resource,patientRequestMap.get(waitRequest.getKey()))) {
                                resourceInventory.allocateresource(waitRequest.getKey(), resource, patientRequestMap.get(waitRequest.getKey()));
                                resourceInventory.updateResourceAllocationStatus(patientRequestMap.get(waitRequest.getKey()),"allocated",resource);
                            }
                            else {
                                waitList.add(resource);
                                resourceInventory.updateResourceAllocationStatus(patientRequestMap.get(waitRequest.getKey()),"pending",resource);
                            }
                        }

                        waitQueue.remove(waitRequest);
                        if(!waitList.isEmpty())
                            waitQueue.add(new AbstractMap.SimpleEntry<>(waitRequest.getKey(),waitList));
                        else {
                            patientRequestMap.get(waitRequest.getKey()).setServedAt(new Date());
                            patientRequestMap.get(waitRequest.getKey()).setStatus("completed");
                            resourceInventory.updateRequestStatistics(patientRequestMap.get(waitRequest.getKey()));
                        }

                    }

                } catch (Exception e) {
                    LOG.error("Exception in allocating resources in wait queue" + e);
                }
            }
        }
    }


}
