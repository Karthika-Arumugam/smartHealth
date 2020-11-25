package com.resourceallocation.repository;

import java.util.List;

import com.resourceallocation.bean.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ResourceRepository extends MongoRepository<Resource, String> {

    public List<Resource> findByType(String type);

}