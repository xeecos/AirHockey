#include <Arduino.h>
#include <MeMegaPi.h>
MeMegaPiDCMotor dc(PORT_3);
MeStepperOnBoard stepperX(SLOT1);
MeStepperOnBoard stepperY(SLOT2);
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
    stepperX.setMaxSpeed(10000);
    stepperX.setAcceleration(10000);
    stepperX.setMicroStep(8);
    stepperX.enableOutputs();
    stepperY.setMaxSpeed(10000);
    stepperY.setAcceleration(10000);
    stepperY.setMicroStep(8);
    stepperY.enableOutputs();
  dc.run(255);
}
String s = "";
String ss = "";
int speedX = 0;
int speedY = 0; 
int speedTx = 0;
int speedTy = 0;
void loop() {
  if(Serial.available()){
    char c = Serial.read();
    if(c=='\n'){
      char *p = (char*)(s.c_str());
      char * tmp;
      char * str;
      str = strtok_r(p, " ", &tmp);
      while(str!=NULL){
        str = strtok_r(0, " ", &tmp);
        if(str[0]=='X'){
          speedX = atoi(str+1);
        }else if(str[0]=='Y'){
          speedY = atoi(str+1);    
        }
      }
      s = "";
      /*Serial.print(speedX);
      Serial.print(":");
      Serial.println(speedY);*/
      Serial.print("ok\n");
    }else{
      s+=c;
    }
  }
  if(speedX>speedTx){
    speedTx += 1;
  }
  if(speedX<speedTx){
    speedTx -= 1;
  }
  if(speedY>speedTy){
    speedTy += 1;
  }
  if(speedY<speedTy){
    speedTy -= 1;
  }
  stepperX.setSpeed(speedTx);
  stepperY.setSpeed(speedTy);
  // put your main code here, to run repeatedly:
  stepperX.update();
  stepperY.update();
}
