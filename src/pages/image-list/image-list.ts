import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {ImageModel} from "../../app/models/ImageModel";
import {AlertProvider} from "../../providers/alert/alert";
import {UploaderProvider} from "../../providers/uploader/uploader";

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
    private alertProvider:AlertProvider,
    public uploader:UploaderProvider
  ) {
    this.imageList = this.navParams.get('data');
    console.log(this.imageList)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageListPage');
  }

  deleteItem(item:ImageModel){
      this.loadingProvider.showGeneralLoadingScreen();
      this.platform.ready().then(() => {
        this.fileSaver.deleteLocalImage(item).then(()=>{
          let idx = this.imageList.indexOf(item);
          this.imageList.splice(idx,1);
          console.log(idx);
          if(this.imageList.length==0)
            this.imageList = null;
          this.loadingProvider.dismissLoading();
        });
      });
  }

  uploadAll(){
    this.uploader.batchUploaderReady = false;
    this.uploader.uploadAll(this.imageList);
  }

  doRefresh(refresher){
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.fileSaver.getLocalImages().then(result => {
            this.imageList = result;
          refresher.complete();
        }).catch(()=>{
          console.log("ERROR WHILE REFRESHING....");
          refresher.complete();
        })
      });
    }
  }


}
