import React, { useState } from 'react';
import classNames from 'classnames';
/**
 * upload file button
 */
export default ({name = '', className = '', onChange = function() {}, children}) => {
  const [hover, setHover] = useState(false);

  return (
    <div className="upload-btn-wrapper">
      <button className={classNames('btn btn-default', className, {active: hover})}>{children}</button>
      <input type="file" name={name} onChange={onChange} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}/>
    </div>
  );
}