import React from 'react';
import ReactDom from 'react-dom';

import './dist/css/animate.css';
import './dist/css/chartist.css';
import './dist/css/draft.css';
import './dist/css/rcslider.css';
import './dist/css/react-datepicker.css';
import './dist/css/style.css';

import Root from './containers/Root';

ReactDom.render(
  <Root />,
  document.getElementById('wrapperContainer')
);