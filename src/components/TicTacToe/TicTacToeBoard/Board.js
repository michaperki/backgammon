import React from "react";

const Board = ({ board, onSquareClick }) => {
  return (
    <div className="grid grid-cols-3 gap-0">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={`bg-white border border-gray-400 w-24 h-24 text-4xl font-bold flex items-center justify-center ${
              cell === "X" ? "text-red-500" : "text-blue-500"
            }`}
            onClick={() => onSquareClick(rowIndex, colIndex)}
          >
            {cell}
          </button>
        ))
      )}
    </div>
  );
};

export default Board;
