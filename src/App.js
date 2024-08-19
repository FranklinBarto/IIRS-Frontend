// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './Pages/homepage.jsx';
import AnalysisPage from './Pages/analysis';
import VisualisationPage from './Pages/visualisation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/visualization" element={<VisualisationPage />} />
      </Routes>
    </Router>
  );
}

export default App;