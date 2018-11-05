import {Component, getPlatform, ViewChild} from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {AngularCropperjsComponent} from "angular-cropperjs";
import {Labels} from "../../app/models/Labels";


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
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  CROPPEROPTIONS: any = {
    dragMode: 'crop',
    aspectRatio: 1,
    autoCrop: true,
    movable: true,
    zoomable: true,
    scalable: true,
    autoCropArea: 0.8
  };
  groceries = [
    'Bread',
    'Milk',
    'Cheese',
    'Snacks',
    'Apples',
    'Bananas',
    'Peanut Butter',
    'Chocolate',
    'Avocada',
    'Vegemite',
    'Muffins',
    'Paper towels'
  ];
  capturedImage: any = null;
  croppedImage: any = null;

  constructor(public navCtrl: NavController, private camera: Camera, public platform: Platform,public alertCtrl: AlertController) {

  }

  showError(errorMessage){
    this.alertCtrl.create({
      title:"Weird Error Happened",
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
    if (this.platform.is('android')) {
      this.camera.getPicture(this.CAMERAOPTIONS).then(imageData => {
        this.capturedImage = 'data:image/png;base64' + imageData;
        this.setImageCaptureModeMode();
      }).catch(err=>{
        console.log("WEIRD ERROR HAPPENED");
        this.showError(err.message);
      });
    } else {
      this.camera.getPicture(this.CAMERAOPTIONS).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        console.log(imageData);
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(base64Image);
        this.capturedImage = "../../assets/mock-images/mock_image.jpg";
        console.log(this.capturedImage)
        this.setImageCaptureModeMode();
      }, (err) => {
        console.log("WEIRD ERROR HAPPENED");
        this.showError(err.message);
      });
    }
  }

  selectImage(){
    console.log("Inside selectImage");
  }
  cancelImage()
  {
    console.log("Inside cancelImage");
  }

  cropImage() {
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/png', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.setImageCroppedMode();
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

  setImageCaptureModeMode() {
    this.IMAGECAPTUREDMODE = true;
    this.IMAGECROPPEDMODE = this.GENERALMODE = this.IMAGEEDITMODE = false;
  }

  setImageEditMode() {
    this.IMAGEEDITMODE = true;
    this.IMAGECROPPEDMODE = this.IMAGECAPTUREDMODE = this.GENERALMODE = false;
  }
}
