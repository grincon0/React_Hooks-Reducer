import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';
//[authContextProvider] wraps context throughout the application
ReactDOM.render(
   <AuthContextProvider>
       <App />
   </AuthContextProvider>
, document.getElementById('root'));
