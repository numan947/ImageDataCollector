import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {NetworkProvider} from "../../providers/network/network";
import {FileSaverProvider} from "../../providers/file-saver/file-saver";
import {ToastProvider} from "../../providers/toast/toast";
import {AlertProvider} from "../../providers/alert/alert";
import {BackgroundProvider} from "../../providers/background/background";
import {LoadingScreenProvider} from "../../providers/loading-screen/loading-screen";
import {ImageListPage} from "../image-list/image-list";
import {LabelSettingsPage} from "../label-settings/label-settings";
import {LabelModel} from "../../app/models/LabelModel";
import {Diagnostic} from "@ionic-native/diagnostic";
import {UploaderProvider} from "../../providers/uploader/uploader";
import {ImageModel} from "../../app/models/ImageModel";

//Input Field States
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page disabled.
 * */
const DISABLE_INPUT_FIELD = "page-contact disabled";
/**
 * This Variable contains the css needed to make the Input fields in Personal Info Page enabled.
 * */
const ENABLE_INPUT_FIELD = "page-contact enabled";

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**
   * @ignore
   * */
  shahadProject: boolean = true;
  /**
   * @ignore
   * */
  rafidProject: boolean = false;

  selectedLabel: LabelModel = null; //By default none is selected

  GENERALMODE: boolean = true;
  IMAGECAPTUREDMODE: boolean = false;

  storeButtonDisabled: boolean = true;
  uploadButtonDisabled: boolean = true;

  private allLabels: Array<LabelModel> = null;

  private permissionsNeeded: any = null;

  private masterEndPoint: string;


  CAMERAOPTIONS: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 720,
    targetHeight: 720,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };


  capturedImage: any = null;


  constructor(
    private navCtrl: NavController,
    private camera: Camera,
    private platform: Platform,
    private networkProvider: NetworkProvider,
    private fileSaver: FileSaverProvider,
    private toastProvider: ToastProvider,
    private alertProvider: AlertProvider,
    private backgroundProvider: BackgroundProvider,
    private loadingScreen: LoadingScreenProvider,
    private diagnostic: Diagnostic,
    private uploader: UploaderProvider
  ) {
    this.permissionsNeeded = [];
    this.permissionsNeeded.push(this.diagnostic.permission.CAMERA);
    this.permissionsNeeded.push(this.diagnostic.permission.READ_EXTERNAL_STORAGE);
    this.permissionsNeeded.push(this.diagnostic.permission.WRITE_EXTERNAL_STORAGE);
  }

  loadLabels() {
    console.log("Inside Load Labels");

    this.loadingScreen.showGeneralLoadingScreen();
    this.platform.ready().then(() => {


      Promise.all([this.fileSaver.getLabels(), this.fileSaver.getMasterEndPoint()]).then(values => {
        this.allLabels = values[0];
        this.masterEndPoint = values[1];

        this.loadingScreen.dismissLoading();
        this.fileSaver.labelsChanged = false;
        this.loadingScreen.dismissLoading();
        if (!this.allLabels) {
          this.showAddLabelsAlert();
        }

      }).catch(err => {
        this.toastProvider.presentInofrmationToast("Error While Fetching Data!");
        this.loadingScreen.dismissLoading();
      });
    });
  }

  showAddLabelsAlert() {
    let alertForUpdatingSettings: any = {
      title: "<h6>YOU MUST ADD LABELS FIRST</h6>",
      message: "<img ion-text src='assets/imgs/doctor_strange.png'>",
      buttons: [
        {
          text: "Teach Me!",
          handler: () => {
            this.navCtrl.push(LabelSettingsPage);
          }
        },
        {
          text: "Later",
          handler: () => {

          }
        }
      ]
    };
    this.alertProvider.showTextBoxAlert(alertForUpdatingSettings);
  }


  ionViewWillEnter() {
    this.loadLabels();
  }

  ionViewDidLoad() {

  }


  showSavedImages() {
    console.log("Inside showSavedImages");

    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.fileSaver.getLocalImages().then(result => {
          // console.log(Boolean(Object.keys(result)[0]));
          if (result) {
            if (Boolean(Object.keys(result)[0])) {
              this.loadingScreen.showPageChangeLoadingScreen();
              this.navCtrl.push(ImageListPage, {data: result});
              return;
            }
          }
          this.alertProvider.showInformationAlert("No Saved Images");
        })
      });
    }
    else {
      let result = [
        new ImageModel("mock1", "assets/mock-images/mock_image.jpg", "Label1", "http://ptsv2.com/t/tvvs0-1541831199/post"),
        new ImageModel("mock2", "assets/imgs/logo.png", "Label2", "http://ptsv2.com/t/tvvs0-1541831199/post"),
        new ImageModel("mock3", "assets/imgs/test.jpg", "Label3", "http://ptsv2.com/t/tvvs0-1541831199/post"),
        new ImageModel("mock4", "assets/imgs/numan.jpg", "Label4", "http://ptsv2.com/t/tvvs0-1541831199/post"),
        new ImageModel("mock5", "assets/imgs/shahad.jpg", "Label5", "http://ptsv2.com/t/tvvs0-1541831199/post")];
      this.loadingScreen.showPageChangeLoadingScreen();
      this.navCtrl.push(ImageListPage, {data: result});
      console.log("Will Show Saved Images");
    }
  }


  showLabelSettings() {
    console.log("Inside showLabelSettings");
    this.navCtrl.push(LabelSettingsPage);
  }

  importFromSource() {
    console.log("Inside importFromSource");
  }


  private getPictureFromCamera() {
    this.camera.getPicture(this.CAMERAOPTIONS).then(imagePath => {
      this.capturedImage = imagePath;
      this.storeButtonDisabled = false;
      this.uploadButtonDisabled = false;
      this.setImageCaptureMode();
      //this.toastProvider.presentInofrmationToast(this.capturedImage);
    }).catch(err => {
      console.log("WEIRD ERROR HAPPENED");
      if (!(err == "No Image Selected")) {
        this.alertProvider.showInformationAlert(err);
      }
    });
  }


  getPermissions(permToRequest) {
    this.diagnostic.requestRuntimePermissions(permToRequest).then(() => {
      this.captureImage();
    }).catch((error) => {
      this.alertProvider.showInformationAlert("Error While Requesting Permissions " + error);
    });
  }


  captureImage() {
    console.log("Inside Capture Image");

    if (this.platform.is('cordova')) {
      this.diagnostic.getPermissionsAuthorizationStatus(this.permissionsNeeded).then((statuses) => {
        let permToRequest: any = [];
        for (let perm in statuses) {
          if (statuses[perm] != this.diagnostic.permissionStatus.GRANTED) {
            permToRequest.push(perm);
          }
        }

        if (permToRequest.length > 0) {
          this.getPermissions(permToRequest);
        } else {
          this.getPictureFromCamera();
        }
      }).catch((error) => {
        this.alertProvider.showInformationAlert("Error While Permission Check " + error);
      });
    } else {
      this.storeButtonDisabled = false;
      this.uploadButtonDisabled = false;
      this.capturedImage = "assets/mock-images/portrait.png";
      this.setImageCaptureMode();
    }
  }

  uploadImage() {
    if (!(this.selectedLabel)) {
      this.alertProvider.showInformationAlert("You Must Select A Label");
      return;
    }
    else if (this.platform.is("cordova")) {
      if (this.networkProvider.isConnected()) {
        let temp: ImageModel = new ImageModel("SIMPLE_IMAGE_COLLECTOR_APP_" + new Date() + ".jpg", this.capturedImage, this.selectedLabel.labelName, this.selectedLabel.labelUrl);
        this.uploadButtonDisabled = true;
        this.storeButtonDisabled = true;
        this.loadingScreen.showGeneralUplaodingScreen();
        this.uploader.uploadSingleImageNow(temp,this.masterEndPoint).then(() => {
          this.loadingScreen.dismissLoading();
          this.toastProvider.presentInofrmationToast("Successfully Uploaded");
        }).catch(() => {
          this.loadingScreen.dismissLoading();
          this.toastProvider.presentInofrmationToast("Upload Failed! Saving Locally....");
          this.fileSaver.saveLocalImage(this.capturedImage, this.selectedLabel.labelName, this.selectedLabel.labelUrl);
        });

      } else {
        this.alertProvider.showInformationAlert("Cannot Upload To Storage! Saving Locally!");
        this.platform.ready().then(() => {
          this.uploadButtonDisabled = true;
          this.storeButtonDisabled = true;
          this.fileSaver.saveLocalImage(this.capturedImage, this.selectedLabel.labelName, this.selectedLabel.labelUrl);
        });
      }
    } else {
      this.alertProvider.showInformationAlert("Will Upload to RemoteStorage");
    }
  }


  storeImage() {
    if ((!this.selectedLabel)) {
      this.alertProvider.showInformationAlert("You Must Select A Label");
      return;
    }
    else if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.storeButtonDisabled = true;
        this.uploadButtonDisabled = true;
        this.fileSaver.saveLocalImage(this.capturedImage, this.selectedLabel.labelName, this.selectedLabel.labelUrl);
      });
    } else {
      console.log(this.capturedImage, this.selectedLabel.labelName, this.selectedLabel.labelUrl);
      this.alertProvider.showInformationAlert("Will Save to Localstorage");
      this.storeButtonDisabled = true;
      this.uploadButtonDisabled = true;
    }
  }

  setGeneralMode() {
    this.GENERALMODE = true;
    this.IMAGECAPTUREDMODE = false;
    this.capturedImage = null;
  }


  setImageCaptureMode() {
    this.IMAGECAPTUREDMODE = true;
    this.GENERALMODE = false;
  }


}
