import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {LabelModel} from "../../app/models/LabelModel";
import {AlertProvider} from "../../providers/alert/alert";

/**
 * Generated class for the LabelSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-label-settings',
  templateUrl: 'label-settings.html',
})
export class LabelSettingsPage {


  allLabels:Array<LabelModel> = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingScreen: LoadingScreenProvider,
    private fileSaver: FileSaverProvider,
    private platform:Platform,
    private alertProvider:AlertProvider

  ) {


  }

  loadLabels(){
    this.platform.ready().then(()=>{
      this.loadingScreen.showGeneralLoadingScreen();
      this.fileSaver.getLabels().then(result => {
        if(!result){
          this.allLabels = null;
        }
        else{
            this.allLabels = result;
        }
        this.loadingScreen.dismissGeneralLoadingScreen();
    });
  });
}
  ionViewWillEnter() {
    this.loadLabels();
  }

  ionViewDidLoad(){
      console.log('ionViewDidLoad LabelSettingsPage');
  }

  addNewLabel(){
    console.log("TODO: ADD NEW LABEL");
    let newLabel:LabelModel = null;
    let newLabelAlert:any = {
      title:"Add New Label",
      message:"You Must Provide LabelName and a Url",
      inputs:[
        {
          name:"labelName",
          placeholder:"Label Name"
        },
        {
          name:"labelUrl",
          placeholder:"Label Url",
          type:"url"
        }
      ],
      buttons:[
        {
          text:"Cancel",
          handler:data=>{
          }
        },
        {
          text:"Add",
          handler:data=>{
            newLabel = new LabelModel(data.labelName,data.labelUrl);
            console.log(newLabel);
            this.loadingScreen.showGeneralLoadingScreen();
            this.platform.ready().then(()=>{
              this.fileSaver.addLabel(newLabel).then(()=>{
                if(this.allLabels==null)
                  this.allLabels=[];
                this.allLabels.push(newLabel);
                this.loadingScreen.dismissGeneralLoadingScreen();
              });
            });
          }
        }
      ]
    };
    this.alertProvider.showTextBoxAlert(newLabelAlert);
  }

  editLabel(oldLabel:LabelModel){
    console.log("TODO: Edit Label");
    let newLabel:LabelModel = null;
    let editLabelAlert:any= {
      title:"Edit Label",
      message:"You Must Provide LabelName and a Url",
      inputs:[
        {
          name:"labelName",
          placeholder:"Label Name",
          value:oldLabel.labelName
        },
        {
          name:"labelUrl",
          placeholder:"Label Url",
          value:oldLabel.labelUrl,
          type:"url"
        }
      ],
      buttons:[
        {
          text:"Cancel",
          handler:data=>{
          }
        },
        {
          text:"Save",
          handler:data=>{
            newLabel = new LabelModel(data.labelName,data.labelUrl);
            console.log(newLabel);
            this.loadingScreen.showGeneralLoadingScreen();
            this.platform.ready().then(()=>{
              this.fileSaver.editLabel(oldLabel,newLabel).then(()=>{
                oldLabel.labelUrl = newLabel.labelUrl;
                oldLabel.labelName = newLabel.labelName;
                this.loadingScreen.dismissGeneralLoadingScreen();
              });
            });
          }
        }
      ]
    };
    this.alertProvider.showTextBoxAlert(editLabelAlert);
  }

  deleteLabel(oldLabel:LabelModel){
    console.log("TODO: Delete Label");
    let deleteLabelAlert:any= {
      title:"Delete Label",
      message:"Are You Sure?",
      buttons:[
        {
          text:"Cancel",
          handler:data=>{
          }
        },
        {
          text:"Delete",
          handler:data=>{
            this.loadingScreen.showGeneralLoadingScreen();
            this.platform.ready().then(()=>{
              this.fileSaver.deleteLabel(oldLabel).then(()=>{
                let idx = this.allLabels.indexOf(oldLabel);
                this.allLabels.splice(idx,1);
                if(this.allLabels.length == 0)
                  this.allLabels=null;
                this.loadingScreen.dismissGeneralLoadingScreen();
              });
            });
          }
        }
      ]
    };

    this.alertProvider.showTextBoxAlert(deleteLabelAlert);
  }


}

