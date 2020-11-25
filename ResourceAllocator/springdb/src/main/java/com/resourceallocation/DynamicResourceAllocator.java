
package com.resourceallocation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@SpringBootApplication
public class DynamicResourceAllocator {

	private final static String TOPIC = "iothub-ehub-iotedgesma-5897656-e8f9283c1b";

	private final static int NUM_THREADS = 1;

	public static void main(String[] args) {

		SpringApplication.run(DynamicResourceAllocator.class, args);

			final ExecutorService executorService = Executors.newFixedThreadPool(NUM_THREADS);

			for (int i = 0; i < NUM_THREADS; i++){
				executorService.execute(new TestConsumerThread(TOPIC));
			}
	}

}
