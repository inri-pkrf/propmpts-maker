import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Intro from './componentsJS/Intro';
import Home from './componentsJS/Home';
import Menu from './componentsJS/Menu';
import PartOne from './componentsJS/PartOne';
import PartTwo from './componentsJS/PartTwo';
import PartThree from './componentsJS/PartThree';
import PartFour from './componentsJS/PartFour';
import PartFive from './componentsJS/PartFive';
import PromptMaker from './componentsJS/PromptMaker';


function App() {


  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/step1" element={<PartOne />} />
        <Route path="/step2" element={<PartTwo />} />
        <Route path="/step3" element={<PartThree />} />
        <Route path="/step4" element={<PartFour />} />
        <Route path="/step5" element={<PartFive />} />
        <Route path="/prompt-maker" element={<PromptMaker />} />
     
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
