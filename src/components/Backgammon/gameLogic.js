import { reverseIndex } from "./gameUtils";

export const checkValidMove = (
    sourcePoint,
    destinationPoint,
    currentTurn,
    gameData,
    direction
  ) => {
    console.log("sourcePoint", sourcePoint);
    console.log("destinationPoint", destinationPoint);
    console.log("currentTurn", currentTurn);
    console.log("gameData", gameData);
    console.log("direction", direction);
  
    // turn 0 is the white player, turn 1 is the black player
    // pieces are represented by 1 for white and 2 for black
    const turnToColor = currentTurn + 1;
  
    // Get the correct source and destination points based on the direction
    const correctedSourcePoint = reverseIndex(sourcePoint);
    const correctedDestinationPoint = reverseIndex(destinationPoint);
  
    // sourcePointPieces and destinationPointPieces are the pieces on the board
    const sourcePointPieces = gameData.board[correctedSourcePoint];
    const destinationPointPieces = gameData.board[correctedDestinationPoint];
  
    // If the sourcePoint is empty, return false
    if (sourcePointPieces.length === 0) {
        console.log("sourcePointPieces.length === 0");
      return false;
    }
  
    // If the sourcePoint is not the current player's turn, return false
    if (sourcePointPieces[0] !== turnToColor) {
        console.log("sourcePointPieces[0] !== turnToColor");
      return false;
    }
  
    // If the destinationPoint has more than one of the opponent's piece
    // and the destinationPoint is not the current player's turn, return false
    if (
      destinationPointPieces.length > 1 &&
      destinationPointPieces[0] !== turnToColor
    ) {
        console.log("destinationPointPieces.length > 1 && destinationPointPieces[0] !== turnToColor");
      return false;
    }
  
    // If the destinationPoint is greater than 23 or less than 0, return false
    if (correctedDestinationPoint > 23 || correctedDestinationPoint < 0) {
        console.log("correctedDestinationPoint > 23 || correctedDestinationPoint < 0");
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
    destinationPointPieces[0] !== currentTurn
  ) {
    // If the destination point has the opponent's piece, remove it
    destinationPointPieces.shift();
  }

  // Move only one piece from the source to the destination point
  const movedPiece = sourcePointPieces.pop();
  destinationPointPieces.push(movedPiece);

  // Update the board
  const updatedBoard = {
    ...board,
    [sourcePoint]: sourcePointPieces,
    [destinationPoint]: destinationPointPieces,
  };

  return updatedBoard;
};
