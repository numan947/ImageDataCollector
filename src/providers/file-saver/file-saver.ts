import {HttpClient} from '@angular/common/http';
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
  presentToast(message) {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    this.toast.present();
  }

  writeFile(base64Data: any, folderName: string, fileName: any = GENERIC_SAVE_FILE_NAME + (new Date().toDateString())) {

    this.file.createDir(this.file.externalRootDirectory, folderName, false).then(() => {

      let contentType = this.getContentType(base64Data);
      let DataBlob = this.base64toBlob(base64Data, contentType);
      let filePath = this.file.externalRootDirectory + folderName;

      this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
        this.presentToast("Saved to: "+filePath+fileName);
      }).catch((err) => {
        console.log("Error Occured While Writing File", err);
        this.presentToast("Error saving file.");
      });
    });
  }


  public getContentType(base64Data: any) {
    let block = base64Data.split(";");
    let contentType = block[0].split(":")[1];
    return contentType;
  }

  //here is the method is used to convert base64 data to blob data
  public base64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }
}
