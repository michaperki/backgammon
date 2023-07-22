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

    // Check if the game is already over (win or draw)
    if (gameData.status !== "in-progress") {
      console.error("The game has already ended.");
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
    // Check rows for a winner
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        return board[i][0]; // Return the winner's symbol (X or O)
      }
    }

    // Check columns for a winner
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        return board[0][i]; // Return the winner's symbol (X or O)
      }
    }

    // Check diagonals for a winner
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return board[0][0]; // Return the winner's symbol (X or O)
    }
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return board[0][2]; // Return the winner's symbol (X or O)
    }

    // Check for a draw
    let isDraw = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) {
          isDraw = false;
          break;
        }
      }
      if (!isDraw) {
        break;
      }
    }

    if (isDraw) {
      return "draw";
    }

    // If no winner and not a draw, return "in-progress"
    return "in-progress";
  };

  return (
    <div>
      <TicTacToeHeader gameData={gameData} currentUser={currentUser} />
      {gameData ? ( // Check if gameData is not null
        <div>
          <h2>This is the TicTacToe game page for game {gameKey}</h2>
          <div>
            {/* Display player emails or "pending" */}
            <h3>Players:</h3>
            <p>
              Player 1: {gameData.player1Email}
              <br />
              Player 2: {gameData.player2 ? gameData.player2Email : "Pending"}
            </p>
          </div>
          {gameData.board ? ( // Check if gameData.board is not null
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
        <div>Loading...</div> // Display a loading message if gameData is null
      )}
    </div>
  );
};

export default TicTacToeGamePage;
