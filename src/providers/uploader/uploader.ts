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

/*
  Generated class for the UploaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploaderProvider {

  private imageList:Array<ImageModel>;

  public batchUploadService:boolean =false;
  public currentlyBeingUploaded:string = "";
  private masterEndPoint:string = "";

  constructor(
    private fileTransfer:FileTransfer,
    private platform:Platform,
    private background:BackgroundProvider,
    private filesaver:FileSaverProvider,
    private personalInfo:PersonalInfoProvider
  ) {
    console.log('Hello UploaderProvider Provider');
    this.batchUploadService = false;
    this.imageList = null;
  }

  setImageList(imageList:Array<ImageModel>){
    this.imageList =imageList;
  }


  uploadAll(){
    this.filesaver.getMasterEndPoint().then((result)=>{
      this.masterEndPoint = result;
      this.nextOne();
    }).catch(()=>{
      console.log("error while fetching master endpoint");
    });
  }

  public uploadSingleImageNow(image:ImageModel,masterEndPoint:string=null){
    // console.log("INSIDE UPLOAD SINGLE");
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
      headers:{}
    };
    let uploadPath:string = masterEndPoint;
    if(!uploadPath)
      uploadPath = image.uploadUrl;
    // console.log("Uploading to...", image.uploadUrl);
    return this.platform.ready()
      .then(()=>{
      const fileTransferObject = this.fileTransfer.create();
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
      headers:{}
    };

    let uploadPath:string = this.masterEndPoint;
    if(!uploadPath)
      uploadPath = image.uploadUrl;
    // console.log("Uploading to...", image.uploadUrl);
    this.platform.ready().then(()=>{
      const fileTransferObject = this.fileTransfer.create();
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
          this.currentlyBeingUploaded = "";
          console.log(" batch: error while deleting local image in uploader");
        });
      }).catch((err)=>{
        this.currentlyBeingUploaded = "";
        console.log("error while uploading local batch image");
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
        else this.batchUploadService = false;
      }
      else {
        this.currentlyBeingUploaded = result.imageName;
        this.uploadSingleImage(result);
      }
    }).catch(err=>{
      console.log("THis error shouldn't exist")
    });
  }

}
