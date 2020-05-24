import React from 'react';
import './App.css';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <Board
        cellSize={10}
        width={800}
        height={1000}
      />
    </div>
  );
}

export default App;
