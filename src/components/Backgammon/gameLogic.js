export const checkValidMove = (
  sourcePoint,
  destinationPoint,
  currentTurn,
  diceValues,
  gameData
) => {
  // Check if the source point is valid
  if (sourcePoint < 0 || sourcePoint > 23) {
    console.log("Invalid source point");
    return false;
  }

  // Check if the destination point is valid
  if (destinationPoint < 0 || destinationPoint > 23) {
    console.log("Invalid destination point");
    return false;
  }

  // Check if the source point is empty
  if (gameData.board[sourcePoint].length === 0) {
    console.log("Source point is empty");
    return false;
  }

  // Check if the destination point has more than one of the opponent's piece
  if (
    gameData.board[destinationPoint].length > 1 &&
    gameData.board[destinationPoint][0] !== currentTurn
  ) {
    console.log("Destination point has more than one of the opponent's piece");
    console.log("Destination point:", destinationPoint);
    console.log("Destination point pieces:", gameData.board[destinationPoint]);
    console.log("Current turn:", currentTurn);
    return false;
  }

  // Check if the direction of movement is valid based on the player's turn
  if (
    (currentTurn === 0 && destinationPoint > sourcePoint) || // White moves from higher to lower index
    (currentTurn === 1 && destinationPoint < sourcePoint) // Black moves from lower to higher index
  ) {
    console.log("Invalid move. Incorrect direction of movement.");
    return false;
  }

  // Calculate the number of points the piece is moving
  const pointsToMove = Math.abs(destinationPoint - sourcePoint);

  // Check if the piece can move the correct number of points based on the dice roll
  if (!diceValues.includes(pointsToMove)) {
    console.log("Invalid move. Incorrect number of points moved.");
    return false;
  }

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

  // Check if the destination point has the current user's piece
  if (
    destinationPointPieces.length > 0 &&
    destinationPointPieces[0] === currentTurn
  ) {
    console.error("Invalid move. Destination point already has your piece.");
    return null;
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
