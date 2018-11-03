import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

/*
  Generated class for the PersonalInfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const PERSONALINFO = "personal_info";

@Injectable()
export class PersonalInfoProvider {

  constructor(public storage:Storage) {
    console.log('Hello PersonalInfoProvider Provider');
  }

  isInfoAvailable(){
    return this.storage.get(PERSONALINFO);
  }

  saveUserInfo(data:any){
    return this.storage.set(PERSONALINFO,data);
  }

}
