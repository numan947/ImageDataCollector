import { Injectable } from '@angular/core';
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {ImageModel} from "../../app/models/ImageModel";
import {BackgroundProvider} from "../background/background";
import {HttpClient} from "@angular/common/http";
import {Platform} from "ionic-angular";
import {FileSaverProvider} from "../file-saver/file-saver";
import {P} from "@angular/core/src/render3";
import {PersonalInfoProvider} from "../personal-info/personal-info";
import {UserProfile} from "../../app/models/UserProfile";
import {NetworkProvider} from "../network/network";
import {ToastProvider} from "../toast/toast";

/*
  Generated class for the UploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploaderProvider {

  private imageList:Array<ImageModel>;

  public batchUploadService:boolean =false;
  private uploadActive:boolean = false;

  private masterEndPoint:string = "";
  private fileTransferObject:FileTransferObject = null;

  constructor(
    private fileTransfer:FileTransfer,
    private platform:Platform,
    private background:BackgroundProvider,
    private filesaver:FileSaverProvider,
    private personalInfo:PersonalInfoProvider,
    private networkProvider: NetworkProvider,
    private toast:ToastProvider
  ) {
    console.log('Hello UploaderProvider Provider');
    this.batchUploadService = false;
    this.imageList = null;
    this.fileTransferObject = null;
    this.uploadActive = false;
  }

  setImageList(imageList:Array<ImageModel>){
    this.imageList =imageList;
  }

  getUploadStatus():boolean{
    return this.uploadActive;
  }
  setUploadStatus(status:boolean = false){
    this.uploadActive = status;
  }

  abortAllUpload(){
    if(this.uploadActive) {
      this.fileTransferObject.abort();
      console.log("ABORTED!");
    }
  }


  uploadAll(){
    if (!this.networkProvider.isConnected()){
      this.batchUploadService = false;
      this.toast.presentInofrmationToast("No Internet");
      return;
    }

    this.uploadActive = true;
    this.batchUploadService = true;

    this.filesaver.getMasterEndPoint().then((result)=>{
      this.masterEndPoint = result;
      this.nextOne();
    }).catch(()=>{
      console.log("error while fetching master endpoint");
    });
  }

  public uploadSingleImageNow(image:ImageModel,masterEndPoint:string=null,classificationTask:boolean = false){
    // console.log("INSIDE UPLOAD SINGLE");

    if(!classificationTask)
      this.uploadActive = true;

    let profile:UserProfile = this.personalInfo.personalInfo;
    if(profile===null)
      profile = new UserProfile("Anonymous","","","");
    let options:FileUploadOptions = {
      fileKey: "file",
      fileName: image.imageName,
      chunkedMode:false,
      mimeType: "multipart/form-data",
      params : {
        'fileName': image.imageName,
        'label':image.imageLabel,
        "username":profile.userName,
        "useremail":profile.email,
        "userphone":profile.phone,
        "userorganization":profile.organization
      },
      headers:{"appkey":"E78E2433C18FFA9E5CF85DF1DE1EC"},
    };
    let uploadPath:string = masterEndPoint;
    if(!uploadPath)
      uploadPath = image.uploadUrl;
    // console.log("Uploading to...", image.uploadUrl);
    return this.platform.ready()
      .then(()=>{
      const fileTransferObject = this.fileTransfer.create();

      this.fileTransferObject = fileTransferObject;

      return fileTransferObject.upload(image.imagePath,uploadPath,options);
    });
  }


  private uploadSingleImage(image:ImageModel){
    // console.log("INSIDE UPLOAD SINGLE");
    let profile:UserProfile = this.personalInfo.personalInfo;
    if(profile===null)
      profile = new UserProfile("Anonymous","","","");
    let options:FileUploadOptions = {
      fileKey: "file",
      fileName: image.imageName,
      mimeType: "multipart/form-data",
      chunkedMode:false,
      params : {
        'fileName': image.imageName,
        'label':image.imageLabel,
        "username":profile.userName,
        "useremail":profile.email,
        "userphone":profile.phone,
        "userorganization":profile.organization
      },
      headers:{"appkey":"E78E2433C18FFA9E5CF85DF1DE1EC"}
    };

    let uploadPath:string = this.masterEndPoint;
    if(!uploadPath)
      uploadPath = image.uploadUrl;
    // console.log("Uploading to...", image.uploadUrl);
    this.platform.ready().then(()=>{
      const fileTransferObject = this.fileTransfer.create();

      this.fileTransferObject = fileTransferObject;

      fileTransferObject.upload(image.imagePath,uploadPath,options).then((data)=>{
        this.filesaver.deleteLocalImage(image).then(()=>{
          if(this.imageList){
            if(this.imageList.length){
              let idx = this.imageList.findIndex(elem=> elem.imageName===image.imageName);
              this.imageList.splice(idx,1);
            }
          }

          if(this.imageList)
            if(!this.imageList.length)
              this.imageList = null;
          this.nextOne();
        }).catch(()=>{
          console.log(" batch: error while deleting local image in uploader");
        });
      }).catch((err)=>{
        this.handleUploadError();
      });
    });
  }

  private nextOne(){
    if(!this.batchUploadService)
      return;
    this.filesaver.getNextImageFile().then(result=>{
      console.log(result);
      if(!result){
        if(!this.platform.is('cordova')){
          setTimeout(()=>{
            this.batchUploadService = false;
          },2000);
        }
        else{
          this.batchUploadService = false;
          this.uploadActive = false;
        }
      }
      else {
        this.uploadSingleImage(result);
      }
    }).catch(err=>{
      console.log("THis error shouldn't exist")
    });
  }

  private handleUploadError() {
    this.batchUploadService = false;
    this.uploadActive = false;
    console.log("error while uploading local batch image");
    this.toast.presentInofrmationToast("Error While Uploading!");
  }
}
