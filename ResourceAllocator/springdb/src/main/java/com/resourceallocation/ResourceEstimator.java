package com.resourceallocation;

import java.util.ArrayList;
import java.util.List;

public class ResourceEstimator {

    public List<String> estimateResources(String  criticality, String patientId) {

        List<String> resourcesNeeded = new ArrayList<>();

        switch (criticality) {
            case "low":
                resourcesNeeded.add("Medical Prescription");
                resourcesNeeded.add("Monitoring");
                break;
            case "medium":
                resourcesNeeded.add("Cardiologist");
                resourcesNeeded.add("Equipment");
                break;
            case "high":
                resourcesNeeded.add("Ambulance");
                break;
        }
        return resourcesNeeded;
    }
}
