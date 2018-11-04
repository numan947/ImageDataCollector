import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {UserProfile} from "../../app/models/UserProfile";

/*
  Generated class for the PersonalInfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const PERSONALINFO = "personal_information";

@Injectable()
export class PersonalInfoProvider {

  constructor(public storage:Storage) {
    console.log('Hello PersonalInfoProvider Provider');
  }

  getUserInfo(){
    return this.storage.get(PERSONALINFO);
  }

  saveUserInfo(data:UserProfile){
    return this.storage.set(PERSONALINFO,JSON.stringify(data));
  }

}
