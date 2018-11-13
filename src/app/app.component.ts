import { Component } from '@angular/core';
import {App, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {BackgroundProvider} from "../providers/background/background";
import {Network} from "@ionic-native/network";
import {UploaderProvider} from "../providers/uploader/uploader";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  lastBack = 0;
  allowClose=false;
  constructor( public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public app:App,
               public backgorundProvider:BackgroundProvider,
              public toastCtrl:ToastController,
               private network:Network,
               private uploader:UploaderProvider
              ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Offline event
      this.network.onDisconnect().subscribe(()=>{
        console.log("Internet Disconnected! Aborting All Uploads!");
        this.uploader.abortAllUpload();
      });

      if(platform.is('cordova')) {
      statusBar.backgroundColorByHexString('#ffffff');


        platform.registerBackButtonAction(() => {
          const overlay = app._appRoot._overlayPortal.getActive();
          const nav = app.getActiveNav();
          const closeDelay = 2000;
          const spamDelay = 500;

          if(overlay && overlay.dismiss) {
            overlay.dismiss();
          } else if(nav.canGoBack()){
            nav.pop();
          } else if(Date.now() - this.lastBack > spamDelay && !this.allowClose) {
            this.allowClose = true;
            let toast = toastCtrl.create({
              message: "Press Back Again To Close",
              duration: closeDelay,
              dismissOnPageChange: true
            });
            toast.onDidDismiss(() => {
              this.allowClose = false;
            });
            toast.present();
          } else if(Date.now() - this.lastBack < closeDelay && this.allowClose) {

            if(this.backgorundProvider.backgroundActive()){
              this.backgorundProvider.moveToBackground();
            }
            else
              platform.exitApp();
          }
          this.lastBack = Date.now();
        });

      }
    });
  }


}
