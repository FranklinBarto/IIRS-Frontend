// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './Pages/homepage.jsx';
import AnalysisPage from './Pages/analysis';
import VisualisationPage from './Pages/visualisation';
import SuitabilityPage from './Pages/suitability.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/visualization" element={<VisualisationPage />} />
        <Route path="/suitability" element={<SuitabilityPage />} />
      </Routes>
    </Router>
  );
}

export default App;