import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * This class is the same as the template provides. We didn't change any of it yet.
 * We just edited the html to show static contents.
 * */
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

}
