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

  const canMoveToBar = (pointIndex, player) => {
    // Check if the player can move a piece to their bar
    const point = board[pointIndex];
    return point.length > 0 && point[0] !== player;
  };

  const canBearOff = (player) => {
    // Check if the player can bear off their pieces
    const bearOffPoints = player === 1 ? whiteBearOff : blackBearOff;
    return bearOffPoints?.length > 0;    
  };

  const isCaptureMove = (sourcePointIndex, destinationPointIndex) => {
    // Check if the move is a capture move
    const destinationPoint = board[destinationPointIndex];
    return (
      destinationPoint.length === 1 &&
      destinationPoint[0] !== board[sourcePointIndex][0]
    );
  };

  const handleCapture = (pointIndex) => {
    // Capture the opponent's piece and move it to the bar
    const opponentPlayer = board[pointIndex][0] === 1 ? 2 : 1;
    board[pointIndex].pop();
    board[pointIndex] = board[pointIndex].slice();
    board[pointIndex].push(opponentPlayer);
  };

  const handleBearOff = (player) => {
    // Bear off a piece from the board
    const bearOffPoints = player === 1 ? whiteBearOff : blackBearOff;
    const pointIndex = player === 1 ? 0 : 27;

    const sourcePoint = board[pointIndex].slice();
    const pieceToBearOff = sourcePoint.pop();
    if (pieceToBearOff === player) {
      bearOffPoints.push(pieceToBearOff);
      board[pointIndex] = sourcePoint;
    }
  };

  const handleMove = (sourcePointIndex, destinationPointIndex) => {
    // Move a piece from source to destination
    if (isCaptureMove(sourcePointIndex, destinationPointIndex)) {
      handleCapture(destinationPointIndex);
    }

    const pieceToMove = board[sourcePointIndex].pop();
    board[destinationPointIndex].push(pieceToMove);
  };

  const handleValidMove = (sourcePointIndex, destinationPointIndex) => {
    // Handle the logic for valid moves, including captures and bearing off
    const player = board[sourcePointIndex][0];

    if (canMoveToBar(destinationPointIndex, player)) {
      handleCapture(destinationPointIndex);
      handleMove(sourcePointIndex, destinationPointIndex);
    } else if (canBearOff(player)) {
      if (destinationPointIndex === player) {
        handleBearOff(player);
        handleMove(sourcePointIndex, destinationPointIndex);
      }
    } else {
      handleMove(sourcePointIndex, destinationPointIndex);
    }
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
      // Call the onMove function with the selected points
      onMove(selectedSourcePoint, selectedDestinationPoint);
    }

    // Reset the selected points after the move is made or attempted
    setSelectedSourcePoint(null);
    setSelectedDestinationPoint(null);
  };

  // Function to check if a point is selected
  const isPointSelected = (pointIndex) => {
    return (
      pointIndex === selectedSourcePoint ||
      pointIndex === selectedDestinationPoint
    );
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
