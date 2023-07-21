import React from "react";

const BackgammonHeader = ({ gameData, currentUser }) => {
  const isPlayer1 = currentUser && currentUser.uid === gameData?.player1;
  const isPlayer2 = currentUser && currentUser.uid === gameData?.player2;

  const getPlayerColor = (playerId) => {
    if (playerId === gameData?.player1) {
      return "white";
    } else if (playerId === gameData?.player2) {
      return "black";
    }
    return "unknown";
  };

  const getTurnMessage = () => {
    if (gameData?.status === "in-progress") {
      if (gameData.currentTurn === 0) {
        return "White's Turn";
      } else if (gameData.currentTurn === 1) {
        return "Black's Turn";
      }
    } else if (gameData?.status === "finished") {
      if (gameData.winner === 0) {
        return "White Wins!";
      } else if (gameData.winner === 1) {
        return "Black Wins!";
      } else {
        return "Game Over";
      }
    }
    return "Waiting for Players";
  };

  return (
    <div className="p-4 bg-gray-300">
      <h1 className="text-3xl font-bold">Backgammon</h1>
      <div className="mt-4">
        {isPlayer1 && (
          <p className="text-lg">
            Player 1 (You): {getPlayerColor(gameData?.player1)}
          </p>
        )}
        {isPlayer2 && (
          <p className="text-lg">
            Player 2 (You): {getPlayerColor(gameData?.player2)}
          </p>
        )}
        {!isPlayer1 && !isPlayer2 && (
          <p className="text-lg">Guest (You): Spectating</p>
        )}
        <p className="text-lg">{getTurnMessage()}</p>
      </div>
    </div>
  );
};

export default BackgammonHeader;
