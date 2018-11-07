import {Component} from '@angular/core';
import {AlertController, Events, NavController, Platform, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Labels} from "../../app/models/Labels";
import {NetworkProvider} from "../../providers/network/network";
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {File} from "@ionic-native/file";
//Input Field States
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page disabled.
 * */
const DISABLE_INPUT_FIELD = "page-contact disabled";
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page enabled.
 * */
const ENABLE_INPUT_FIELD = "page-contact enabled";

var cordova:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**
   * @ignore
   * */
  shahadProject: boolean = true;
  /**
   * @ignore
   * */
  rafidProject: boolean = false;

  //TODO:REPLACE TEMPORARY
  allLabels: Labels = new Labels(["THISISAVERYLONGLABEL", "THISISANOTHERLABEL", "MURGI", "BISHALBOROHATI"]);
  selectedLabel: string = "None"; //By default none is selected

  GENERALMODE: boolean = true;
  IMAGECAPTUREDMODE: boolean = true;
  IMAGEEDITMODE: boolean = true;
  IMAGECROPPEDMODE: boolean = true;


  CAMERAOPTIONS: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: false
  };


  capturedImage: any = null;


  constructor(public events: Events,
              public navCtrl: NavController,
              private camera: Camera,
              public platform: Platform,
              public alertCtrl: AlertController,
              public networkProvider: NetworkProvider,
              public fileSaver: FileSaverProvider,
              public toastCtrl: ToastController,
              public file:File
  ) {
  }

  discardAllChanges() {
    this.setGeneralMode();
  }

  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      if (this.IMAGECAPTUREDMODE)
        this.captureImage();
      else if (this.GENERALMODE)
        this.platform.exitApp();
    });
  }

  showError(errorMessage) {
    this.alertCtrl.create({
      title: "Information!",
      subTitle: errorMessage,
      buttons: ["Ok"]
    }).present();
  }

  showSavedImages() {
    console.log("Inside showSavedImages");
  }

  showLabelSettings() {
    console.log("Inside showLabelSettings");
  }

  importFromSource() {
    console.log("Inside importFromSource");
  }


  captureImage() {
    console.log("Inside CaptureImage");
    // // return;//TODO REMOVE LATER
    if (this.platform.is('cordova')) {
      this.camera.getPicture(this.CAMERAOPTIONS).then(imagePath => {

        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.capturedImage = imagePath;
        //this.copyFileToLocalDir(correctPath,currentName,this.createFileName());
        //this.showError(this.capturedImage);c
        this.setImageCaptureMode();
      }).catch(err => {
        console.log("WEIRD ERROR HAPPENED");
        if (!(err == "No Image Selected"))
          this.showError(err);
      });
    } else {
      this.capturedImage = "assets/mock-images/mock_image.jpg";
      this.setImageCaptureMode();
    }
  }

  private createFileName() {
    var d = new Date(),n = d.getTime(),newFileName =  n + ".png";
    return newFileName;
  }
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log(namePath);
    console.log(currentName);
    console.log(newFileName);

    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.capturedImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  storeImage() {
    console.log("Inside saveAndUpload ", this.selectedLabel);
    if (this.platform.is("cordova")) {
      if (this.networkProvider.isConnected()) {
        this.showError("WILL UPLOAD TO STORAGE: ");
        const toast = this.toastCtrl.create({
          message: "WTF",
          duration: 3000
        });
        toast.present();
      } else {
        this.showError("Network not available, saving to local storage");
        this.platform.ready().then(()=>{
          // this.fileSaver.writeFile(this.croppedImage, this.selectedLabel);
        });
      }
    }
  }



  setGeneralMode() {
    this.GENERALMODE = true;
    this.IMAGECAPTUREDMODE  = false;
    this.capturedImage = null;
  }


  setImageCaptureMode() {
    this.IMAGECAPTUREDMODE = true;
    this.GENERALMODE = false;
  }


  public pathForImage(img) {
    if (img === null) {
      return '';
    }
    else if(!this.platform.is('cordova')){
      console.log("img is ",img);
      return img;
    }
    else {
      return cordova.file.dataDirectory + img;
    }
  }
}
