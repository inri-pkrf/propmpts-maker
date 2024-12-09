import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Intro from './componentsJS/Intro';


function App() {


  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Intro />} />
     
        </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
