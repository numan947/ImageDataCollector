import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {UserProfile} from "../../app/models/UserProfile";


const PERSONALINFO = "personal_information";


@Injectable()
export class PersonalInfoProvider {

  constructor(private storage:Storage) {
    console.log('Hello PersonalInfoProvider Provider');
  }

  getUserInfo(){
    return this.storage.get(PERSONALINFO);
  }

  saveUserInfo(data:UserProfile){
    return this.storage.set(PERSONALINFO,JSON.stringify(data));
  }

}
