import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, ref, set, onValue, auth } from "../../firebase";
import BackgammonBoard from "./components/BackgammonBoard";
import { get } from "firebase/database";
import BackgammonHeader from "./components/BackgammonHeader";
import { checkValidMove, checkWinner, makeMove } from "./gameLogic";
import { createStartingBoard, initializeBoard, rollDice } from "./gameUtils";
import BackgammonDice from "./components/BackgammonDice";

const convertBoardObjectToArray = (boardObject) => {
  const boardArray = new Array(24).fill().map(() => []); // Create an array of empty arrays

  // Loop through the board object and add the pieces to the board array
  for (const [pointIndex, point] of Object.entries(boardObject)) {
    boardArray[pointIndex] = point;
  }

  console.log("boardArray", boardArray);

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
  const [isRollDiceEnabled, setIsRollDiceEnabled] = useState(false); // New state variable
  const [isOpponentTurn, setIsOpponentTurn] = useState(false); // New state variable

  // Function to handle the dice roll
  const handleRollDice = () => {
    const diceResult = rollDice();
    setDiceValues(diceResult);
    setRemainingDiceValues(diceResult);

    // if the roll is a double
    if (diceResult[0] === diceResult[1]) {
      // set the remaining dice values to the double
      setRemainingDiceValues([...diceResult, ...diceResult]);
    }
  };

  const handleMakeMove = (sourcePoint, destinationPoint) => {
    // Check if the dice have been rolled
    if (diceValues.length === 0) {
      alert("Please roll the dice first.");
      return;
    }
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
    const direction = currentTurn === 0 ? 1 : -1;

    // Check if the move is valid
    const isValidMove = checkValidMove(
      sourcePoint,
      destinationPoint,
      currentTurn,
      gameData,
      direction,
      remainingDiceValues
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
      setIsMoveInProgress(false);
      setIsRollDiceEnabled(true);
      setPlayerTurn(currentTurn === 0 ? "black" : "white");
      setDiceValues([]);
      setRemainingDiceValues([]);

      // Update the database
      const databaseRef = ref(database, `backgammonGames/${gameKey}`);
      set(databaseRef, updatedGameData)
        .then(() => {
          console.log(
            "Move successfully made and game data updated in Firebase."
          );
        })
        .catch((error) => {
          console.error("Error updating Backgammon game data:", error);
        });
    }

    const winner = checkWinner(updatedBoard, currentTurn);
    if (winner !== -1) {
      console.log(`Player ${winner} wins!`);
      // You can handle the game end logic here, such as displaying a message or resetting the game.
    }
  };

  useEffect(() => {
    const databaseRef = ref(database, `backgammonGames/${gameKey}`);

    const unsubscribe = onValue(
      databaseRef,
      (snapshot) => {
        const gameData = snapshot.val();

        // Check if the gameData has the 'board' property and it's not undefined
        if (!gameData || !gameData.board) {
          // If board is not available or is undefined, initialize the board
          const updatedGameData = {
            ...gameData,
            board: createStartingBoard(),
          };

          // Convert the board object to array
          const gameBoard = convertBoardObjectToArray(updatedGameData.board);
          setGameData({ ...updatedGameData, board: gameBoard });
        } else {
          // Convert the board object to array
          const gameBoard = convertBoardObjectToArray(gameData.board);
          setGameData({ ...gameData, board: gameBoard });
        }

        // Fetch the current user (Assuming you have set up authentication)
        const currentUser = auth.currentUser;
        setCurrentUser(currentUser);

        // Determine if it's the current user's turn to roll the dice
        const isCurrentUserPlayer1 = currentUser.uid === gameData.player1;
        const isCurrentTurnPlayer1 = gameData.currentTurn === 0;
        const isUsersTurn = isCurrentUserPlayer1 === isCurrentTurnPlayer1;

        setIsOpponentTurn(!isUsersTurn); // Set the isOpponentTurn state

        // Enable or disable the "Roll Dice" button based on the current turn
        setIsRollDiceEnabled(isUsersTurn);
      },
      [gameKey]
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [gameKey]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <BackgammonHeader gameData={gameData} currentUser={currentUser} />
      {gameData ? (
        <div className="max-w-xl mx-auto py-8 px-4">
          <h2 className="text-2xl font-semibold mb-4">
            This is the Backgammon game page for game {gameKey}
          </h2>
          <div className="mb-4">
            {/* Display player emails or "pending" */}
            <h3 className="text-lg font-semibold mb-2">Players:</h3>
            <p>
              Player 1: {gameData.player1Email}
              <br />
              Player 2: {gameData.player2 ? gameData.player2Email : "Pending"}
            </p>
          </div>
          {diceValues.length > 0 ? (
            <div className="mb-4">
              {/* Display the rolled dice values */}
              <BackgammonDice diceValues={diceValues} />
              {/* Display the remaining dice values */}
              <div className="mt-2">
                Remaining Dice: {remainingDiceValues.join(", ")}
              </div>
            </div>
          ) : (
            <button
              onClick={handleRollDice}
              disabled={!isRollDiceEnabled}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Roll Dice
            </button>
          )}
          {gameData.board ? (
            <div className="flex justify-center items-center h-screen">
              <BackgammonBoard
                board={gameData.board}
                onMove={handleMakeMove}
                diceValues={diceValues}
                remainingDiceValues={remainingDiceValues}
                playerTurn={playerTurn}
              />
            </div>
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