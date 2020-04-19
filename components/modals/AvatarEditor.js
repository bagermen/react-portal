import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateCroppedImage } from '../../actions/avatar_editor';
import ModalFactory from '../modals/factory';
import AvatarEditorCmp from '../widgets/AvatarEditor';
import {WIN_EDIT_AVATAR} from "../../constants/windows";
import S3Service from '../../services/S3Service';
import setAlert from '../../actions/popup_alert';

const s3 = new S3Service();

class AvatarEditor extends Component {
   /* jshint ignore:start */
  static propTypes = {
    profile: PropTypes.string,
    croppedImageUrl: PropTypes.string,
    updateCroppedImage: PropTypes.func,
    onChange: PropTypes.func
  }
  static defaultProps = {
    onChange: function() {}
  };
  /* jshint ignore:end */

  constructor() {
    super();
    this.hideWindow = this.hideWindow.bind(this);
    this.onImageSave = this.onImageSave.bind(this);
  }

  hideWindow() {
    this.props.updateCroppedImage('');
    ModalFactory.hide(WIN_EDIT_AVATAR);
  }

  onImageSave(file) {
    return new Promise((resolve) => {
      if (file.type.indexOf("image") == -1) {
        this.props.setAlert('File not supported, please upload file with extension "jpg", "jpeg", "png"');

        resolve(false);
      }
      if (file.size > 1024000) {
        this.props.setAlert("Image too big (max 1MB)");

        resolve(false);
      }

      s3.uploadFile(file, "profile-images")
        .then(data => {
          this.hideWindow();
          this.props.onChange(data.Location)
          resolve();
        })
        .catch(err => resolve(err));
    });
  }

  render() {
    const { profile, croppedImageUrl, updateCroppedImage } = this.props;
    return (
      <AvatarEditorCmp
        src={profile}
        croppedImageUrl={croppedImageUrl}
        onCropChange={updateCroppedImage}
        onChange={this.onImageSave}
        onCancel={this.hideWindow}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    profile: state.user.profile,
    croppedImageUrl: state.avatar_editor.croppedImageUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
      ...bindActionCreators({
        updateCroppedImage,
        setAlert
      }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarEditor);