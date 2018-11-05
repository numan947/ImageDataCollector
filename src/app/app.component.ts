import { Component } from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {Network} from "@ionic-native/network";
import {NetworkProvider} from "../providers/network/network";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  public netWorkStatus:boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events:Events,public network:Network) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Offline event


    if(platform.is('cordova')) {
      statusBar.backgroundColorByHexString('#fff');
    }


  });
  }
}
