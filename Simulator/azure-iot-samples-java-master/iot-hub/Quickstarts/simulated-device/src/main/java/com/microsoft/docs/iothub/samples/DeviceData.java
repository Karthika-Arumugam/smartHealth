package com.microsoft.docs.iothub.samples;
public class DeviceData {

    int Age;
    int Sex;


    String PatientId;

    /* G Values */
    int Trestbps;
    public String getPatientId() {
        return PatientId;
    }
    public void setPatientId(String patientId) {
        PatientId = patientId;
    }
    int Chol;
    int Fbs;
    int Thalach;
    int Thalrest;
    int Tpeakbps ;
    int Tpeakbpd;
    int Trestbpd ;

    @Override
    public String toString()
    {
        return "Age is " + Age + "Sex is " + Sex;
    }


    /* R Values */
    int Painloc;
    int Painexer;
    int htn;
    int Famhist;
    int Dig;
    int prop;
    int nitr;
    int Pro;
    int Diuretic;


    int Thaldur;
    int Met;
    int exang;
    int Xhypo;
    int Old_peak;
    int Slope;
    int Rldv5;
    int Rldv5e;
    int Cp_encoded;
    int Restcg_encoded;


    double cigs;
    public double getCigs() {
        return cigs;
    }
    public void setCigs(double cigs) {
        this.cigs = cigs;
    }
    public double getYears() {
        return years;
    }
    public void setYears(double years) {
        this.years = years;
    }
    double years;



    int cp_1;
    int cp_2;
    int cp_3;
    int cp_4;
    int relrest;
    int restecg_0;
    int restecg_1;
    int restecg_2;






    public int getTrestbpd() {
        return Trestbpd;
    }
    public void setTrestbpd(int trestbpd) {
        Trestbpd = trestbpd;
    }
    public int getCp_1() {
        return cp_1;
    }
    public void setCp_1(int cp_1) {
        this.cp_1 = cp_1;
    }
    public int getCp_2() {
        return cp_2;
    }
    public void setCp_2(int cp_2) {
        this.cp_2 = cp_2;
    }
    public int getCp_3() {
        return cp_3;
    }
    public void setCp_3(int cp_3) {
        this.cp_3 = cp_3;
    }
    public int getCp_4() {
        return cp_4;
    }
    public void setCp_4(int cp_4) {
        this.cp_4 = cp_4;
    }
    public int getRelrest() {
        return relrest;
    }
    public void setRelrest(int relrest) {
        this.relrest = relrest;
    }
    public int getRestecg_0() {
        return restecg_0;
    }
    public void setRestecg_0(int restecg_0) {
        this.restecg_0 = restecg_0;
    }
    public int getRestecg_1() {
        return restecg_1;
    }
    public void setRestecg_1(int restecg_1) {
        this.restecg_1 = restecg_1;
    }
    public int getRestecg_2() {
        return restecg_2;
    }
    public void setRestecg_2(int restecg_2) {
        this.restecg_2 = restecg_2;
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
    public int getPainloc() {
        return Painloc;
    }
    public void setPainloc(int painloc) {
        Painloc = painloc;
    }
    public int getPainexer() {
        return Painexer;
    }
    public void setPainexer(int painexer) {
        Painexer = painexer;
    }

    public int getTrestbps() {
        return Trestbps;
    }
    public void setTrestbps(int trestbps) {
        Trestbps = trestbps;
    }
    public int getHtn() {
        return htn;
    }
    public void setHtn(int htn) {
        this.htn = htn;
    }
    public int getChol() {
        return Chol;
    }
    public void setChol(int chol) {
        Chol = chol;
    }


    public int getFbs() {
        return Fbs;
    }
    public void setFbs(int fbs) {
        Fbs = fbs;
    }
    public int getFamhist() {
        return Famhist;
    }
    public void setFamhist(int famhist) {
        Famhist = famhist;
    }
    public int getDig() {
        return Dig;
    }
    public void setDig(int dig) {
        Dig = dig;
    }
    public int getProp() {
        return prop;
    }
    public void setProp(int prop) {
        this.prop = prop;
    }
    public int getNitr() {
        return nitr;
    }
    public void setNitr(int nitr) {
        this.nitr = nitr;
    }
    public int getPro() {
        return Pro;
    }
    public void setPro(int pro) {
        Pro = pro;
    }
    public int getDiuretic() {
        return Diuretic;
    }
    public void setDiuretic(int diuretic) {
        Diuretic = diuretic;
    }
    public int getThaldur() {
        return Thaldur;
    }
    public void setThaldur(int thaldur) {
        Thaldur = thaldur;
    }
    public int getMet() {
        return Met;
    }
    public void setMet(int met) {
        Met = met;
    }
    public int getThalach() {
        return Thalach;
    }
    public void setThalach(int thalach) {
        Thalach = thalach;
    }
    public int getThalrest() {
        return Thalrest;
    }
    public void setThalrest(int thalrest) {
        Thalrest = thalrest;
    }
    public int getTpeakbps() {
        return Tpeakbps;
    }
    public void setTpeakbps(int tpeakbps) {
        Tpeakbps = tpeakbps;
    }
    public int getTpeakbpd() {
        return Tpeakbpd;
    }
    public void setTpeakbpd(int tpeakbpd) {
        Tpeakbpd = tpeakbpd;
    }

    public int getExang() {
        return exang;
    }
    public void setExang(int exang) {
        this.exang = exang;
    }
    public int getXhypo() {
        return Xhypo;
    }
    public void setXhypo(int xhypo) {
        Xhypo = xhypo;
    }
    public int getOld_peak() {
        return Old_peak;
    }
    public void setOld_peak(int old_peak) {
        Old_peak = old_peak;
    }
    public int getSlope() {
        return Slope;
    }
    public void setSlope(int slope) {
        Slope = slope;
    }
    public int getRldv5() {
        return Rldv5;
    }
    public void setRldv5(int rldv5) {
        Rldv5 = rldv5;
    }
    public int getRldv5e() {
        return Rldv5e;
    }
    public void setRldv5e(int rldv5e) {
        Rldv5e = rldv5e;
    }
    public int getCp_encoded() {
        return Cp_encoded;
    }
    public void setCp_encoded(int cp_encoded) {
        Cp_encoded = cp_encoded;
    }
    public int getRestcg_encoded() {
        return Restcg_encoded;
    }
    public void setRestcg_encoded(int restcg_encoded) {
        Restcg_encoded = restcg_encoded;
    }


}

