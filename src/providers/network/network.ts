import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";
import {Network} from "@ionic-native/network";

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class NetworkProvider {

  constructor(public network:Network) {
    console.log('Hello NetworkProvider Provider');
  }
  isConnected(){
    console.log(this.network.type);
    let netWorkStat:boolean = (this.network.type!=="unknown" && this.network.type !== "none" && this.network.type !== null);
    return netWorkStat;
  }
  getNetworkType(){
    return this.network.type.toString();
  }







}
