import { Injectable } from '@angular/core';
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {ImageModel} from "../../app/models/ImageModel";

/*
  Generated class for the UploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploaderProvider {
  url = "http://ptsv2.com/t/9lnnt-1541759587/post";

  private fileTransferObject:FileTransferObject = null;
  constructor(
    private fileTransfer:FileTransfer
  ) {
    console.log('Hello UploaderProvider Provider');
    this.fileTransferObject = this.fileTransfer.create();
  }


  uploadSingleImage(image:ImageModel){
    if(this.fileTransferObject===null)
      this.fileTransferObject = this.fileTransfer.create();

    let options:FileUploadOptions = {
      fileKey: "file",
      fileName: image.imageName,
      mimeType: "multipart/form-data",
      params : {'fileName': image.imageName,'label':image.imageLabel}
    };
    return this.fileTransferObject.upload(image.imagePath,this.url,options);
  }

}
