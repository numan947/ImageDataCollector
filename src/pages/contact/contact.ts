import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PersonalInfoProvider} from "../../providers/personal-info/personal-info";
import {LoadingController} from 'ionic-angular';
import {UserProfile} from "../../app/models/UserProfile";


// Button States
const BUTTON_SUBMIT = "Submit";
const BUTTON_EDIT = "Edit";
//Input Field States
const DISABLE_INPUT_FIELD = "page-contact disabled";
const ENABLE_INPUT_FIELD = "page-contact enabled";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  @ViewChild("submitbutton") submitButton;

  buttonText: String = BUTTON_SUBMIT;
  inputFieldClass: string = ENABLE_INPUT_FIELD;

  userDetails: UserProfile = new UserProfile("", "", "", "");

  loader: any = null;



  /*
  * Dismisses the loading screen
  * */
  dismissLoading() {
    this.loader.dismiss();
  }
/*
* Creates and presents basic loading screen
* */
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait....",
    });
    this.loader.present();
  }


  /*
  * Fetches data from storage and changes the view accordingly.
  * */
  constructor(public navCtrl: NavController, private personalInfo: PersonalInfoProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.presentLoading();
    this.personalInfo.getUserInfo().then(promise => {

      if (promise)
        this.userDetails = JSON.parse(promise);
      console.log(promise, this.userDetails);

      if (!this.userDetails.userName) {
        this.enableEdit();
      } else {
        this.disableEdit();
      }
      this.dismissLoading();
    });
  }


/*
* Enables the Input Field
* */
  enableEdit() {
    this.inputFieldClass = ENABLE_INPUT_FIELD;
    this.buttonText = BUTTON_SUBMIT;
  }

/*
* Disables the Input Field
* */
  disableEdit() {
    this.inputFieldClass = DISABLE_INPUT_FIELD;
    this.buttonText = BUTTON_EDIT;
  }


  /**
   * Condition among the three things:
   * 1. Enable Edit mode if information is available
   * 2. Save Information
   * 3. Show dialog if name is not given
   * */
  saveUserInfo() {
    if (this.buttonText == BUTTON_EDIT) {
      this.enableEdit();
    } else if (this.userDetails.userName) { // at least a username is required
      this.presentLoading();
      this.personalInfo.saveUserInfo(this.userDetails).then(promise => {
        console.log("Information Saved");
        this.disableEdit();
        this.dismissLoading();
      })
    } else {
      this.alertCtrl.create({
        title: "We Need You!",
        subTitle: "Your name will be set as Anonymous, if no information is given."
      }).addButton({
        text: "Ok"
      }).addButton({
        text: "Set Anonymous",
        handler: data => {
          this.userDetails.userName = "Anonymous";
        }
      }).present();
    }
  }


}
