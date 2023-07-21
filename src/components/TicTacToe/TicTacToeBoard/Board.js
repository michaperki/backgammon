import React from "react";
import Square from "./Square";

const Board = ({ board, onSquareClick }) => {
  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Square
              key={colIndex}
              value={cell === null ? " " : cell}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
