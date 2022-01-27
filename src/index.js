import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

var calendar = ReactDOM.render(
  <App />,
  document.getElementsByName('react-control-root')[0]
);
window.MyCalendar = calendar;