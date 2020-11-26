package com.resourceallocation;//Copyright (c) Microsoft Corporation. All rights reserved.
//Licensed under the MIT License.

import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.LongDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Collections;
import java.util.Properties;

public class TestConsumerThread implements Runnable {

    private final String TOPIC;
    
    //Each consumer needs a unique client ID per thread
    private static int id = 0;

    public TestConsumerThread(final String TOPIC){
        this.TOPIC = TOPIC;
    }

    public void run (){
        final Consumer<Long, String> consumer = createConsumer();
        ResourceRequestConsumer resourceRequestConsumer = new ResourceRequestConsumer();

        try {
            while (true) {
//                try {
//                    Thread.sleep(6000);
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }
                System.out.println("Polling");
                final ConsumerRecords<Long, String> consumerRecords = consumer.poll(1000);
                for(ConsumerRecord<Long, String> cr : consumerRecords) {
                    System.out.println("Received consumer request");
                    System.out.println(cr);
                    System.out.printf("Consumer Record:(%d, %s, %d, %d)\n", cr.key(), cr.value(), cr.partition(), cr.offset());
                    resourceRequestConsumer.consume(cr.value());
                }
                consumer.commitAsync();

               // ResourceRequestConsumer resourceRequestConsumer = new ResourceRequestConsumer();
             //   resourceRequestConsumer.consume("\"{\\\"deviceId\\\": \\\"DownStreamSimulator\\\", \\\"messageId\\\": 4, \\\"emailId\\\": \\\"user@gmail.com\\\", \\\"age\\\": 50, \\\"chol\\\": 343, \\\"cigs\\\": 10.0, \\\"cp_1\\\": 0, \\\"cp_2\\\": 0, \\\"cp_3\\\": 0, \\\"cp_4\\\": 1, \\\"dig\\\": 0, \\\"diuretic\\\": 0, \\\"exang\\\": 1, \\\"famhist\\\": -9, \\\"fbs\\\": 1, \\\"htn\\\": 1, \\\"met\\\": 5, \\\"nitr\\\": 0, \\\"old_peak\\\": 1, \\\"painexer\\\": 1, \\\"painloc\\\": 1, \\\"pro\\\": 0, \\\"prop\\\": 0, \\\"relrest\\\": 1, \\\"restecg_0\\\": 1, \\\"restecg_1\\\": 0, \\\"restecg_2\\\": 0, \\\"rldv5\\\": 4, \\\"rldv5e\\\": 3, \\\"sex\\\": 1, \\\"slope\\\": 2, \\\"thalach\\\": 102, \\\"thaldur\\\": 18, \\\"thalrest\\\": 57, \\\"tpeakbpd\\\": 131, \\\"tpeakbps\\\": 188, \\\"trestbpd\\\": 53, \\\"trestbps\\\": 167, \\\"xhypo\\\": 0, \\\"years\\\": 20.0, \\\"risk_level\\\": \\\"Low\\\", \\\"risk_factor\\\": 1}\"");
            }
        } catch (CommitFailedException e) {
            System.out.println("CommitFailedException: " + e);
        } finally {
            consumer.close();
        }
    }

    private Consumer<Long, String> createConsumer() {
        try {
            final Properties properties = new Properties();
            synchronized (TestConsumerThread.class) {
                properties.put(ConsumerConfig.CLIENT_ID_CONFIG, "KafkaExampleConsumer#" + id);
                id++;
            }
            properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, LongDeserializer.class.getName());
            properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

            //Get remaining properties from config file
           // properties.load(getClass().getResourceAsStream("consumer.properties"));
//           /Users/deepika/Documents/GitHub/CMPE226_DatabaseForum/backend/springdb/src/main/java/com/resourceallocation/TestConsumerThread.java
           properties.load(new FileReader("/home/azureuser/smartHealth/ResourceAllocator/springdb/consumer.config"));

            // Create the consumer using properties.
            final Consumer<Long, String> consumer = new KafkaConsumer<>(properties);

            // Subscribe to the topic.
            consumer.subscribe(Collections.singletonList(TOPIC));
            return consumer;
            
        } catch (FileNotFoundException e){
            System.out.println("FileNoteFoundException: " + e);
            System.exit(1);
            return null;        //unreachable
        } catch (IOException e){
            System.out.println("IOException: " + e);
            System.exit(1);
            return null;        //unreachable
        }
    }
}
