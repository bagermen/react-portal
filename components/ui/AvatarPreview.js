import React from 'react';
import classNames from 'classnames';
import Avatar from './Avatar.js';

export default ({avatar, className = '', onClick = function(){}}) => (
  <a href="#" className={classNames('avatar thumb-lg avatar-preview', className)} onClick={onClick}>
    <Avatar profile={avatar || 'dist/images/avatar.png'} className="thumb-lg"/>
    <div className={"avatar-preview__front-change"}><span>change</span></div>
  </a>
);