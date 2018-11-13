import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {LabelModel} from "../../app/models/LabelModel";
import {AlertProvider} from "../../providers/alert/alert";
import {UploaderProvider} from "../../providers/uploader/uploader";
import {ToastProvider} from "../../providers/toast/toast";

/**
 * Generated class for the LabelSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


/**
 * This variable stores Submit state the Button can be in Personal Info Page.
 * */
const BUTTON_SUBMIT:string = "Save";
/**
 * This variable stores Edit state the Button can be in Personal Info Page.
 * */
const BUTTON_EDIT:string = "Edit";
//Input Field States
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page disabled.
 * */
const DISABLE_INPUT_FIELD:string = "page-label-settings  disabled";
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page enabled.
 * */
const ENABLE_INPUT_FIELD:string = "page-label-settings  enabled";



@IonicPage()
@Component({
  selector: 'page-label-settings',
  templateUrl: 'label-settings.html',
})
export class LabelSettingsPage {


  allLabels:Array<LabelModel> = null;
  showEmpty:boolean = true;
  masterButtonText:string;
  masterEditLabelStyle:string;
  masterEndPoint:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingScreen: LoadingScreenProvider,
    private fileSaver: FileSaverProvider,
    private platform:Platform,
    private alertProvider:AlertProvider,
    private uploader:UploaderProvider,
    private toast:ToastProvider

  ) {
    // this.masterButtonText = BUTTON_EDIT;
    // this.masterEditLabelStyle = DISABLE_INPUT_FIELD;
    // this.masterEndPoint = "";

  }

  saveMasterEndPoint(){
    if(this.uploader.batchUploadService){
      this.disableMasterInput();
      this.alertProvider.showInformationAlert("Cannot Change When Batch Upload Is Ongoing!");
      return;
    }

    if(!this.masterEndPoint){
      this.toast.presentInofrmationToast("Cannot Save Empty Url!");
      return;
    }
    if(this.masterButtonText === BUTTON_EDIT){
      this.enableMasterInput();
      return;
    }
    this.loadingScreen.showGeneralUplaodingScreen();
    this.fileSaver.setMasterEndPoint(this.masterEndPoint).then(()=>{
      this.disableMasterInput();
      this.loadingScreen.dismissLoading();
    });
  }

  enableMasterInput()
  {
    this.masterButtonText = BUTTON_SUBMIT;
    this.masterEditLabelStyle = ENABLE_INPUT_FIELD;
  }

  disableMasterInput(){
    this.masterButtonText = BUTTON_EDIT;
    this.masterEditLabelStyle = DISABLE_INPUT_FIELD;
  }

  setupMasterEndPointView(masterEndPointVal:string){
    if(!masterEndPointVal) {
      this.masterEndPoint = "";
      this.enableMasterInput();
    }
    else{
    this.disableMasterInput();
    }
  }

  loadLabels(){
    this.allLabels = []; //placeholder
    this.platform.ready().then(()=>{
      this.loadingScreen.showGeneralLoadingScreen();

      Promise.all([this.fileSaver.getLabels(), this.fileSaver.getMasterEndPoint()]).then(values=>{
        this.allLabels = values[0];
        this.masterEndPoint = values[1];


        //setup Master End Point View
        this.setupMasterEndPointView(this.masterEndPoint);



        this.loadingScreen.dismissLoading();
      }).catch(err=>{
        this.toast.presentInofrmationToast("Error While Fetching Data!");
        this.loadingScreen.dismissLoading();
      });



    //   this.fileSaver.getLabels().then(result => {
    //     if(!result){
    //       this.allLabels = null;
    //     }
    //     else{
    //         this.allLabels = result;
    //     }
    //     this.loadingScreen.dismissLoading();
    // });
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
            if(!data.labelName){
              this.toast.presentInofrmationToast("Cannot Add Empty Label!!")
              return;
            }
            newLabel = new LabelModel(data.labelName,data.labelUrl);
            console.log(newLabel);
            this.loadingScreen.showGeneralLoadingScreen();
            this.platform.ready().then(()=>{
              this.fileSaver.addLabel(newLabel).then(()=>{
                if(this.allLabels==null)
                  this.allLabels=[];
                this.allLabels.push(newLabel);
                this.loadingScreen.dismissLoading();
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
    let newLabelName:string = oldLabel.labelName
    let newLabelUrl:string = oldLabel.labelUrl;
    let editLabelAlert:any= {
      title:"Edit Label",
      message:"You Must Provide LabelName and a Url",
      inputs:[
        {
          name:"labelName",
          placeholder:"Label Name",
          value:newLabelName
        },
        {
          name:"labelUrl",
          placeholder:"Label Url",
          value:newLabelUrl,
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
            if(!data.labelName){
              this.toast.presentInofrmationToast("Cannot Add Empty Label!!")
              return;
            }
            console.log(data)
            newLabel = new LabelModel(data.labelName,data.labelUrl);
            this.loadingScreen.showGeneralLoadingScreen();
            this.platform.ready().then(()=>{
              this.fileSaver.editLabel(oldLabel,newLabel).then(()=>{
                oldLabel.labelUrl = newLabel.labelUrl;
                oldLabel.labelName = newLabel.labelName;
                this.loadingScreen.dismissLoading();
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
                if(this.allLabels.length == 0) {
                  this.allLabels = null;
                  this.showEmpty = true;
                }
                this.loadingScreen.dismissLoading();
              });
            });
          }
        }
      ]
    };

    this.alertProvider.showTextBoxAlert(deleteLabelAlert);
  }


}

