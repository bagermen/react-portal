import React from 'react';
import classNames from 'classnames';
/**
 * control panel
 */
export default ({headerText = '', className, classHeader = '', children, ...props}) => {
  return (
    <section className="ui-control-panel" {...props}>
      {headerText ? (<header className={classNames({[classHeader]: !!classHeader})}>{headerText}</header>) : null}
      <div className={classNames({[className || 'class']: !!className})}>
        {children}
      </div>
    </section>
  );
}