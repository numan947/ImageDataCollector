import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {ImageModel} from "../../app/models/ImageModel";
import {AlertProvider} from "../../providers/alert/alert";

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
  private imageList:Array<ImageModel>= null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fileSaver:FileSaverProvider,
    private platform:Platform,
    private loadingProvider:LoadingScreenProvider,
    private alertProvider:AlertProvider
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
  deleteItem(item:ImageModel){
      this.loadingProvider.showGeneralLoadingScreen();
      this.platform.ready().then(() => {
        this.fileSaver.deleteLocalImage(item).then(()=>{
          let idx = this.imageList.indexOf(item);
          this.imageList.splice(idx,1);
          console.log(idx);
          this.loadingProvider.dismissGeneralLoadingScreen();
          if(!Boolean(Object.keys(this.imageList)[0])){
            this.navCtrl.pop();
          }
        });
      });
  }

}
