// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// This application uses the Azure IoT Hub device SDK for Java
// For samples see: https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples

package com.microsoft.docs.iothub.samples;

import com.microsoft.azure.sdk.iot.device.*;
import com.google.gson.Gson;
import com.microsoft.azure.sdk.iot.device.transport.IotHubConnectionStatus;

import java.io.*;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;




public class SimulatedDevice {

    //get api
    static Map<String, PatientInfo> patientInfoList = new ConcurrentHashMap<>();
    // The device connection string to authenticate the device with your IoT hub.
//    private static String connString = "HostName=IOTSmartHealth.azure-devices.net;DeviceId=DownStreamSimulator;SharedAccessKey=H0ceZAGaNkB6s+Cx8KHBChb0qvwE6yUOltjE48DUMDc=;GatewayHostName=smarthealthedge.eastus.cloudapp.azure.com";
//    private static String c2dString = "HostName=IOTSmartHealth.azure-devices.net;DeviceId=DownStreamSimulator;SharedAccessKey=H0ceZAGaNkB6s+Cx8KHBChb0qvwE6yUOltjE48DUMDc=;";
     private static String connString = "HostName=IOTEdgeSmartHealth.azure-devices.net;DeviceId=leafIotDevice;SharedAccessKey=Wzdb3oVa9gyJSOgaEsDCBsFKK0MyLFYGRfsceyZUiLA=;GatewayHostName=edge-health-vm.westus2.cloudapp.azure.com;";
     private static String c2dString ="HostName=IOTEdgeSmartHealth.azure-devices.net;DeviceId=leafIotDevice;SharedAccessKey=Wzdb3oVa9gyJSOgaEsDCBsFKK0MyLFYGRfsceyZUiLA=;";

  // Using the MQTT protocol to connect to IoT Hub
  private static IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
  private static IotHubClientProtocol proto = IotHubClientProtocol.AMQPS;
  private static DeviceClient client;
  private static DeviceClient c2dclient;
  private  static final int D2C_MESSAGE_TIMEOUT = 2000; // 2 seconds\ke


  // Print the acknowledgement received from IoT Hub for the telemetry message sent.
  private static class EventCallback implements IotHubEventCallback {
    public void execute(IotHubStatusCode status, Object context) {
      System.out.println("IoT Hub responded to message with status: " + status.name());

      if (context != null) {
        synchronized (context) {
          context.notify();
        }
      }
    }
  }


    protected static class IotHubConnectionStatusChangeCallbackLogger implements IotHubConnectionStatusChangeCallback
    {
        @Override
        public void execute(IotHubConnectionStatus status, IotHubConnectionStatusChangeReason statusChangeReason, Throwable throwable, Object callbackContext)
        {
            System.out.println();
            System.out.println("CONNECTION STATUS UPDATE: " + status);
            System.out.println("CONNECTION STATUS REASON: " + statusChangeReason);
            System.out.println("CONNECTION STATUS THROWABLE: " + (throwable == null ? "null" : throwable.getMessage()));
            System.out.println();

            if (throwable != null)
            {
                throwable.printStackTrace();
            }

            if (status == IotHubConnectionStatus.DISCONNECTED)
            {
                //connection was lost, and is not being re-established. Look at provided exception for
                // how to resolve this issue. Cannot send messages until this issue is resolved, and you manually
                // re-open the device client
            }
            else if (status == IotHubConnectionStatus.DISCONNECTED_RETRYING)
            {
                //connection was lost, but is being re-established. Can still send messages, but they won't
                // be sent until the connection is re-established
            }
            else if (status == IotHubConnectionStatus.CONNECTED)
            {
                //Connection was successfully re-established. Can send messages.
            }
        }
    }


