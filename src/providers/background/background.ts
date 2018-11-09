import { Injectable } from '@angular/core';
import {BackgroundMode} from "@ionic-native/background-mode";
import {Platform} from "ionic-angular";

/*
  Generated class for the BackgroundProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackgroundProvider {
  public processInBGD:number = 0;

  constructor(
    private backgroundCtrl:BackgroundMode,
    private platform:Platform
    ) {
    console.log('Hello BackgroundProvider Provider');
    this.processInBGD = 0;
  }

  backgroundActive():boolean{
    return this.backgroundCtrl.isEnabled();
  }

  activateBackgroundMode(){
    if(!(this.processInBGD))
      if(this.platform.is('cordova'))
      this.backgroundCtrl.enable();
    this.processInBGD+=1;
  }
  deactivateBackgroundMode(){
    this.processInBGD-=1;
    if(!(this.processInBGD))
      if(this.platform.is('cordova'))
      this.backgroundCtrl.disable();
  }

  overrideBackButton(){
    this.backgroundCtrl.overrideBackButton();
  }
  moveToBackground(){
    this.backgroundCtrl.moveToBackground();
  }

}
