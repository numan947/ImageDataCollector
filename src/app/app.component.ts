import { Component } from '@angular/core';
import {App, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {BackgroundProvider} from "../providers/background/background";
import {ToastProvider} from "../providers/toast/toast";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  public netWorkStatus:boolean = false;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              app:App,
              toastProvider:ToastProvider,
              backgorundProvider:BackgroundProvider
              ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Offline event

      if(platform.is('cordova')) {
      statusBar.backgroundColorByHexString('#ffffff');

      let lastBack = 0;
      let allowClose=false;
        platform.registerBackButtonAction(() => {
          const overlay = app._appRoot._overlayPortal.getActive();
          const nav = app.getActiveNav();
          const closeDelay = 2000;
          const spamDelay = 500;

          if(overlay && overlay.dismiss) {
            overlay.dismiss();
          } else if(nav.canGoBack()){
            nav.pop();
          } else if(Date.now() - lastBack > spamDelay && !allowClose) {
            allowClose = true;
            let toast = toastCtrl.create({
              message: "Double Tap To Close",
              duration: closeDelay,
              dismissOnPageChange: true
            });
            toast.onDidDismiss(() => {
              allowClose = false;
            });
            toast.present();
          } else if(Date.now() - lastBack < closeDelay && allowClose) {
            if(backgorundProvider.backgroundActive()){

            }
            platform.exitApp();
          }
          lastBack = Date.now();
        });


      }



  });
  }
}