    /**
     * D2C Message receiver over AMQPS protocol
     */
  private static class AppMessageCallback implements MessageCallback {
    public IotHubMessageResult execute(Message msg, Object context) {
        /*
         Recieves the D2C Message from the client side for device enable/disable
         */
        System.out.println("Message recieved");
        String message = new String(msg.getBytes());
        System.out.println("Message recieved:  "+message);
        String[] parts = message.split(",");
        String PatientId = parts[0].split(":")[1];
        int Age = Integer.parseInt(parts[1].split(":")[1]);
        int Sex = 0;
        if((parts[2].split(":")[1]) != "0"){
            Sex = 1;
        }
        System.out.println("Sex "+Sex);
        double years = Double.parseDouble(parts[3].split(":")[1]);
        System.out.println("years "+years);
        String smoke = parts[4].split(":")[1];
        smoke = smoke.replaceAll("\"","");
        System.out.println("smoke "+smoke.length());

        String enable =  parts[5].split(":")[1].replace("}","");
        enable = enable.replaceAll("\"","");
        System.out.println("enable "+enable.length());
        PatientInfo pf = new PatientInfo(PatientId, Age, Sex, years, smoke);

        if(enable.equals("true")) {
//        if(true){
            System.out.println("Message recieved\n");
            System.out.println("whole obj: "+pf.toString());
            /* add new device with patient details*/
            if(!patientInfoList.containsKey(PatientId)) {
                patientInfoList.put(PatientId, pf);
            }
        } else {
            /* remove the patient */
            patientInfoList.remove(PatientId);
        }
        //return acknowledgement to the sender of D2C message
      return IotHubMessageResult.COMPLETE;
    }
  }



  private static class MessageSender implements Runnable {
    public void run() {
      try {
          String deviceId = "DownStreamSimulator";
          while (true) {
              //generate health data for active devices
              for (Map.Entry<String, PatientInfo> entry : patientInfoList.entrySet()) {
                  PatientInfo p = entry.getValue();
                  //generate data for each patient
                  System.out.println("generate data");
                  DeviceData dd = generate(p);


                  //construct message with sensor telemtry
                  String msgStr = "{\"deviceId\":\"" + deviceId + "\"," +
                          "\"messageId\":" + 4 + "," +
                          "\"emailId\":" + dd.getPatientId() + "," +
                          "\"age\":" + dd.getAge() + "," +
                          "\"chol\":" + dd.getChol() + "," +
                          "\"cigs\":" + dd.getCigs() + "," +
                          "\"cp_1\":" + dd.getCp_1() + "," +
                          "\"cp_2\":" + dd.getCp_2() + "," +
                          "\"cp_3\":" + dd.getCp_3() + "," +
                          "\"cp_4\":" + dd.getCp_4() + "," +
                          "\"dig\":" + dd.getDig() + "," +
                          "\"diuretic\":" + dd.getDiuretic() + "," +
                          "\"exang\":" + dd.getExang() + "," +
                          "\"famhist\":" + dd.getFamhist() + "," +
                          "\"fbs\":" + dd.getFbs() + "," +
                          "\"htn\":" + dd.getHtn() + "," +
                          "\"met\":" + dd.getMet() + "," +
                          "\"nitr\":" + dd.getNitr() + "," +
                          "\"old_peak\":" + dd.getOld_peak() + "," +
                          "\"painexer\":" + dd.getPainexer() + "," +
                          "\"painloc\":" + dd.getPainloc() + "," +
                          "\"pro\":" + dd.getPro() + "," +
                          "\"prop\":" + dd.getProp() + "," +
                          "\"relrest\":" + dd.getRelrest() + "," +
                          "\"restecg_0.0\":" + dd.getRestecg_0() + "," +
                          "\"restecg_1.0\":" + dd.getRestecg_1() + "," +
                          "\"restecg_2.0\":" + dd.getRestecg_2() + "," +
                          "\"rldv5\":" + dd.getRldv5() + "," +
                          "\"rldv5e\":" + dd.getRldv5e() + "," +
                          "\"sex\":" + dd.getSex() + "," +
                          "\"slope\":" + dd.getSlope() + "," +
                          "\"thalach\":" + dd.getThalach() + "," +
                          "\"thaldur\":" + dd.getThaldur() + "," +
                          "\"thalrest\":" + dd.getThalrest() + "," +
                          "\"tpeakbpd\":" + dd.getTpeakbpd() + "," +
                          "\"tpeakbps\":" + dd.getTpeakbps() + "," +
                          "\"trestbpd\":" + dd.getTrestbpd() + "," +
                          "\"trestbps\":" + dd.getTrestbps() + "," +
                          "\"xhypo\":" + dd.getXhypo() + "," +
                          "\"years\":" + dd.getYears() + "}";


                  System.out.println("event msg: "+msgStr);

                  Message msg = new Message(msgStr);


                  msg.setContentType("application/json");
                  msg.setMessageId(java.util.UUID.randomUUID().toString());
                  msg.setExpiryTime(D2C_MESSAGE_TIMEOUT);
                  Object lockobj = new Object();
                  // Send the message.
                  EventCallback callback = new EventCallback();
                  System.out.println("message sent:  " + msg);
                  client.sendEventAsync(msg, callback, lockobj);

                  synchronized (lockobj) {
                      lockobj.wait();
                  }
              }
                  System.out.println("Sleep is on.");
                  Thread.sleep(300000);
//              Thread.sleep(3000);

              }
          } catch(InterruptedException | IOException e){
              System.out.println("Finished.");
          }

    }

