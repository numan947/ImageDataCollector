import {Component, getPlatform, ViewChild} from '@angular/core';
import {AlertController, Events, NavController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {AngularCropperjsComponent} from "angular-cropperjs";
import {Labels} from "../../app/models/Labels";
import {NetworkProvider} from "../../providers/network/network";
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
//Input Field States
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page disabled.
 * */
const DISABLE_INPUT_FIELD = "page-contact disabled";
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page enabled.
 * */
const ENABLE_INPUT_FIELD = "page-contact enabled";


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
  IMAGECAPTUREDMODE: boolean = false;
  IMAGEEDITMODE: boolean = false;
  IMAGECROPPEDMODE: boolean = false;

  @ViewChild('angular_cropper') public angularCropper: AngularCropperjsComponent;

  scaleValX = 1;
  scaleValY = 1;

  CAMERAOPTIONS: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  CROPPEROPTIONS: any = {
    dragMode: 'none',
    aspectRatio: 1,
    autoCrop: true,
    movable: true,
    zoomable: true,
    scalable: true,
    autoCropArea: 0.8,
    zoomOnTouch:false,
    zoomOnWheel:false,
    cropBoxMovable:false,
    toggleDragModeOnDblclick:false
  };

  capturedImage: any = null;
  croppedImage: any = null;

  cloudSyncState:string = "custom-cloud-check";
  TESTVARIABLE:string = null;

  constructor(public events:Events,
              public navCtrl: NavController,
              private camera: Camera,
              public platform: Platform,
              public alertCtrl: AlertController,
              public networkProvider:NetworkProvider,
              public fileSaver:FileSaverProvider)
  {
  }

  discardAllChanges(){
    this.setGeneralMode();
    this.capturedImage=null;
    this.croppedImage=null;
  }

  showError(errorMessage){
    this.alertCtrl.create({
      title:"Information!",
      subTitle:errorMessage,
      buttons:["Ok"]
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
      this.camera.getPicture(this.CAMERAOPTIONS).then(imageData => {
        this.capturedImage = 'data:image/jpeg;base64,' + imageData;
        this.TESTVARIABLE = imageData.substr(imageData.lastIndexOf('/') + 1);
        //this.showError(this.capturedImage);
        this.setImageCaptureMode();
      }).catch(err=>{
        console.log("WEIRD ERROR HAPPENED");
        if(!(err=="No Image Selected"))
          this.showError(err);
      });
    } else {
      this.capturedImage = "assets/mock-images/mock_image.jpg";
      this.setImageCaptureMode();
    }
  }

  selectImage(){
    console.log("Inside selectImage");
    this.setImageEditMode();
  }
  cancelImage()
  {
    console.log("Inside cancelImage");
    this.setGeneralMode();
  }
  cropImage() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (70 / 100));
    this.croppedImage = croppedImgB64String;
    this.setImageCroppedMode();
  }

  cancelCrop(){
    this.setImageCaptureMode();
  }

  saveAndUpload(){
    console.log("Inside saveAndUpload ", this.selectedLabel);
    if(this.platform.is("cordova")) {
      if (this.networkProvider.isConnected()) {
        this.showError("WILL UPLOAD TO STORAGE: ");
      } else {
        this.showError("Network not available, saving to local storage");
        this.fileSaver.writeFile(this.croppedImage, this.selectedLabel);

      }
    }

  }
  cancelSaveAndUpload(){
    console.log("Inside cancelSaveAndUpload");
    this.setImageEditMode();
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  clear() {
    this.angularCropper.cropper.clear();
  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  move(x, y) {
    console.log(x, y);
    this.angularCropper.cropper.move(x, y);
  }


  setGeneralMode() {
    this.GENERALMODE = true;
    this.IMAGECROPPEDMODE = this.IMAGECAPTUREDMODE = this.IMAGEEDITMODE = false;
  }

  setImageCroppedMode() {
    this.IMAGECROPPEDMODE = true;
    this.GENERALMODE = this.IMAGECAPTUREDMODE = this.IMAGEEDITMODE = false;
  }

  setImageCaptureMode() {
    this.IMAGECAPTUREDMODE = true;
    this.IMAGECROPPEDMODE = this.GENERALMODE = this.IMAGEEDITMODE = false;
  }

  setImageEditMode() {
    this.IMAGEEDITMODE = true;
    this.IMAGECROPPEDMODE = this.IMAGECAPTUREDMODE = this.GENERALMODE = false;
  }
}
