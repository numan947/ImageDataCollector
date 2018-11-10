import { Injectable } from '@angular/core';
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {ImageModel} from "../../app/models/ImageModel";
import {BackgroundProvider} from "../background/background";
import {HttpClient} from "@angular/common/http";
import {Platform} from "ionic-angular";
import {FileSaverProvider} from "../file-saver/file-saver";

/*
  Generated class for the UploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploaderProvider {

  private allImages = null;
  public batchUploaderReady = false;
  constructor(
    private fileTransfer:FileTransfer,
    private platform:Platform,
    private background:BackgroundProvider,
    private filesaver:FileSaverProvider
  ) {
    console.log('Hello UploaderProvider Provider');
    this.batchUploaderReady = true;
  }


  uploadAll(images:Array<ImageModel>){
    this.background.activateBackgroundMode();
    this.allImages= images;
    console.log(this.allImages);
    this.nextOne();
    this.background.deactivateBackgroundMode();
    this.batchUploaderReady = true;
  }
  public uploadSingleImageNow(image:ImageModel){
    // console.log("INSIDE UPLOAD SINGLE");
    let options:FileUploadOptions = {
      fileKey: "file",
      fileName: image.imageName,
      mimeType: "multipart/form-data",
      params : {'fileName': image.imageName,'label':image.imageLabel}
    };
    // console.log("Uploading to...", image.uploadUrl);
    return this.platform.ready().then(()=>{
      const fileTransferObject = this.fileTransfer.create();
      return fileTransferObject.upload(image.imagePath,image.uploadUrl,options);
    });
  }


  private uploadSingleImage(image:ImageModel){
    // console.log("INSIDE UPLOAD SINGLE");

    let options:FileUploadOptions = {
      fileKey: "file",
      fileName: image.imageName,
      mimeType: "multipart/form-data",
      params : {'fileName': image.imageName,'label':image.imageLabel}
    };
    // console.log("Uploading to...", image.uploadUrl);
    this.platform.ready().then(()=>{
      const fileTransferObject = this.fileTransfer.create();
      fileTransferObject.upload(image.imagePath,image.uploadUrl,options).then((data)=>{
        this.filesaver.deleteLocalImage(image).then(()=>{
          this.nextOne();
        }).catch(()=>{
          console.log(" batch: error while deleting local image in uploader");
        });
      }).catch((err)=>{
        console.log("error while uploading local batch image");
      });
    });
  }

  private nextOne(){
    console.log("INSIDE NEXT ONE");
    if(!this.allImages)
      return;
    else if(this.allImages.length == 0) {
      this.allImages = null;
      return;
    }
    let tmpImageModel:ImageModel = this.allImages[0];
    this.allImages.splice(0,1);
    try{
      this.uploadSingleImage(tmpImageModel);
    }catch (e) {
      console.log(e);
    }

  }

}
