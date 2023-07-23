import React, { useState } from "react";
import BackgammonPiece from "./BackgammonPiece";
import "./BackgammonBoard.css";

const BackgammonBoard = ({ board, onMove }) => {
  // Convert the board object to an array of points with their respective pieces
  const points = Object.entries(board);

  const whiteBearOff = points[25];
  const blackBearOff = points[26];

  const whiteBar = [1];
  const blackBar = [1];

  // Divide the points array into two rows
  const firstRowPoints = points.slice(1, 13);
  const secondRowPoints = points.slice(13, 25);

  console.log("firstRowPoints", firstRowPoints);
  console.log("secondRowPoints", secondRowPoints);
  console.log("whiteBearOff", whiteBearOff);
  console.log("blackBearOff", blackBearOff);
  console.log("whiteBar", whiteBar);
  console.log("blackBar", blackBar);

  // State variables to store the selected source and destination points
  const [selectedSourcePoint, setSelectedSourcePoint] = useState(null);
  const [selectedDestinationPoint, setSelectedDestinationPoint] =
    useState(null);

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

  // Function to check if a point is selected
  const isPointSelected = (pointIndex) => {
    return (
      pointIndex === selectedSourcePoint ||
      pointIndex === selectedDestinationPoint
    );
  };

  // Function to handle the move
  const handleMakeMove = () => {
    // Check if both source and destination points are selected
    if (selectedSourcePoint !== null && selectedDestinationPoint !== null) {
      // Call the onMove function with the selected points
      onMove(selectedSourcePoint, selectedDestinationPoint);

      // Reset the selected points after the move is made
      setSelectedSourcePoint(null);
      setSelectedDestinationPoint(null);
    }
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
      <div className="backgammon-board-row">
        <div className="backgammon-board__bar backgammon-board__bar--black">
          {blackBar &&
            blackBar.map((piece, pieceIndex) => (
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
      <div className="backgammon-board-row backgammon-board-row--flipped">
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
        <div className="backgammon-board__bar backgammon-board__bar--white">
          {whiteBar &&
            whiteBar.map((piece, pieceIndex) => (
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
