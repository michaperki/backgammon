import React from "react";

const TicTacToeHeader = ({ gameData, currentUser }) => {
  if (!gameData) {
    // Handle the case when gameData is null
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
        <p className="text-sm">
          {gameData.status === "waiting"
            ? "Waiting for another player to join..."
            : gameData.status === "in-progress"
            ? `Game in progress: ${gameData.player1Email} vs ${gameData.player2Email}`
            : gameData.status === "finished"
            ? `Game over: ${gameData.winnerEmail} wins!`
            : ""}
        </p>
      </div>
      <div>
        {currentUser && currentUser.uid === gameData.currentTurn ? (
          <p className="text-sm">Your turn</p>
        ) : (
          <p className="text-sm">Opponent's turn</p>
        )}
      </div>
    </div>
  );
};

export default TicTacToeHeader;
