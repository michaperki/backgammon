import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, ref, set, onValue, auth } from "../../firebase";
import Board from "./TicTacToeBoard";
import { get } from "firebase/database";
import TicTacToeHeader from "./TicTacToeHeader";

const TicTacToeGamePage = () => {
  const { gameKey } = useParams();
  const [gameData, setGameData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleMakeMove = (row, col) => {
    // Check if currentUser is not null
    if (!currentUser) {
      console.error("User not authenticated.");
      return;
    }

    // Fetch the latest game data from the database
    const databaseRef = ref(database, `ticTacToeGames/${gameKey}`);
    get(databaseRef)
      .then((snapshot) => {
        const gameData = snapshot.val();
        if (gameData) {
          // Check if it's the current user's turn
          if (gameData.currentTurn === currentUser.uid) {
            // Check if the selected cell is empty
            if (gameData.board[row][col] === "") {
              // Update the game board in the database
              const updatedBoard = [...gameData.board];
              if (gameData.currentTurn === gameData.player1) {
                updatedBoard[row][col] = "X";
              } else {
                updatedBoard[row][col] = "O";
              }

              // Check the game status
              const gameStatus = checkGameStatus(updatedBoard);

              const updatedGameData = {
                ...gameData,
                board: updatedBoard,
              };

              if (gameStatus === "in-progress") {
                // The game is still ongoing, update the game data in the database
                const nextTurn =
                  gameData.currentTurn === gameData.player1
                    ? gameData.player2
                    : gameData.player1;
                updatedGameData.currentTurn = nextTurn;
              } else {
                // The game has ended, update the game status in the database
                updatedGameData.status = gameStatus;
              }

              set(ref(database, `ticTacToeGames/${gameKey}`), updatedGameData)
                .then(() => {
                  // No need to log this in the console
                })
                .catch((error) => {
                  console.error("Error updating TicTacToe game data:", error);
                });
            } else {
              console.error("Cell is not empty");
            }
          } else {
            console.error("It's not your turn");
          }
        } else {
          console.error("Game does not exist");
        }
      })
      .catch((error) => {
        console.error("Error getting TicTacToe game data:", error);
      });
  };

  useEffect(() => {
    const databaseRef = ref(database, `ticTacToeGames/${gameKey}`);

    const unsubscribe = onValue(databaseRef, (snapshot) => {
      const gameData = snapshot.val();
      setGameData(gameData);
    });

    // Fetch the current user (Assuming you have set up authentication)
    const currentUser = auth.currentUser;
    setCurrentUser(currentUser);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [gameKey]);

  const createEmptyBoard = () => {
    return Array(3).fill(Array(3).fill(null));
  };

  // Implement a function to check the game status (win, draw, in-progress)
  const checkGameStatus = (board) => {
    // Implement your TicTacToe game status checking logic here
    // For example, you can check for winning combinations, a draw, or an ongoing game
    // Return "in-progress" if the game is still ongoing
    // Return the winning user's ID if there's a winner
    // Return "draw" if the game ends in a draw

    // Example implementation:
    // ... (your logic here)

    return "in-progress";
  };

  return (
    <div className="container mx-auto my-4">
      {gameData ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            This is the TicTacToe game page for game {gameKey}
          </h2>
          <TicTacToeHeader gameData={gameData} currentUser={currentUser} />
          {gameData.board ? (
            <Board board={gameData.board} onSquareClick={handleMakeMove} />
          ) : (
            <div>
              {/* Render an empty board if gameData.board is not available */}
              <Board
                board={createEmptyBoard()}
                onSquareClick={handleMakeMove}
              />
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TicTacToeGamePage;
