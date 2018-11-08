import { Injectable } from '@angular/core';
import {Alert, AlertController} from "ionic-angular";

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {
  private alert:Alert = null;
  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertProvider Provider');
  }
  public showInformationAlert(info){
    this.alert = this.alertCtrl.create({
      title: "Information!",
      subTitle: info,
      buttons: [{
        text:"OK",
        role:"ok"
      }]
    });
    this.alert.present();
  }

}
