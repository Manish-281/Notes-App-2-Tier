// Import React and ReactDOM libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import our main App component
import App from './App';

// Find the root element in index.html and render the App inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
