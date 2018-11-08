import { Injectable } from '@angular/core';
import {Toast, ToastController} from "ionic-angular";

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {
  private toast:Toast = null;
  constructor(private toastCtrl:ToastController) {
    console.log('Hello ToastProvider Provider');
  }
  public presentInofrmationToast(text) {
    if(this.toast)
      this.toast.dismissAll();
    this.toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    this.toast.present();
  }

}
