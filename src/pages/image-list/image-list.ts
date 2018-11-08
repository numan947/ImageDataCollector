import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";

/**
 * Generated class for the ImageListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-list',
  templateUrl: 'image-list.html',
})
export class ImageListPage {
  private imageList:any= null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fileSaver:FileSaverProvider,
    private platform:Platform,
    private loadingProvider:LoadingScreenProvider
  ) {
    this.imageList = this.navParams.get('data');
    console.log(this.imageList)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageListPage');
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }

  deleteItem(item){
    let idx = this.imageList.indexOf(item);
    this.imageList.splice(idx,1);
    console.log(idx);

    if(this.platform.is('cordova')) {
      this.loadingProvider.showGeneralLoadingScreen();
      this.platform.ready().then(() => {
        this.fileSaver.deleteImage(idx).then(()=>{
          this.loadingProvider.dismissGeneralLoadingScreen();
          if(!Boolean(Object.keys(this.imageList)[0])){
            this.navCtrl.pop();
          }
        });
      });
    }
  }

}
