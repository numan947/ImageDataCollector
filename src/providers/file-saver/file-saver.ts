import {Injectable} from '@angular/core';
import {File} from "@ionic-native/file";
import {Platform} from "ionic-angular";
import {ToastProvider} from "../toast/toast";
import {BackgroundProvider} from "../background/background";
import {Storage} from "@ionic/storage";

/*
  Generated class for the FileSaverProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const GENERIC_SAVE_FILE_NAME = "SIMPLE_IMAGE_COLLECTOR_APP_";
const SAVED_FILES = "SAVED_FILES_FOR_UPLOADING_LATER";

declare var cordova:any;
@Injectable()
export class FileSaverProvider {

  constructor(private file: File,
              private toastProvider:ToastProvider,
              private platform: Platform,
              private backgroundProvider:BackgroundProvider,
              private storage:Storage) {
    console.log('Hello FileSaverProvider Provider');
  }




  public saveLocalImage(imagePath){
    this.backgroundProvider.activateBackgroundMode();
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    this.copyFileToLocalDir(correctPath,currentName,this.createFileName());
    this.backgroundProvider.deactivateBackgroundMode();
  }

  public getLocalImages(){
    return this.storage.get(SAVED_FILES);
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

  private createFileName() {
    var d = new Date(),n = d.getTime(),newFileName =  n + ".png";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      let savedFilePath = this.pathForImage(newFileName);
      this.storage.get(SAVED_FILES).then(result=>{
        if(result){
          result.push(savedFilePath);
          this.storage.set(SAVED_FILES,savedFilePath);
        }
        else
          this.storage.set(SAVED_FILES,[savedFilePath]);
      });
      this.toastProvider.presentInofrmationToast("Saved to: "+savedFilePath);
    }, error => {
      this.toastProvider.presentInofrmationToast("Problem While Saving file "+error);
    });
  }



}
