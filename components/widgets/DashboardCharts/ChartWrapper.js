import React from 'react';
import classNames from 'classnames';


export default ({ title = '', children, className }) => {
  return (
    <section className={classNames('dashboard-charts-wrapper', 'dashboard-charts-style', {[className || 'class']: className})}>
      {title ? (<header>{title}</header>) : null}
      { children }
    </section>
  );
}