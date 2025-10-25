import React from 'react';
import GpaCalculator from './components/GpaCalculator';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

function App() {
  return (
    <div className="App">
      <GpaCalculator />
      <Analytics />
    </div>
  );
}

export default App;
