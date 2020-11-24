package com.microsoft.docs.iothub.samples;


public class PatientInfo {


    public String PatientId;
    public int Age;
    public int Sex;
    public double years;



    public PatientInfo() {
    }

    public PatientInfo(String patientId, int Age, int Sex, double years, String Smoke) {
        this.PatientId = patientId;
        this.Age = Age;
        this.Sex = Sex;
        this.years = years;
        this.Smoke = Smoke;
    }
    public double getYears() {
        return years;
    }
    public void setYears(double years) {
        this.years = years;
    }
    public String getPatientId() {
        return PatientId;
    }
    public void setPatientId(String patientId) {
        PatientId = patientId;
    }
    public int getAge() {
        return Age;
    }
    public void setAge(int age) {
        Age = age;
    }
    public int getSex() {
        return Sex;
    }
    public void setSex(int sex) {
        Sex = sex;
    }
    public String getSmoke() {
        return Smoke;
    }
    public void setSmoke(String smoke) {
        Smoke = smoke;
    }
    public String Smoke;

}

