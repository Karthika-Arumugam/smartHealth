package com.resourceallocation.bean;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Resource")
public class Resource {

    @Id
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHealthcareProvider() {
        return healthcareProvider;
    }

    public void setHealthcareProvider(String healthcareProvider) {
        this.healthcareProvider = healthcareProvider;
    }

    public int getAvailable() {
        return available;
    }

    public void setAvailable(int available) {
        this.available = available;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    private String type;
    private String healthcareProvider;
    private int totalCount;
    private int available;
    private String owner;
    private Date createdDate;

    public Resource(String type, String healthcareProvider, int totalCount, int  available, String owner, Date createdDate ) {
        this.type = type;
        this.healthcareProvider = healthcareProvider;
        this.available = available;
        this.owner = owner;
        this.totalCount = totalCount;
        this.createdDate = createdDate;
    }
}
