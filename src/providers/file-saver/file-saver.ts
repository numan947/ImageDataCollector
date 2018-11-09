import {Injectable} from '@angular/core';
import {File} from "@ionic-native/file";
import {Platform} from "ionic-angular";
import {ToastProvider} from "../toast/toast";
import {BackgroundProvider} from "../background/background";
import {Storage} from "@ionic/storage";
import {ImageModel} from "../../app/models/ImageModel";
import {LabelModel} from "../../app/models/LabelModel";

/*
  Generated class for the FileSaverProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const GENERIC_SAVE_FILE_NAME = "SIMPLE_IMAGE_COLLECTOR_APP_";
const SAVED_FILES = "SAVED_FILES_FOR_UPLOADING_LATER";
const SAVED_LABELS = "SAVED_LABELS_FOR_UPLOADING_IMAGES";

declare var cordova:any;
@Injectable()
export class FileSaverProvider {
  public labelsChanged:boolean = false;

  constructor(private file: File,
              private toastProvider:ToastProvider,
              private platform: Platform,
              private backgroundProvider:BackgroundProvider,
              private storage:Storage) {
    console.log('Hello FileSaverProvider Provider');
  }




  public saveLocalImage(imagePath,label,uploadUrl){
    this.backgroundProvider.activateBackgroundMode();
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    this.copyFileToLocalDir(correctPath,currentName,this.createFileName(),label,uploadUrl);
    this.backgroundProvider.deactivateBackgroundMode();
  }

  public getLocalImages(){
    return this.storage.get(SAVED_FILES);
  }

  public deleteLocalImage(image: ImageModel){
    return this.storage.get(SAVED_FILES).then(results=>{
      if(results){
        let idx = results.indexOf(image);
        results.splice(idx,1);
        if(results.length>0)
          return this.storage.set(SAVED_FILES,results);
        else
          return this.storage.remove(SAVED_FILES);
      }
    });
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
    var d = new Date(),n = d.getTime(),newFileName =  GENERIC_SAVE_FILE_NAME+n + ".png";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName,label,uploadUrl) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      let savedFilePath = this.pathForImage(newFileName);
      let newImage:ImageModel = new ImageModel(newFileName,savedFilePath,label,uploadUrl);
      this.storage.get(SAVED_FILES).then(result=>{
        if(result){
          result.push(newImage);
          this.storage.set(SAVED_FILES,result);
        }
        else
          this.storage.set(SAVED_FILES,[newImage]);
      });
      this.toastProvider.presentInofrmationToast("Saved to: "+savedFilePath);
    }, error => {
      this.toastProvider.presentInofrmationToast("Problem While Saving file "+error);
    });
  }







  public getLabels(){
    return this.storage.get(SAVED_LABELS);
  }
  public addLabel(label:LabelModel){
    this.labelsChanged = true;
    return this.storage.get(SAVED_LABELS).then(result=>{

      if(result){
        result.push(label);
        return this.storage.set(SAVED_LABELS,result);
      }
      else
        return this.storage.set(SAVED_LABELS,[label]);
    });
  }
  public deleteLabel(label:LabelModel){
    this.labelsChanged = true;
    return this.storage.get(SAVED_LABELS).then(results=>{
      if(results){
        let idx = results.indexOf(label);
        results.splice(idx,1);
        if(results.length>0)
          return this.storage.set(SAVED_LABELS,results);
        else
          return this.storage.remove(SAVED_LABELS);
      }
    });
  }
  public editLabel(prevLabel:LabelModel,newLabel:LabelModel){
    this.labelsChanged = true;
    return this.storage.get(SAVED_LABELS).then(results=>{
      if(results){
        let idx = results.indexOf(prevLabel);
        results[idx].labelName = newLabel.labelName;
        results[idx].labelUrl = newLabel.labelUrl;
        return this.storage.set(SAVED_LABELS,results);
      }
    });
  }



}
