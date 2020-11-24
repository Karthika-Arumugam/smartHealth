package com.microsoft.docs.iothub.samples;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.temporal.ValueRange;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;

//@RestController
public class HealthCareController {


  /*  @PostMapping("/simulate")
    public List<DeviceData> generate(@RequestBody PatientInfo patient) throws IOException {

    	List<DeviceData> list = new ArrayList();
        System.out.print("Patient age is " + patient.getAge());
        System.out.print("Patient Id is " + patient.getPatientId());
        System.out.print("Patient Smoke is " + patient.getSmoke());
        System.out.print("Patient Sex is " + patient.getSex());
        System.out.print("Patient Sex is " + patient.getYears());

        while (true) {
            try {
                DeviceData d = generateGandRData(patient);
                list.add(d);
                Thread.sleep(60000);
                System.out.println("Current list is  " + d.toString());
            } catch (InterruptedException e) {
                System.out.println("InterruptedException Exception" + e.getMessage());
            }
        }



    } */








    public DeviceData generateGandRData(PatientInfo patient)throws IOException {

        int Age = patient.getAge();
        int Sex = patient.getSex();
        double years = patient.getYears();
        Random rand = new Random();

        ValueRange range20_29 = ValueRange.of(20, 29);
        ValueRange range30_39 = ValueRange.of(30, 39);
        ValueRange range40_49 = ValueRange.of(40, 49);
        ValueRange range50_59 = ValueRange.of(50, 59);
        ValueRange range60_69 = ValueRange.of(60, 69);
        ValueRange range70_79 = ValueRange.of(70, 79);

        DeviceData simulatedData = new DeviceData();


        int Trestbps = 0;
        int Chol = 0;
        int Fbs = 0;
        int Thalach = 0;
        int Thalrest = 0;
        int Tpeakbps = 0;
        int Tpeakbpd = 0;
        int Trestbpd = 0;
        double cigs = 0.0;
        int relrest = 0;

        int random = 1;

        if (range20_29.isValidIntValue(Age) && Sex == 1) { //Male


            Trestbps = (int)(Math.random() * (140 - 120 + 1) + 120);
            Chol = (int)(Math.random() * (250 - 130 + 1) + 130);
            Fbs = 0;
            Thalach = (int)(Math.random() * (202 - 160 + 1) + 160);
            Thalrest = (int)(Math.random() * (85 - 53 + 1) + 53);
            Tpeakbps = (int)(Math.random() * (196 - 180 + 1) + 180);
            Tpeakbpd = (int)(Math.random() * (90 - 70 + 1) + 70);
            Trestbpd = (int)(Math.random() * (96 - 70 + 1) + 70);

            cigs = -9;
            relrest =0;
            random = (int)(Math.random() * (4 - 1 + 1) + 1);



        } else if (range20_29.isValidIntValue(Age) && Sex == 0) { //Female

            Trestbps = 170;
            Chol = 237;
            Fbs = 0;
            Thalach = 170;
            Thalrest = 125;
            Tpeakbps = 140;
            Tpeakbpd = 80;
            Trestbpd = 80;
            cigs = -9;
            relrest =0;
            random = 5;


        } else if (range30_39.isValidIntValue(Age) && Sex == 1) { //Male
            Trestbps = (int)(Math.random() * (150 - 92 + 1) + 92);
            Chol = (int)(Math.random() * (340 - 117 + 1) + 117);
            Fbs = (int)(Math.random() * (1 - 0 + 1) + 0);
            Thalach = (int)(Math.random() * (187 - 98 + 1) + 98);
            Thalrest = (int)(Math.random() * (134 - 53 + 1) + 53);
            Tpeakbps = (int)(Math.random() * (235 - 130 + 1) + 130);
            Tpeakbpd = (int)(Math.random() * (120 - 40 + 1) + 40);
            Trestbpd = (int)(Math.random() * (100 - 68 + 1) + 68);
            relrest = (int)(Math.random() * (1 - 0 + 1) + 0);
            cigs = rand.nextBoolean() ? 4 : 20;
            random = (int)(Math.random() * (8 - 6 + 1) + 6);


        } else if (range30_39.isValidIntValue(Age) && Sex == 0) { //Female



            Trestbps = (int)(Math.random() * (140 - 100 + 1) + 100);
            Chol = (int)(Math.random() * (275 - 160 + 1) + 160);
            Fbs = 0;
            Thalach = (int)(Math.random() * (192 - 129 + 1) + 129);
            Thalrest = (int)(Math.random() * (125 - 57 + 1) + 57);
            Tpeakbps = (int)(Math.random() * (196 - 116 + 1) + 116);
            Tpeakbpd = (int)(Math.random() * (120 - 58 + 1) + 58);
            Trestbpd = (int)(Math.random() * (90 - 64 + 1) + 64);
            relrest = (int)(Math.random() * (1 - 0 + 1) + 0);

            cigs = -9;
            random = (int)(Math.random() * (12 - 9 + 1) + 9);
        } else if (range40_49.isValidIntValue(Age) && Sex == 1) { //Male


            Trestbps = (int)(Math.random() * (180 - 100 + 1) + 100);
            Chol = (int)(Math.random() * (350 - 142 + 1) + 142);
            Fbs = (int)(Math.random() * (1 - 0 + 1) + 0);
            Thalach = (int)(Math.random() * (194 - 80 + 1) + 80);
            Thalrest = (int)(Math.random() * (125 - 49 + 1) + 49);
            Tpeakbps = (int)(Math.random() * (240 - 100 + 1) + 100);
            Tpeakbpd = (int)(Math.random() * (130 - 45 + 1) + 45);
            Trestbpd = (int)(Math.random() * (106 - 60 + 1) + 60);
            relrest = (int)(Math.random() * (1 - 0 + 1) + 0);
            cigs = (Math.random() * (8 - 1 + 1) + 1) * 10;
            random = (int)(Math.random() * (15 - 13 + 1) + 13);

        } else if (range40_49.isValidIntValue(Age) && Sex == 0) { //Female

            // 100-180	141-392	more0s / less 1s	90-180	54-115	84-240	58-110	60-100
            Trestbps = (int)(Math.random() * (180 - 100 + 1) + 100);
            Chol = (int)(Math.random() * (392 - 141 + 1) + 141);
            Fbs = 0;
            Thalach = (int)(Math.random() * (180 - 90 + 1) + 90);
            Thalrest = (int)(Math.random() * (115 - 54 + 1) + 54);
            Tpeakbps = (int)(Math.random() * (240 - 84 + 1) + 84);
            Tpeakbpd = (int)(Math.random() * (110 - 58 + 1) + 58);
            Trestbpd = (int)(Math.random() * (100 - 60 + 1) + 60);
            relrest = 0;
            cigs = -9;
            random = (int)(Math.random() * (18 - 16 + 1) + 16);

        } else if (range50_59.isValidIntValue(Age) && Sex == 0) { //Female

            //100-200	180-394(410s)	more0s / less 1s	96-172	52-115	112-220	60-118	64-110
            Trestbps = (int)(Math.random() * (200 - 100 + 1) + 100);
            Chol = (int)(Math.random() * (394 - 180 + 1) + 180);
            Fbs = 0;
            Thalach = (int)(Math.random() * (172 - 96 + 1) + 96);
            Thalrest = (int)(Math.random() * (115 - 52 + 1) + 52);
            Tpeakbps = (int)(Math.random() * (220 - 112 + 1) + 112);
            Tpeakbpd = (int)(Math.random() * (118 - 60 + 1) + 60);
            Trestbpd = (int)(Math.random() * (110 - 64 + 1) + 64);
            relrest = 0;
            cigs = -9;
            random = (int)(Math.random() * (23 - 21 + 1) + 21);

        } else if (range50_59.isValidIntValue(Age) && Sex == 1) { //Male

            //	100-200	100-388(400,500,600)	0/1	69-195	46-139	90-240	26-134	50-110
            Trestbps = (int)(Math.random() * (200 - 100 + 1) + 100);
            Chol = (int)(Math.random() * (388 - 100 + 1) + 100);
            Fbs = (int)(Math.random() * (1 - 0 + 1) + 0);
            Thalach = (int)(Math.random() * (195 - 69 + 1) + 69);
            Thalrest = (int)(Math.random() * (139 - 46 + 1) + 46);
            Tpeakbps = (int)(Math.random() * (240 - 90 + 1) + 90);
            Tpeakbpd = (int)(Math.random() * (134 - 26 + 1) + 26);
            Trestbpd = (int)(Math.random() * (110 - 50 + 1) + 50);
            relrest = 1;
            cigs = rand.nextBoolean() ? 0 : 10;
            random = (int)(Math.random() * (20 - 19 + 1) + 19);

        } else if (range60_69.isValidIntValue(Age) && Sex == 0) { //Female

            //100-180	164-294(400s,500)	more0s / less 1s	96-179	49-119	130-240	40-104	50-100
            Trestbps = (int)(Math.random() * (180 - 100 + 1) + 100);
            Chol = (int)(Math.random() * (294 - 164 + 1) + 164);
            Fbs = 0;
            Thalach = (int)(Math.random() * (179 - 96 + 1) + 96);
            Thalrest = (int)(Math.random() * (119 - 49 + 1) + 49);
            Tpeakbps = (int)(Math.random() * (240 - 130 + 1) + 130);
            Tpeakbpd = (int)(Math.random() * (104 - 40 + 1) + 40);
            Trestbpd = (int)(Math.random() * (100 - 50 + 1) + 50);
            relrest = (int)(Math.random() * (1 - 0 + 1) + 0);
            cigs = (Math.random() * (50 - 20 + 1) + 20);
            random = (int)(Math.random() * (29 - 27 + 1) + 27);


        } else if (range60_69.isValidIntValue(Age) && Sex == 1) { //Male

            //96-190	139-384(0)	0/1	71-174	37-100	92-240	60-120(11)	60-110
            Trestbps = (int)(Math.random() * (190 - 96 + 1) + 96);
            Chol = (int)(Math.random() * (384 - 139 + 1) + 139);
            Fbs = (int)(Math.random() * (1 - 0 + 1) + 0);
            Thalach = (int)(Math.random() * (174 - 71 + 1) + 71);
            Thalrest = (int)(Math.random() * (100 - 37 + 1) + 37);
            Tpeakbps = (int)(Math.random() * (240 - 92 + 1) + 92);
            Tpeakbpd = (int)(Math.random() * (120 - 60 + 1) + 60);
            Trestbpd = (int)(Math.random() * (110 - 60 + 1) + 60);
            relrest = (int)(Math.random() * (1 - 0 + 1) + 0);
            cigs = (Math.random() * (13 - 0 + 1) + 0) * 5;

            random = (int)(Math.random() * (26 - 24 + 1) + 24);


        } else if (range70_79.isValidIntValue(Age) && Sex == 0) { //Female

            //112-160	149-302	more0s / less 1s	116-162	59-93	140-190	70-110	78-90
            Trestbps = (int)(Math.random() * (160 - 112 + 1) + 112);
            Chol = (int)(Math.random() * (302 - 149 + 1) + 149);
            Fbs = 0;
            Thalach = (int)(Math.random() * (162 - 116 + 1) + 116);
            Thalrest = (int)(Math.random() * (93 - 59 + 1) + 59);
            Tpeakbps = (int)(Math.random() * (190 - 140 + 1) + 140);
            Tpeakbpd = (int)(Math.random() * (110 - 70 + 1) + 70);
            Trestbpd = (int)(Math.random() * (90 - 78 + 1) + 78);
            relrest = (int)(Math.random() * (1 - 0 + 1) + 0);
            cigs = (Math.random() * (50 - 20 + 1) + 20);
            random = (int)(Math.random() * (35 - 33 + 1) + 33);

        } else if (range70_79.isValidIntValue(Age) && Sex == 1) { //Male

            //M	120-170(104)	203-322(172,192)	0/1	94-162	40-101	110-210	60-114	58-96
            Trestbps = (int)(Math.random() * (170 - 120 + 1) + 120);
            Chol = (int)(Math.random() * (322 - 203 + 1) + 203);
            Fbs = (int)(Math.random() * (1 - 0 + 1) + 0);
            Thalach = (int)(Math.random() * (162 - 94 + 1) + 94);
            Thalrest = (int)(Math.random() * (101 - 40 + 1) + 40);
            Tpeakbps = (int)(Math.random() * (210 - 110 + 1) + 110);
            Tpeakbpd = (int)(Math.random() * (114 - 60 + 1) + 60);
            Trestbpd = (int)(Math.random() * (96 - 58 + 1) + 58);
            cigs = (Math.random() * (12 - 3 + 1) + 3) * 5;
            relrest = 1;

            random = (int)(Math.random() * (32 - 30 + 1) + 30);
        }

        simulatedData.setChol(Chol);
        simulatedData.setTrestbps(Trestbps);
        simulatedData.setFbs(Fbs);
        simulatedData.setThalach(Thalach);
        simulatedData.setThalrest(Thalrest);
        simulatedData.setTpeakbps(Tpeakbps);
        simulatedData.setTpeakbpd(Tpeakbpd);
        simulatedData.setTrestbpd(Trestbpd);
        simulatedData.setAge(Age);
        simulatedData.setSex(Sex);
        simulatedData.setCigs(cigs);
        simulatedData.setRelrest(relrest);
        simulatedData.setYears(years);
        simulatedData.setPatientId(patient.getPatientId());




        //Generate R data

        //obtaining input bytes from a file
        FileInputStream fis = new FileInputStream(new File("/Users/karthika/Book1.xlsx"));
        //creating workbook instance that refers to .xls file
        XSSFWorkbook wb = new XSSFWorkbook(fis);
        //creating a Sheet object to retrieve the object
        XSSFSheet sheet = wb.getSheetAt(0);
        //evaluating cell type
        FormulaEvaluator formulaEvaluator = wb.getCreationHelper().createFormulaEvaluator();



        List < Integer > r_values = new ArrayList < > ();

        for (Cell cell: sheet.getRow(random)) //iteration over cell using for each loop
        {
            switch (formulaEvaluator.evaluateInCell(cell).getCellType()) {
                case Cell.CELL_TYPE_NUMERIC: //field that represents numeric cell type
                    //getting the value of the cell as a number
                    //System.out.print(cell.getNumericCellValue()+ "\t\t");
                    r_values.add((int) cell.getNumericCellValue());
                    break;
                case Cell.CELL_TYPE_STRING: //field that represents string cell type
                    //getting the value of the cell as a string
                    System.out.println("Entering here");
                    //r_values.add((int) cell.getNumericCellValue());
                    //System.out.print(cell.getStringCellValue()+ "\t\t");
                    break;
            }

            System.out.println("List is" + r_values);
        }

        System.out.println("Painloc is" + r_values.get(3));
        simulatedData.setPainloc(r_values.get(2));
        System.out.println("Painexer is" + r_values.get(4));
        simulatedData.setPainexer(r_values.get(3));
        System.out.println("htn is" + r_values.get(5));
        simulatedData.setHtn(r_values.get(4));
        System.out.println("Famhist is" + r_values.get(7));
        simulatedData.setFamhist(r_values.get(6));
        System.out.println("dig is" + r_values.get(8));
        simulatedData.setDig(r_values.get(7));
        System.out.println("Prop is" + r_values.get(9));
        simulatedData.setProp(r_values.get(8));
        System.out.println("nitr is" + r_values.get(10));
        simulatedData.setNitr(r_values.get(9));
        System.out.println("pro is" + r_values.get(11));
        simulatedData.setPro(r_values.get(10));
        System.out.println("diuretic is" + r_values.get(12));
        simulatedData.setDiuretic(r_values.get(11));
        System.out.println("thaldur is" + r_values.get(13));
        simulatedData.setThaldur(r_values.get(12));
        System.out.println("met is" + r_values.get(14));
        simulatedData.setMet(r_values.get(13));
        System.out.println("exang is" + r_values.get(15));
        simulatedData.setExang(r_values.get(14));
        System.out.println("xhypo is" + r_values.get(16));
        simulatedData.setXhypo(r_values.get(15));
        System.out.println("oldpeak is" + r_values.get(17));
        simulatedData.setOld_peak(r_values.get(16));
        System.out.println("slope is" + r_values.get(18));
        simulatedData.setSlope(r_values.get(17));
        System.out.println("rldv5 is" + r_values.get(19));
        simulatedData.setRldv5(r_values.get(18));
        //System.out.println("rldv5e is" + r_values.get(20));
        simulatedData.setRldv5e(r_values.get(19));



        simulatedData.setCp_1(r_values.get(20));
        simulatedData.setCp_2(r_values.get(21));
        simulatedData.setCp_3(r_values.get(22));
        simulatedData.setCp_4(r_values.get(23));
        simulatedData.setRestecg_0(r_values.get(24));
        simulatedData.setRestecg_1(r_values.get(25));
        simulatedData.setRestecg_2(r_values.get(26));

        return simulatedData;

    }



}
