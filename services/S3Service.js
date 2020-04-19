import S3 from 'aws-sdk/clients/s3';
import AWSConfig from '../aws-credentials.json';

let _s3 = Symbol('s3');
export default class S3Service {
  constructor(bucket = 'columbia-customer-portal') {
    this.s3 = null;
    this.bucket = bucket;
  }

  get s3() {
    if (!this[_s3]) {
      this[_s3] = new S3({...AWSConfig, apiVersion: '2006-03-01'});
    }
    return this[_s3];
  }

  set s3(s3) {
    this[_s3] = s3;
  }
  uploadFile(file, directory = '') {
    const fileExt = file.name.split('.').pop();
    const fileNameWithoutExt = file.name.substr(0, file.name.length - fileExt.length + 1);
    const timeStamp = new Date().getTime();
    const newFileName = `${fileNameWithoutExt}_${timeStamp}.${fileExt}`;

    return this.s3.upload({
      Bucket: this.bucket,
      Key: `${directory ? `${directory}/` : ''}${newFileName}`,
      ContentType: file.type,
      Body: file,
      ServerSideEncryption: 'AES256',
      ACL: 'public-read'
    }).promise();
  }


  deleteFile(fileName, directory = '') {
    this.s3.deleteObject({
      Bucket: this.bucket,
      Key: `${directory ? `${directory}/` : ''}${fileName}`,
    }).promise();
  }

  getSignedUrl(fileName, signedUrlExpireSeconds = 60*15) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.bucket,
      Key: fileName,
      Expires: signedUrlExpireSeconds
    });
  }
}