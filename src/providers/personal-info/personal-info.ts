import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {UserProfile} from "../../app/models/UserProfile";


const PERSONALINFO = "personal_information";


@Injectable()
export class PersonalInfoProvider {
  public personalInfo:UserProfile = null;
  constructor(private storage:Storage) {
    console.log('Hello PersonalInfoProvider Provider');
    this.storage.get(PERSONALINFO).then((result)=>{
      this.personalInfo = JSON.parse(result);
    }).catch(()=>{
      console.log("This Should Also Not Happen...");
    });
  }

  getUserInfo(){
    return this.storage.get(PERSONALINFO);
  }

  saveUserInfo(data:UserProfile){
    return this.storage.set(PERSONALINFO,JSON.stringify(data));
  }

}
