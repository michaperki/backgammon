import React, { useState } from "react";
import BackgammonPiece from "./BackgammonPiece";
import "./BackgammonBoard.css";

const BackgammonBoard = ({ board, onMove }) => {
  // Convert the board object to an array of points with their respective pieces
  const points = Object.entries(board);

  // Divide the points array into two rows
  const firstRowPoints = points.slice(0, 12);
  const secondRowPoints = points.slice(12);

  // State variables to store the selected source and destination points
  const [selectedSourcePoint, setSelectedSourcePoint] = useState(null);
  const [selectedDestinationPoint, setSelectedDestinationPoint] = useState(null);

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
    return pointIndex === selectedSourcePoint || pointIndex === selectedDestinationPoint;
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
      {/* Backgammon board rendering */}
      {/* Render two rows */}
      <div className="backgammon-board-row">
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
            className={`backgammon-board__point backgammon-board__point--${pointIndex} ${
              isPointSelected(pointIndex) ? "selected" : ""
            }`}
            onClick={() => handleSelectPoint(pointIndex)}
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
      {/* Display the selected points */}
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
        disabled={selectedSourcePoint === null || selectedDestinationPoint === null}
      >
        Make Move
      </button>
    </div>
  );
};

export default BackgammonBoard;
