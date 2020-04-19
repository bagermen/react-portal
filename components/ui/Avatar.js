import React from 'react';
import classNames from 'classnames';

export default ({profile, className}) => (
  <div className={classNames('avatar', className)}>
    <img crossOrigin="anonymous" src={profile ? profile : ''}/>
  </div>
);