    private  static DeviceData generate( PatientInfo patient) throws IOException {


          HealthCareController h = new HealthCareController();

          List<DeviceData> list = new ArrayList();
          System.out.print("Patient age is " + patient.getAge());
          System.out.print("Patient Id is " + patient.getPatientId());
          System.out.print("Patient Smoke is " + patient.getSmoke());
          System.out.print("Patient Sex is " + patient.getSex());
          System.out.print("Patient Sex is " + patient.getYears());

          //  while (true) {
          DeviceData d = h.generateGandRData(patient);
          list.add(d);
          //  Thread.sleep(60000);
          return d;
          //  System.out.println("Current list is  " + d.toString());


          // }



      }
  }

  public static void main(String[] args) throws IOException, URISyntaxException {

      try{
          // Connect to the IoT hub.
          URL url = new URL("http://localhost:3001/api/v1/patient/morePatientInfoAboutActive");

          HttpURLConnection conn = (HttpURLConnection) url.openConnection();
          conn.setRequestMethod("GET");
          conn.connect();

          //Getting the response code
          int responsecode = conn.getResponseCode();

          if (responsecode != 200) {
              throw new RuntimeException("HttpResponseCode: " + responsecode);
          } else {

              String inline = "";
              Scanner scanner = new Scanner(url.openStream());

              //Write all the JSON data into a string using a scanner
              while (scanner.hasNext()) {
                  inline += scanner.nextLine();
              }

              //Close the scanner
              scanner.close();
              System.out.println("check the reponse: "+ inline);
              //Using the JSON simple library parse the string into a json object
              JSONParser parse = new JSONParser();
              JSONArray arr = (JSONArray) parse.parse(inline);

              for (int i = 0; i < arr.size(); i++) {

                  JSONObject new_obj = (JSONObject) arr.get(i);
                  String PatientId =  "\""+new_obj.get("emailId").toString()+"\"";
                  System.out.println("check emailId: " + PatientId);
                  int Age = ((Long) new_obj.get("age")).intValue();
                  System.out.println("check age: " + Age);
                  int Sex = 0;
                  if(new_obj.get("gender").equals("M")){
                      Sex = 1;
                  }
                  System.out.println("check Sex: " + Sex);
                  double years= 0;
                  if(new_obj.containsKey("smokingyears"))
                  {
                      years = ((Long) new_obj.get("smokingyears")).doubleValue();
                  }
                  System.out.println("check years: " + years);
                  String smoke ="No";
                  if(new_obj.containsKey("cigperday")){
                      int val = ((Long)new_obj.get("cigperday")).intValue();
                      if(val > 0){
                          smoke = "Yes";
                      }
                  }
                  System.out.println("check smoke: " + smoke);
                  PatientInfo pf = new PatientInfo(PatientId, Age, Sex, years, smoke);
                  System.out.println("whole obj: "+pf.toString());
                  if(!patientInfoList.containsKey(PatientId)) {
                      patientInfoList.put(PatientId, pf);
                  }
              }
          }

      }
      catch (Exception e) {
          e.printStackTrace();
      }

        client = new DeviceClient(connString, protocol);
        c2dclient = new DeviceClient(c2dString, proto);
        String pathToCertificate = "/Users/karthika/azure-iot-test-only.root.ca.cert.pem";
        client.setOption("SetCertificatePath", pathToCertificate );
        System.out.format("Using certificate protocol %s.\n", pathToCertificate);
//    MessageCallback callback = new AppMessageCallback();
//    client.setMessageCallback(callback, null);

        long time = 2400;
        client.setOption("SetSASTokenExpiryTime", time);
        System.out.println("Updated token expiry time to " + time);
        MessageCallback callback = new AppMessageCallback();
        c2dclient.setMessageCallback(callback, null);

        client.registerConnectionStatusChangeCallback(new IotHubConnectionStatusChangeCallbackLogger(), new Object());
      System.out.println("Using certificate protocol client 1 %s.\n");
        client.open();
      System.out.println("Using certificate protocol client 2 %s.\n");
        c2dclient.open();
      System.out.println("Using certificate protocol client 2 %s.\n");

    // Create new thread and start sending messages 
    MessageSender sender = new MessageSender();
    ExecutorService executor = Executors.newFixedThreadPool(1);
    executor.execute(sender);


//      MessageReciever reciever = new MessageReciever();
//      ExecutorService executorService = Executors.newFixedThreadPool(1);
//      executorService.execute(reciever);

    // Stop the application.
    System.out.println("Press ENTER to exit.");
    System.in.read();
//    executor.shutdownNow();
    client.closeNow();
  }
}


/*
                  try{
                      // Connect to the IoT hub.
                      URL url = new URL("http://localhost:3001/api/v1/patient/morePatientInfoAboutActive");

                      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                      conn.setRequestMethod("GET");
                      conn.connect();

                      //Getting the response code
                      int responsecode = conn.getResponseCode();

                      if (responsecode != 200) {
                          throw new RuntimeException("HttpResponseCode: " + responsecode);
                      } else {

                          String inline = "";
                          Scanner scanner = new Scanner(url.openStream());

                          //Write all the JSON data into a string using a scanner
                          while (scanner.hasNext()) {
                              inline += scanner.nextLine();
                          }

                          //Close the scanner
                          scanner.close();
                          System.out.println("check the reponse: "+ inline);
                          //Using the JSON simple library parse the string into a json object
                          JSONParser parse = new JSONParser();
                          JSONArray arr = (JSONArray) parse.parse(inline);

                          for (int i = 0; i < arr.size(); i++) {

                              JSONObject new_obj = (JSONObject) arr.get(i);
                              System.out.println("check emailId: " + new_obj.get("emailId"));
                              String PatientId =  new_obj.get("emailId").toString();
                              int Age = (int)new_obj.get("age");
                              int Sex = 0;
                              if(new_obj.get("gender").equals("M")){
                                  Sex = 1;
                              }
                              double years= 0;
                              if(new_obj.containsKey("smokingyears"))
                              {
                                  years = (double) new_obj.get("smokingyears");
                              }
                              String smoke ="No";
                              if(new_obj.containsKey("cigperday")){
                                  int val = (int)new_obj.get("cigperday");
                                  if(val > 0){
                                      smoke = "Yes";
                                  }
                              }
                              PatientInfo pf = new PatientInfo(PatientId, Age, Sex, years, smoke);
                          }
                      }

                  }
                  catch (Exception e) {
                      e.printStackTrace();
                  }
 */