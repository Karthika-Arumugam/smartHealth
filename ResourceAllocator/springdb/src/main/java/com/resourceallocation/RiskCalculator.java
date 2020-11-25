package com.resourceallocation;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

public class RiskCalculator {

    public double assessRiskAndPriority( String  criticality,
            String timestamp,
            String patientId ) {

        int risk = 0;

        switch (criticality) {
            case "low":
                risk = 1;
                break;
            case "medium":
                risk = 2;
                break;
            case "high":
                risk = 3;
                break;
        }
        if(risk == 0)
            return 0;

//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
//        Date parsedDate = null;
//        try {
//            parsedDate = dateFormat.parse(timestamp);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }

        int time =  ((int) (new Date().getTime() / 1000));
        return (risk * 0.7) + (1 / time)* 0.3;
    }
}
