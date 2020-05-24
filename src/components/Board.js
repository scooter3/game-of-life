import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Board.css";
import Cell from "./Cell";

const Board = ({ cellSize, width, height }) => {
  const [cells, setCells] = useState([]);
  const [rows, setRows] = useState(height / cellSize);
  const [columns, setColumns] = useState(width / cellSize);
  const [interval, setInterval] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  let boardRef;
  let timeoutHandler;

  const createBoard = () => {
    let board = [];
    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < columns; x++) {
        board[y][x] = false;
      }
    }
    return board;
  };

  const [board, setBoard] = useState(createBoard());

  const makeCells = () => {
    let cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        if (board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  };

  const getElementOffset = () => {
    const rect = boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  };

  const handleClick = ({ clientX, clientY }) => {
    const elementOffset = getElementOffset();
    const offsetX = clientX - elementOffset.x;
    const offsetY = clientY - elementOffset.y;
    const x = Math.floor(offsetX / cellSize);
    const y = Math.floor(offsetY / cellSize);
    if (x >= 0 && x <= columns && y >= 0 && y <= rows) {
      board[y][x] = !board[y][x];
    }
    setCells(makeCells());
  };

  const startGame = () => {
    setIsRunning(true);
    tick();
  };

  const stopGame = () => {
    setIsRunning(false);
    if (timeoutHandler) {
      window.clearTimeout(timeoutHandler);
      timeoutHandler = null;
    }
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const calculateNeighbors = (x, y) => {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (
        x1 >= 0 &&
        x1 < this.cols &&
        y1 >= 0 &&
        y1 < this.rows &&
        board[y1][x1]
      ) {
        neighbors++;
      }
    }

    return neighbors;
  };

  const tick = () => {
    console.log('tick');
    let newBoard = createBoard();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let neighbors = calculateNeighbors(board, x, y);
        if (board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }

    setBoard(newBoard);
    setCells(makeCells());

    timeoutHandler = window.setTimeout(() => {
      tick();
    }, interval);
  };

  return (
    <>
      <div className="inputArea">
        {" "}
        Update interval:{" "}
        <input
          value={interval}
          onChange={handleIntervalChange}
          size={8}
        /> ms{" "}
        {isRunning ? (
          <button className="button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={startGame}>
            Run
          </button>
        )}{" "}
      </div>

      <div
        className="board"
        style={{
          width: width,
          height: height,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
        onClick={handleClick}
        ref={(n) => {
          boardRef = n;
        }}
      >
        {cells.map((cell) => (
          <Cell
            x={cell.x}
            y={cell.y}
            cellSize={cellSize}
            key={`${cell.x},${cell.y}`}
          />
        ))}
      </div>
    </>
  );
};

Board.propTypes = {
  cellSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Board;
