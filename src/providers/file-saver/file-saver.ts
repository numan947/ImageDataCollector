import {Injectable} from '@angular/core';
import {File} from "@ionic-native/file";
import {ToastController} from "ionic-angular";

/*
  Generated class for the FileSaverProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const GENERIC_SAVE_FILE_NAME = "SIMPLE_IMAGE_COLLECTOR_APP_";
const SAVED_FILES = "SAVED_FILES_FOR_UPLOADING_LATER";

@Injectable()
export class FileSaverProvider {
  toast:any=null;
  constructor(public file: File, public toastCtrl:ToastController) {
    console.log('Hello FileSaverProvider Provider');
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
      console.log("img cordova ",img);
      return cordova.file.dataDirectory + img;
    }
  }
}
