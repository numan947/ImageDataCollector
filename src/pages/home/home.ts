import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";






@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**
   * @ignore
   * */
  shahadProject:boolean = true;
  /**
   * @ignore
   * */
  rafidProject:boolean = false;


 CAMERAOPTIONS:CameraOptions = {
    quality:100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  CROPPEROPTIONS:any ={
    dragMode: 'crop',
    aspectRatio: 1,
    autoCrop: true,
    movable:true,
    zoomable: true,
    scalable: true,
    autoCropArea:0.8
  };

  capturedImage:any = null;
  croppedImage:any = null;

  constructor(public navCtrl: NavController, private camera:Camera) {

  }

  captureImage(){
    this.camera.getPicture(this.CAMERAOPTIONS).then(imageData=>{
      this.capturedImage = 'data:image/png;base64'+imageData;
    });
  }


}
