import { reverseIndex } from "./gameUtils";

export const checkValidMove = (
  sourcePoint,
  destinationPoint,
  currentTurn,
  gameData,
  direction,
  remainingDiceValues
) => {
  console.log("sourcePoint", sourcePoint);
  console.log("destinationPoint", destinationPoint);
  console.log("currentTurn", currentTurn);
  console.log("gameData", gameData);
  console.log("direction", direction);
  console.log("remainingDiceValues", remainingDiceValues);

  // turn 0 is the white player, turn 1 is the black player
  // pieces are represented by 1 for white and 2 for black
  const turnToColor = currentTurn + 1;

  // sourcePointPieces and destinationPointPieces are the pieces on the board
  const sourcePointPieces = gameData.board[sourcePoint];
  const destinationPointPieces = gameData.board[destinationPoint];

  // If the sourcePoint is empty, return false
  if (sourcePointPieces.length === 0) {
    console.log("sourcePointPieces.length === 0");
    return false;
  }

  // If the sourcePoint is not the current player's turn, return false
  if (sourcePointPieces[0] !== turnToColor) {
    console.log("sourcePointPieces[0] !== turnToColor");
    console.log("sourcePointPieces[0]", sourcePointPieces[0]);
    console.log("turnToColor", turnToColor);
    return false;
  }

  // If the destinationPoint has more than one of the opponent's piece
  // and the destinationPoint is not the current player's turn, return false
  if (
    destinationPointPieces.length > 1 &&
    destinationPointPieces[0] !== turnToColor
  ) {
    console.log(
      "destinationPointPieces.length > 1 && destinationPointPieces[0] !== turnToColor"
    );
    return false;
  }

  // If the destinationPoint is greater than 23 or less than 0, return false
  if (destinationPoint > 23 || destinationPoint < 0) {
    console.log("destinationPoint > 23 || destinationPoint < 0");
    return false;
  }

  // If the direction is positive (white player) and the destinationPoint is less than the sourcePoint, return false
  if (direction === 1 && parseInt(destinationPoint) < parseInt(sourcePoint)) {
    console.log(
      "I think that " + destinationPoint + " is less than " + sourcePoint
    );
    console.log(destinationPoint < sourcePoint);
    console.log("converting them to integers first");
    console.log();
    console.log("direction === 1 && destinationPoint < sourcePoint");
    return false;

    // If the direction is negative (black player) and the destinationPoint is greater than the sourcePoint, return false
  } else if (
    direction === -1 &&
    parseInt(destinationPoint) > parseInt(sourcePoint)
  ) {
    console.log("direction === -1 && destinationPoint > sourcePoint");
    return false;
  }

  // If the destinationPoint is the same as the sourcePoint, return false
  if (destinationPoint === sourcePoint) {
    console.log("destinationPoint === sourcePoint");
    return false;
  }

  // check that the distance between the sourcePoint and destinationPoint is one of the remainingDiceValues
  const distance = Math.abs(destinationPoint - sourcePoint);
  if (!remainingDiceValues.includes(distance)) {
    console.log("!remainingDiceValues.includes(distance)");
    return false;
  }

  // Else
  return true;
};

export const makeMove = (sourcePoint, destinationPoint, currentTurn, board) => {
  // Check if the destination point exists in the board
  if (!board.hasOwnProperty(destinationPoint)) {
    console.error("Invalid destination point.");
    return null;
  }

  // Get the source and destination points
  const sourcePointPieces = board[sourcePoint];
  const destinationPointPieces = board[destinationPoint];

  // Check if the destination point has more than one of the opponent's piece
  if (
    destinationPointPieces.length > 1 &&
    destinationPointPieces[0] !== (currentTurn + 1)
  ) {
    // If the destination point has the opponent's piece, remove it
    destinationPointPieces.shift();
  }

  // Move only one piece from the source to the destination point
  const movedPiece = sourcePointPieces.pop();
  destinationPointPieces.push(movedPiece);
  console.log("movedPiece", movedPiece);
  console.log("sourcePointPieces", sourcePointPieces);
  console.log("destinationPointPieces", destinationPointPieces);

  // Update the board
  const updatedBoard = {
    ...board,
    [sourcePoint]: sourcePointPieces,
    [destinationPoint]: destinationPointPieces,
  };

  return updatedBoard;
};

export const checkWinner = (board, currentTurn) => {
    // Define the starting and ending points for each player
    const startingPointPlayer0 = 0;
    const endingPointPlayer0 = 5;
    const startingPointPlayer1 = 18;
    const endingPointPlayer1 = 23;
  
    // Check if any piece of the current player has reached the opponent's side
    if (currentTurn === 0) {
      for (let i = startingPointPlayer0; i <= endingPointPlayer0; i++) {
        if (board[i]?.includes(0)) {
          return 0; // Player 0 wins
        }
      }
    } else {
      for (let i = startingPointPlayer1; i <= endingPointPlayer1; i++) {
        if (board[i]?.includes(1)) {
          return 1; // Player 1 wins
        }
      }
    }
  
    return -1; // No winner yet
  };
  