import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BackgroundMode} from "@ionic-native/background-mode";

/*
  Generated class for the BackgroundProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackgroundProvider {

  constructor(private backgroundCtrl:BackgroundMode) {
    console.log('Hello BackgroundProvider Provider');
  }

  backgroundActive():boolean{
    return this.backgroundCtrl.isEnabled();
  }

  activateBackgroundMode(){
    this.backgroundCtrl.enable();
  }
  deactivateBackgroundMode(){
    this.backgroundCtrl.disable();
  }

  overrideBackButton(){
    this.backgroundCtrl.overrideBackButton();
  }
  moveToBackground(){
    this.backgroundCtrl.moveToBackground();
  }

}
