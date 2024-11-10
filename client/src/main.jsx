import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';
import App from './App';
import { TransactionsProvider } from './context/TransactionContext';
import './index.css';

// Move ErrorBoundary to App.jsx since it's used there
ReactDOM.render(
  <React.StrictMode>
    <TransactionsProvider>
      <App />
    </TransactionsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);