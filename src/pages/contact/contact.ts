import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PersonalInfoProvider} from "../../providers/personal-info/personal-info";
import { LoadingController } from 'ionic-angular';


export const USERNAME = "username_info";
export const EMAIL = "email_info";
export const PHONE = "phone_info";
export const ORGANZIATION = "oranization_info";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
 userName:String = "";
 phone:String = "";
 email:String = "";
 organization:String = "";
  @ViewChild("submitbutton") submitButton;

  disableInputFieldClass:String = "page-contact disabled";
  inputFieldClass:String = "";

  buttonText:String = "Submit";
  userDetailsIsSet:Boolean = false;


  loader:any= null;

  constructor(public navCtrl: NavController, private personalInfo:PersonalInfoProvider, private loadingCtrl:LoadingController,private alertCtrl:AlertController) {

    this.presentLoading();
    this.personalInfo.isInfoAvailable().then(promise=>{

      console.log("Personal Info Details");
      this.userDetailsIsSet = Boolean(promise);
      this.updateState(promise);
      this.dismissLoading();
    });

  }

  dismissLoading()
  {
    this.loader.dismiss();
  }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait....",
    });
    this.loader.present();
  }

  updateState(promise)
  {
    if(this.userDetailsIsSet){
      this.buttonText = "Edit";
      this.inputFieldClass = this.disableInputFieldClass;
      this.userName =  promise.USERNAME;
      this.email = promise.EMAIL;
      this.phone = promise.PHONE;
      this.organization = promise.ORGANZIATION;
      //TODO: FETCH FROM DATABASE AND POPULATE
    }
    else
      console.log("DO NOTHING");
  }

  saveUserInfo(){

    if(this.userName && this.inputFieldClass==this.disableInputFieldClass){
      this.buttonText = "Submit";
      this.inputFieldClass = "";
      return;
    }

    if(this.userName){ // at least a username is required
      this.presentLoading();
      let dataToSave = {USERNAME:this.userName,EMAIL:this.email,PHONE:this.phone,ORGANZIATION:this.organization};
      this.personalInfo.saveUserInfo(dataToSave).then(promise=>{
        console.log("Information Saved");
        this.buttonText = "Edit";
        this.inputFieldClass = this.disableInputFieldClass;
        this.dismissLoading();
      })
    }
    else{
      this.alertCtrl.create({
        title:"We Need You!",
        subTitle:"Please Let Us Know Who You Are!"
      }).addButton({
        text:"Ok"
      }).addButton({
        text:"Set Anonymous",
        handler:data=>{
          this.userName = "Anonymous";
        }
      })
        .present();
    }
  }

}
