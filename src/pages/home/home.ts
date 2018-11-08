import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Labels} from "../../app/models/Labels";
import {NetworkProvider} from "../../providers/network/network";
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {ToastProvider} from "../../providers/toast/toast";
import {AlertProvider} from "../../providers/alert/alert";
import {BackgroundProvider} from "../../providers/background/background";
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {ImageListPage} from "../image-list/image-list";
import {ImageModel} from "../../app/models/ImageModel";
//Input Field States
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page disabled.
 * */
const DISABLE_INPUT_FIELD = "page-contact disabled";
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page enabled.
 * */
const ENABLE_INPUT_FIELD = "page-contact enabled";

declare var cordova:any;
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
  allLabels: Labels = new Labels({"None":"None","LABEL1":"URL1","LABEL5":"URL5","LABEL4":"URL4","LABEL3":"URL3","LABEL2":"URL2"});


  selectedLabel: string = "None"; //By default none is selected

  GENERALMODE: boolean = true;
  IMAGECAPTUREDMODE: boolean = false;

  storeButtonDisabled:boolean = true;
  uploadButtonDisabled:boolean = true;


  CAMERAOPTIONS: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth:720,
    targetHeight:720,
    sourceType: this.camera.PictureSourceType.CAMERA,
  };


  capturedImage: any = null;


  constructor(
    private navCtrl: NavController,
    private camera: Camera,
    private platform: Platform,
    private networkProvider: NetworkProvider,
    private fileSaver: FileSaverProvider,
    private toastProvider: ToastProvider,
    private alertProvider: AlertProvider,
    private backgroundProvider: BackgroundProvider,
    private loadingScreen:LoadingScreenProvider
  ) {
  }


  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      if (this.IMAGECAPTUREDMODE)
        this.setGeneralMode();
      else if (this.GENERALMODE){
        if(this.backgroundProvider.backgroundActive())
          this.backgroundProvider.moveToBackground();
        else
          this.platform.exitApp();
      }
    });
  }


  showSavedImages() {
    console.log("Inside showSavedImages");
    if(this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.fileSaver.getLocalImages().then(result => {
          if(result) {
            this.loadingScreen.showPageChangeLoadingScreen();
            this.navCtrl.push(ImageListPage,{data:result});
          }
          else
            this.alertProvider.showInformationAlert("No Saved Images");
        })
      });
    }
    else{
      let result = [
        new ImageModel("mock1","assets/mock-images/mock_image.jpg","Label1","UploadUrl1"),
        new ImageModel("mock2","assets/imgs/logo.png","Label2","UploadUrl2"),
        new ImageModel("mock3","assets/imgs/test.jpg","Label3","UploadUrl3"),
        new ImageModel("mock4","assets/imgs/numan.jpg","Label4","UploadUrl4"),
        new ImageModel("mock5","assets/imgs/shahad.jpg","Label5","UploadUrl5")];
      this.loadingScreen.showPageChangeLoadingScreen();
      this.navCtrl.push(ImageListPage,{data:result});
      console.log("Will Show Saved Images");
    }
  }



  showLabelSettings() {
    console.log("Inside showLabelSettings");
  }

  importFromSource() {
    console.log("Inside importFromSource");
  }


  captureImage() {
    console.log("Inside CaptureImage");

    if (this.platform.is('cordova')) {
      this.camera.getPicture(this.CAMERAOPTIONS).then(imagePath => {
        this.capturedImage = imagePath;
        this.storeButtonDisabled=false;
        this.uploadButtonDisabled = false;
        this.setImageCaptureMode();
      }).catch(err => {
        console.log("WEIRD ERROR HAPPENED");
        if (!(err == "No Image Selected")) {
          this.alertProvider.showInformationAlert(err);
        }
      });
    } else {
      this.storeButtonDisabled=false;
      this.uploadButtonDisabled = false;
      this.capturedImage = "assets/mock-images/mock_image.jpg";
      this.setImageCaptureMode();
    }
  }

  uploadImage(){
    this.uploadButtonDisabled = true;
    this.storeButtonDisabled = true;

    if (this.platform.is("cordova")) {
      if (this.networkProvider.isConnected()) {
        this.toastProvider.presentInofrmationToast("Will Upload to storage");
      } else {
        this.alertProvider.showInformationAlert("Cannot Upload To Storage! Saving Locally!");
        this.platform.ready().then(()=>{

          this.fileSaver.saveLocalImage(this.capturedImage,this.selectedLabel,this.allLabels.getUrl(this.selectedLabel));
        });
      }
    }else{
      this.alertProvider.showInformationAlert("Will Upload to RemoteStorage");
    }
  }


  storeImage() {
    if(this.platform.is('cordova')){
      this.platform.ready().then(()=>{
        this.storeButtonDisabled = true;
        this.uploadButtonDisabled = true;
        this.fileSaver.saveLocalImage(this.capturedImage,this.selectedLabel,this.allLabels.getUrl(this.selectedLabel));
      });
    }else{
      console.log(this.allLabels.getUrl(this.selectedLabel));
      this.alertProvider.showInformationAlert("Will Save to Localstorage");
      this.storeButtonDisabled = true;
      this.uploadButtonDisabled = true;
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



}
