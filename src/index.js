import React from 'react';
import './style.css';
import App from './components/App';
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
