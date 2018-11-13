export class ImageModel {
  constructor(
    public imageName:string,
    public imagePath:string,
    public imageLabel:string,
    public uploadUrl:string,
    public beingUploaded:boolean = false){}
}
