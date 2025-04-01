<<<<<<< HEAD
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
=======
// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Optional global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
>>>>>>> origin/main
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// Add this near the top of your App or AppContent component
<div className="app-background"></div>
