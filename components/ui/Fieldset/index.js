import React from 'react';
import classNames from 'classnames';
/**
 * control panel
 */
export default ({headerText = '', className, classHeader = '', children, ...props}) => {
  return (
    <section className={classNames('ui-fieldset-panel', {[className]: !!className})} {...props}>
      {headerText ? (<header className={classNames({[classHeader]: !!classHeader})}>{headerText}</header>) : null}
      {children}
    </section>
  );
}