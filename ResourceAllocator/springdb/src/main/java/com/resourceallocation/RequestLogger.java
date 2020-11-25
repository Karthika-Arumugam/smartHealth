
package com.resourceallocation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RequestLogger {

    private static final Logger logger = LoggerFactory.getLogger(RequestLogger.class);

    public void logRequest(String requestType, String URL, String response) {
        String result = "Request Type: " + requestType + ", URL: " + URL + ", Response: " + response;
        logger.info(result);
    }
}
