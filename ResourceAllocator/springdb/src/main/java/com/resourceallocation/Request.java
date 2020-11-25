package com.resourceallocation;

import java.util.Date;

public class Request {

    private int id;
    private String healthCareProvider;
    private String patientId;
    private Date receivedAt;
    private Date servedAt;
    private String status;
    private long responseTimeInSeconds;
    private String healthRisk;
    private String resourceType;
    private Date lastUpdatedAt;

    public Request(String patientId,String status) {
        id=(int) ((Math.random()*(10000-89)+89));
        this.patientId = patientId;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(Date receivedAt) {
        this.receivedAt = receivedAt;
    }

    public Date getServedAt() {
        return servedAt;
    }

    public void setServedAt(Date servedAt) {
        this.servedAt = servedAt;
    }


    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getHealthCareProvider() {
        return healthCareProvider;
    }

    public void setHealthCareProvider(String healthCareProvider) {
        this.healthCareProvider = healthCareProvider;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getResponseTimeInSeconds() {
        return responseTimeInSeconds;
    }

    public void setResponseTimeInSeconds(long responseTimeInSeconds) {
        this.responseTimeInSeconds = responseTimeInSeconds;
    }

    public String getHealthRisk() {
        return healthRisk;
    }

    public void setHealthRisk(String healthRisk) {
        this.healthRisk = healthRisk;
    }


}
