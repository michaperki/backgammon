import React, { useState } from "react";
import BackgammonPiece from "./BackgammonPiece";
import "./BackgammonBoard.css";
import { divideBoardArray } from "../gameUtils";

const BackgammonBoard = ({ board, onMove }) => {
  // State variables to store the selected source and destination points
  const [selectedSourcePoint, setSelectedSourcePoint] = useState(null);
  const [selectedDestinationPoint, setSelectedDestinationPoint] =
    useState(null);

  const {
    whiteBearOff,
    blackBearOff,
    whiteBar,
    blackBar,
    firstRowPoints,
    secondRowPoints,
  } = divideBoardArray(board);

  // Function to check if a point is selected
  const isPointSelected = (pointIndex) => {
    return (
      pointIndex === selectedSourcePoint ||
      pointIndex === selectedDestinationPoint
    );
  };

  // Function to handle selecting a point
  const handleSelectPoint = (pointIndex) => {
    if (selectedSourcePoint === null) {
      // If no source point is selected, set the selected point as the source point
      setSelectedSourcePoint(pointIndex);
      setSelectedDestinationPoint(null); // Reset the selected destination point
    } else if (selectedDestinationPoint === null) {
      // If a source point is selected but no destination point is selected, set the selected point as the destination point
      setSelectedDestinationPoint(pointIndex);
    }
  };

  // Function to handle the move
  const handleMakeMove = () => {
    // Check if both source and destination points are selected
    if (selectedSourcePoint !== null && selectedDestinationPoint !== null) {
      onMove(selectedSourcePoint, selectedDestinationPoint);
    }

    // Reset the selected points
    setSelectedSourcePoint(null);
    setSelectedDestinationPoint(null);
  };

  return (
    <div className="backgammon-board flex">
      <div className="backgammon-bear-off backgammon-bear-off--white">
        {whiteBearOff &&
          whiteBearOff.map((piece, pieceIndex) => (
            <div
              key={pieceIndex}
              className={`backgammon-board__bear-off-piece backgammon-board__piece--${
                piece === 1 ? "white" : piece === 2 ? "black" : "empty"
              }`}
            ></div>
          ))}
      </div>
      <div className="backgammon-board-row backgammon-board-row--flipped">
        <div
          className="backgammon-board__bar backgammon-board__bar--black"
          onClick={() => handleSelectPoint(0)}
        >
          {whiteBar &&
            whiteBar[1].map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                className={`backgammon-board__bar-piece backgammon-board__piece--${
                  piece === 1 ? "white" : piece === 2 ? "black" : "empty"
                }`}
              ></div>
            ))}
        </div>
        {firstRowPoints.map(([pointIndex, point]) => (
          <div
            key={pointIndex}
            className={`backgammon-board__point backgammon-board__point--${pointIndex} ${
              isPointSelected(pointIndex) ? "selected" : ""
            }`}
            onClick={() => handleSelectPoint(pointIndex)}
          >
            {point.map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                className={`backgammon-board__piece backgammon-board__piece--${
                  piece === 1 ? "white" : piece === 2 ? "black" : "empty"
                }`}
              >
                {piece !== 0 && (
                  <BackgammonPiece color={piece === 1 ? "white" : "black"} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="backgammon-board-row">
        {secondRowPoints.map(([pointIndex, point]) => (
          <div
            key={pointIndex}
            className={`backgammon-board__point backgammon-board__point--${pointIndex} ${
              isPointSelected(pointIndex) ? "selected" : ""
            }`}
            onClick={() => handleSelectPoint(pointIndex)}
          >
            {point.map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                className={`backgammon-board__piece backgammon-board__piece--${
                  piece === 1 ? "white" : piece === 2 ? "black" : "empty"
                }`}
              >
                {piece !== 0 && (
                  <BackgammonPiece color={piece === 1 ? "white" : "black"} />
                )}
              </div>
            ))}
          </div>
        ))}
        <div
          className="backgammon-board__bar backgammon-board__bar--white"
          onClick={() => handleSelectPoint(25)}
        >
          {blackBar &&
            blackBar[1].map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                className={`backgammon-board__bar-piece backgammon-board__piece--${
                  piece === 1 ? "white" : piece === 2 ? "black" : "empty"
                }`}
              ></div>
            ))}
        </div>
      </div>
      <div className="backgammon-bear-off backgammon-bear-off--black">
        {blackBearOff &&
          blackBearOff.map((piece, pieceIndex) => (
            <div
              key={pieceIndex}
              className={`backgammon-board__bear-off-piece backgammon-board__piece--${
                piece === 1 ? "white" : piece === 2 ? "black" : "empty"
              }`}
            ></div>
          ))}
      </div>
      <div>
        {selectedSourcePoint !== null && (
          <p>Selected Source: {selectedSourcePoint}</p>
        )}
        {selectedDestinationPoint !== null && (
          <p>Selected Destination: {selectedDestinationPoint}</p>
        )}
      </div>
      {/* Add a button to handle the move */}
      <button
        className="mt-4"
        onClick={handleMakeMove}
        disabled={
          selectedSourcePoint === null || selectedDestinationPoint === null
        }
      >
        Make Move
      </button>
    </div>
  );
};

export default BackgammonBoard;
