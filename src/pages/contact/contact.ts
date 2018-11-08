import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PersonalInfoProvider} from "../../providers/personal-info/personal-info";
import {LoadingController} from 'ionic-angular';
import {UserProfile} from "../../app/models/UserProfile";
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {AlertProvider} from "../../providers/alert/alert";


/**
* This variable stores Submit state the Button can be in Personal Info Page.
* */
const BUTTON_SUBMIT = "Submit";
/**
* This variable stores Edit state the Button can be in Personal Info Page.
* */
const BUTTON_EDIT = "Edit";
//Input Field States
/**
* This Variable contains the css needed to make the Input fields in Personal Info Page disabled.
* */
const DISABLE_INPUT_FIELD = "page-contact disabled";
/**
* This Variable contains the css needed to make the Input fields in Personal Info Page enabled.
* */
const ENABLE_INPUT_FIELD = "page-contact enabled";


/**
 * This class handles the personal information of users.
 * Basically, it takes the information from a user and store it in local storage.
 * It provides Edit and Save system for the information.
 * This class manages between EditMode and StaticMode of the html page.
 * EditMode: Data can be edited and submitted.
 * StaticMode: After Data is submitted, the view is disabled.
 **/
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  /**
  * Data binding for the submit button in the html, so that we can change the text of the button dynamically.
  * We change buttonText's value in between EditMode and SubmitMode.
  * */
  buttonText: String = BUTTON_SUBMIT;
  /**
  * Data binding for the input field's css class, so that we can change it's css class dynamically depending on EditMode and StaticMode.
  * */
  inputFieldClass: string = ENABLE_INPUT_FIELD;

  /**
  * Main model class that contains user information. Initialized as empty.
  * */
  userDetails: UserProfile = new UserProfile("", "", "", "");

  /**
   * This Constructor shows the loading screen.
   * Then it fetches the user information from the local storage using the PersonalInfoProvider object.
   * After the request is completed, it parses the data into local userDetails variable, which using data binding updates the view if necessary.
   * After that, the EditMode or StaticMode is selected depending on whether userName property is set in userDetails.
   * Loading screen is dismissed.
   * @param{PersonalInfoProvider}personalInfo This is the storage provider object that handles the connection with local storage.
   *  @param{NavController}navCtrl This is a library object which can control navigation from this page to other pages.
   * @param loadingProvider
   * @param alertProvider
   *  */
  constructor(public navCtrl: NavController,
              private personalInfo: PersonalInfoProvider,
              private loadingProvider:LoadingScreenProvider,
              private alertProvider:AlertProvider) {
      this.presentLoading();
      this.personalInfo.getUserInfo().then(promise => {

      //parse only if promise is not null, i.e. there's data in local storage
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

  /**
   * Called when the button in the view is pressed.
   * Condition among the three things:
   * 1. Enable Edit mode if buttonText is set to BUTTON_EDIT, which means the view was in StaticMode.
   * 2. Otherwise, if the view is in EditMode and user at least provided userName, save the credentials.
   * 3. Otherwise, show a dialog mentioning "User Name is Needed"
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
      //TODO: ADD CUSTOM ALERT MAKING CODE HERE
      // this.alertCtrl.create({
      //   title: "We Need You!",
      //   subTitle: "Your name will be set as Anonymous, if no information is given."
      // }).addButton({
      //   text: "Ok"
      // }).addButton({
      //   text: "Set Anonymous",
      //   handler: data => {
      //     this.userDetails.userName = "Anonymous";
      //   }
      // }).present();
    }
  }

  /**
  * Enables the Input Field.
  * The view goes from StaticMode to EditMode.
  * */
  enableEdit() {
    this.inputFieldClass = ENABLE_INPUT_FIELD;
    this.buttonText = BUTTON_SUBMIT;
  }

  /**
  * Disables the Input Field.
  * The view goes from EditMode to StaticMode.
  * */
  disableEdit() {
    this.inputFieldClass = DISABLE_INPUT_FIELD;
    this.buttonText = BUTTON_EDIT;
  }

  /**
  * Dismisses the loading screen.
  * */
  dismissLoading() {
    this.loadingProvider.dismissGeneralLoadingScreen();
  }
  /**
  * Creates and presents basic loading screen.
  * */
  presentLoading() {
    this.loadingProvider.showGeneralLoadingScreen();
  }



}
