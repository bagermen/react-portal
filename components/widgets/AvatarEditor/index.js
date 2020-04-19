import React from 'react';
import ReactCrop from 'react-image-crop';
import Avatar from '../../ui/Avatar.js';
import UploadFile from '../../ui/UploadFile.js';
import PropTypes from "prop-types";
import { throttle } from 'lodash';
import classNames from 'classnames';

import 'react-image-crop/dist/ReactCrop.css';
import './style.less';
export default class AvatarEditor extends React.Component {
  /* jshint ignore:start */
  static propTypes = {
    src: PropTypes.string,
    croppedImageUrl: PropTypes.string,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    onCropChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    onChange: function() { return Promise.resolve()},
    onCancel: function() {},
  };
  /* jshint ignore:end */
  constructor(...props) {
    super(...props);
    this.onCropChange = this.onCropChange.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.state = {
      src: this.props.src,
      crop: {
        unit: 'px',
        aspect: 1
      },
      imageStyle: {
        maxHeight: 'initial'
      },
      minWidth: 30,
      minHeight: 30,
      editAvatar: false
    };

    this.reDrawImage = throttle(() => this.makeClientCrop(this.state.crop), 50);
  }

  componentDidUpdate(prevProps) {
    if (!this.state.src || prevProps.src != this.props.src) {
      this.setState({src: this.props.src});
    }
  }

  componentWillUnmount() {
    this.reDrawImage = this.imageRef = this.fileUrl = null;
  }

  onCancel() {
    this.props.onCropChange(null);
    this.props.onCancel();
  }

  onCropChange(crop, percentCrop) {
    this.setState({crop});
    this.reDrawImage();
  }

  onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => this.setState({src: reader.result}));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  onCropComplete(crop) {
    this.makeClientCrop(crop);
  }

  onImageLoaded(image) {
    this.imageRef = image;
    const size = Math.min(image.width, image.height);
    const crop = {...this.state.crop, ...{width: size, height: size, x: 0, y: 0}};
    this.setState({crop});
    this.makeClientCrop(crop);

    return false;
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.props.onCropChange(croppedImageUrl);
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  async onImageChange() {
    let image = this.props.croppedImageUrl,
        imageFile,
        self = this;

    if (image) {
      imageFile = await fetch(image).then(r => r.blob());
      imageFile.name = "newFile.jpeg";
      await self.props.onChange(imageFile);
    }
  }

  render() {
    const { crop, imageStyle, minWidth, minHeight, src } = this.state;
    const { croppedImageUrl } = this.props

    return (
      <div className={classNames('avatar-uploader-grid', this.props.className)}>
        <div className="avatar-uploader-grid_controls">
          <div><UploadFile onChange={this.onSelectFile}>Select Image</UploadFile></div>
          <button className="btn btn-primary" onClick={this.onImageChange}>Use Avatar</button>
          <button className="btn btn-default" onClick={this.onCancel}>Cancel</button>
        </div>
        {src ? (
          <ReactCrop
            src={src}
            crop={crop}
            imageStyle={imageStyle}
            minWidth={minWidth}
            minHeight={minHeight}
            className={'avatar-uploader'}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            crossorigin="anonymous"
          />) :
          (<div>Select image</div>)
        }
        <div className="avatar-uploader-grid__examples">
          <Avatar profile={croppedImageUrl || src} className="thumb-lg"/>
          <Avatar profile={croppedImageUrl || src} className="thumb-md"/>
          <Avatar profile={croppedImageUrl || src} className="thumb-sm"/>
        </div>
      </div>
    );
  }
}