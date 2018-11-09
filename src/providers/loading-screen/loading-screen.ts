import { Injectable } from '@angular/core';
import {Loading, LoadingController, LoadingOptions} from "ionic-angular";

/*
  Generated class for the LoadingScreenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingScreenProvider {
  private pageChangeLoading:Loading = null;
  private generalLoading:Loading = null;

  constructor(private loadingCtrl:LoadingController) {
    console.log('Hello LoadingScreenProvider Provider');
  }

  showPageChangeLoadingScreen(){
    this.pageChangeLoading = this.loadingCtrl.create({
      content:'please wait...',
      dismissOnPageChange:true
    });
    this.pageChangeLoading.present();
  }

  showGeneralLoadingScreen(extr = ""){
    this.generalLoading = this.loadingCtrl.create({
      content:'please wait...'+extr
    });
    this.generalLoading.present();
  }
  dismissLoading(){
    if(this.generalLoading) {
      this.generalLoading.dismiss();
      this.generalLoading = null;
    }
  }

  showGeneralUplaodingScreen(extr=""){
    let uploadingScreenOpt:LoadingOptions = {
      spinner:"dots",
      content:"uploading...."+extr
    };
    this.generalLoading = this.loadingCtrl.create(uploadingScreenOpt);
    this.generalLoading.present();
  }


}
