import React from "react";
import BackgammonPiece from "./BackgammonPiece";
import "./BackgammonBoard.css";

const BackgammonBoard = ({ board, onMove }) => {
  // Convert the board object to an array of points with their respective pieces
  const points = Object.entries(board);

  // Divide the points array into two rows
  const firstRowPoints = points.slice(0, 12);
  const secondRowPoints = points.slice(12);

  return (
    <div className="backgammon-board">
      {/* Backgammon board rendering */}
      {/* render two rows */}
      <div className="backgammon-board-row">
        {firstRowPoints.map(([pointIndex, point]) => (
          <div
            key={pointIndex}
            className={`backgammon-board__point backgammon-board__point--${pointIndex}`}
          >
            {point.map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                className={`backgammon-board__piece backgammon-board__piece--${
                  piece === 1 ? "black" : piece === 2 ? "white" : "empty"
                }`}
              >
                {piece !== 0 && <BackgammonPiece color={piece === 1 ? "black" : "white"} />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="backgammon-board-row backgammon-board-row--flipped">
        {secondRowPoints.map(([pointIndex, point]) => (
          <div
            key={pointIndex}
            className={`backgammon-board__point backgammon-board__point--${pointIndex}`}
          >
            {point.map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                className={`backgammon-board__piece backgammon-board__piece--${
                  piece === 1 ? "black" : piece === 2 ? "white" : "empty"
                }`}
              >
                {piece !== 0 && <BackgammonPiece color={piece === 1 ? "black" : "white"} />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="backgammon-board__controls">
        <button onClick={() => onMove(0, 1)}>Make Sample Move</button>
      </div>
    </div>
  );
};

export default BackgammonBoard;
