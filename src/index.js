import React from 'react';
import ReactDOM from 'react-dom';
import 'react-dates/initialize';

import Provider from './application';
import './assets/styles.styl';

// import '@fortawesome/fontawesome-free/css/all.css';

ReactDOM.render(<Provider />, window.document.getElementById('root'));
