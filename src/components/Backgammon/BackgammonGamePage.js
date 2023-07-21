import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, ref, set, onValue, auth } from "../../firebase";
import BackgammonBoard from "./components/BackgammonBoard";
import { get } from "firebase/database";
import BackgammonHeader from "./components/BackgammonHeader";
import { checkValidMove, makeMove } from "./gameLogic";
import { initializeBoard, rollDice } from "./gameUtils";

const convertBoardObjectToArray = (boardObject) => {
  const boardArray = new Array(24).fill().map(() => []); // Create an array of empty arrays

  for (const key in boardObject) {
    const index = parseInt(key, 10);
    boardArray[index] = boardObject[key];
  }

  return boardArray;
};

const BackgammonGamePage = () => {
  const { gameKey } = useParams();
  const [gameData, setGameData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [diceValues, setDiceValues] = useState([]);
  const [remainingDiceValues, setRemainingDiceValues] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(""); // "black" or "white"
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [isMoveInProgress, setIsMoveInProgress] = useState(false); // New state variable

  // Function to handle the dice roll
  const handleRollDice = () => {
    // Roll the dice
    const diceResult = rollDice();
    setDiceValues(diceResult);
    setRemainingDiceValues(diceResult);
    setPlayerTurn(currentUser.uid === gameData.player1 ? "white" : "black");
  };

  const handleMakeMove = (sourcePoint, destinationPoint) => {
    if (isMoveInProgress) {
      // If a move is already in progress, prevent further execution
      return;
    }
    
    setIsMoveInProgress(true); // Set the move in progress flag

    // Check if the game is in progress
    if (gameData.status !== "in-progress") {
      alert("The game is not in progress!");
      return;
    }

    // Check if it's the current user's turn
    if (
      (currentUser.uid === gameData.player1 && gameData.currentTurn !== 0) ||
      (currentUser.uid === gameData.player2 && gameData.currentTurn !== 1)
    ) {
      alert("It's not your turn!");
      return;
    }

    // Determine the direction of movement based on the current player's turn
    const currentTurn = gameData.currentTurn;

    // Check if the move is valid
    const isValidMove = checkValidMove(
      sourcePoint,
      destinationPoint,
      currentTurn,
      remainingDiceValues,
      gameData
    );
    if (!isValidMove) {
      alert("Invalid move!");
      return;
    }

    // Make the move
    const updatedBoard = makeMove(
      sourcePoint,
      destinationPoint,
      currentTurn,
      gameData.board
    );
    if (!updatedBoard) {
      console.error("Invalid move. Destination point already has your piece.");
      return;
    }

    // Update remaining dice values
    const pointsMoved = Math.abs(destinationPoint - sourcePoint);
    const remainingValues = [...remainingDiceValues]; // Create a copy of remainingDiceValues
    const moveIndex = remainingValues.indexOf(pointsMoved);
    if (moveIndex !== -1) {
      remainingValues.splice(moveIndex, 1); // Remove the current move value from the copy
    }
    setRemainingDiceValues(remainingValues);

    // Switch turns if both moves have been made
    if (remainingValues.length === 0) {
      const updatedGameData = {
        ...gameData,
        board: updatedBoard,
        currentTurn: currentTurn === 0 ? 1 : 0,
      };

      setGameData(updatedGameData);
      setIsFirstMove(true);
      setPlayerTurn((prevPlayerTurn) =>
        prevPlayerTurn === "black" ? "white" : "black"
      );

      // Update the database
      const databaseRef = ref(database, `backgammonGames/${gameKey}`);
      set(databaseRef, updatedGameData)
        .then(() => {
          console.log(
            "Move successfully made and game data updated in Firebase."
          );

          setIsMoveInProgress(false); // Reset the move in progress flag
        })
        .catch((error) => {
          console.error("Error updating Backgammon game data:", error);

          setIsMoveInProgress(false); // Reset the move in progress flag in case of error
        });
    } else {
      setPlayerTurn(() => (currentTurn === 0 ? "black" : "white"));
      setIsMoveInProgress(false); // Reset the move in progress flag for normal moves
    }
  };

  useEffect(() => {
    const databaseRef = ref(database, `backgammonGames/${gameKey}`);

    const unsubscribe = onValue(databaseRef, (snapshot) => {
      const gameData = snapshot.val();

      // Check if the gameData has the 'board' property and it's not undefined
      if (!gameData || !gameData.board) {
        // If board is not available or is undefined, initialize the board
        const updatedGameData = {
          ...gameData,
          board: initializeBoard(),
        };

        // Convert the board object to array
        const gameBoard = convertBoardObjectToArray(updatedGameData.board);
        setGameData({ ...updatedGameData, board: gameBoard });
      } else {
        // Convert the board object to array
        const gameBoard = convertBoardObjectToArray(gameData.board);
        setGameData({ ...gameData, board: gameBoard });
      }
    });

    // Fetch the current user (Assuming you have set up authentication)
    const currentUser = auth.currentUser;
    setCurrentUser(currentUser);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [gameKey]);

  return (
    <div>
      <BackgammonHeader gameData={gameData} currentUser={currentUser} />
      {gameData ? (
        <div>
          <h2>This is the Backgammon game page for game {gameKey}</h2>
          <div>
            {/* Display player emails or "pending" */}
            <h3>Players:</h3>
            <p>
              Player 1: {gameData.player1Email}
              <br />
              Player 2: {gameData.player2 ? gameData.player2Email : "Pending"}
            </p>
          </div>
          {diceValues.length > 0 ? (
            <div>
              {/* Display the rolled dice values */}
              <h3>Dice Values:</h3>
              <p>{diceValues.join(", ")}</p>
            </div>
          ) : (
            <button onClick={handleRollDice}>Roll Dice</button>
          )}
          {gameData.board ? (
            <BackgammonBoard
              board={gameData.board}
              onMove={handleMakeMove}
              diceValues={diceValues}
              remainingDiceValues={remainingDiceValues}
              playerTurn={playerTurn}
            />
          ) : (
            <div>
              <h3>Waiting for the game to start...</h3>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default BackgammonGamePage;
