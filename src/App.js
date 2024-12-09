import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Intro from './componentsJS/Intro';
import Home from './componentsJS/Home';


function App() {


  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
     
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
