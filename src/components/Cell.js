import React from "react";
import PropTypes from "prop-types";

const Cell = ({x, y, cellSize}) => {
  return (
    <div
      className="Cell"
      style={{
        left: `${cellSize * x + 1}px`,
        top: `${cellSize * y + 1}px`,
        width: `${cellSize - 1}px`,
        height: `${cellSize - 1}px`,
      }}
    />
  );
};

Cell.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired
};

export default Cell;
