import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Board.css";
import Cell from "./Cell";

class Board extends Component {

  constructor(props) {
    super(props);
    
    // set up initial state
    this.state = {
      rows: props.height / props.cellSize,
      columns: props.width / props.cellSize,
      isRunning: false,
      interval: 1000,
      cells: []
    };

    this.board = this.createBoard(props.height/props.cellSize, props.width/props.cellSize);
  }
  
  createBoard = (rows = this.state.rows, columns = this.state.columns) => {
    let board = [];
    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < columns; x++) {
        board[y][x] = false;
      }
    }
    return board;
  };

  makeCells = () => {
    let cells = [];
    for (let y = 0; y < this.state.rows; y++) {
      for (let x = 0; x < this.state.columns; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  };

  handleClick = ({ clientX, clientY }) => {
    const elementOffset = this.getElementOffset();
    const offsetX = clientX - elementOffset.x;
    const offsetY = clientY - elementOffset.y;
    const x = Math.floor(offsetX / this.props.cellSize);
    const y = Math.floor(offsetY / this.props.cellSize);
    if (x >= 0 && x <= this.state.columns && y >= 0 && y <= this.state.rows) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({cells: this.makeCells()});
  };

  getElementOffset = () => {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  };


  startGame = () => {
    this.setState({isRunning: true});
    this.tick();
  };

  stopGame = () => {
    this.setState({isRunning: false});
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  };

  handleIntervalChange = (event) => {
    this.setState({interval: event.target.value});
  };

  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        let y1 = y + dir[0];
        let x1 = x + dir[1];

        if (x1 >= 0 && x1 < this.state.columns && y1 >= 0 && y1 < this.state.rows && board[y1][x1]) {
            neighbors++;
        }
    }

    return neighbors;
}

  tick = () => {
    let newBoard = this.createBoard();

    for (let y = 0; y < this.state.rows; y++) {
      for (let x = 0; x < this.state.columns; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!this.board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }

    this.board = newBoard;
    this.setState({cells: this.makeCells()});

    this.timeoutHandler = window.setTimeout(() => {
      this.tick();
    }, this.state.interval);
  };

  handleClear = () => {
    this.board = this.createBoard();
    this.setState({ cells: this.makeCells() });
}

  render() {
    return (
      <>
        <div className="inputArea">
          {" "}
          Update interval:{" "}
          <input
            value={this.state.interval}
            onChange={this.handleIntervalChange}
            size={8}
          /> ms{" "}
          {this.state.isRunning ? (
            <button className="button" onClick={this.stopGame}>
              Stop
            </button>
          ) : (
            <button className="button" onClick={this.startGame}>
              Run
            </button>
          )}{" "}
          <button className="button" onClick={this.handleClear} disabled={this.state.isRunning}>Clear</button>
        </div>
  
        <div
          className="board"
          style={{
            width: this.props.width,
            height: this.props.height,
            backgroundSize: `${this.props.cellSize}px ${this.props.cellSize}px`,
          }}
          onClick={this.handleClick}
          ref={(n) => {
            this.boardRef = n;
          }}
        >
          {this.state.cells.map((cell) => (
            <Cell
              x={cell.x}
              y={cell.y}
              cellSize={this.props.cellSize}
              key={`${cell.x},${cell.y}`}
            />
          ))}
        </div>
      </>
    );
  }
};

Board.propTypes = {
  cellSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Board;
