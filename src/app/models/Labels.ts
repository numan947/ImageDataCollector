export class Labels {
  constructor(private labels){}
  public getLabels(){
    return Object.keys(this.labels);
  }
  public getUrl(label){
    return this.labels[label];
  }
}
