// Lets rewrite the code above but make it
// actually work.

import React, { useState, useEffect } from "react";
import {
  auth,
  database,
  set,
  onValue,
  ref,
  push,
  query,
  equalTo,
  orderByChild,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import { get } from "firebase/database";
import BackgammonGamePage from "./Backgammon/BackgammonGamePage";

const Home = ({ isLoggedIn, user }) => {
  const navigate = useNavigate();
  const [waitingGames, setWaitingGames] = useState([]);
  const [inProgressGames, setInProgressGames] = useState([]);

  const handleStartBackgammonGame = () => {
    if (user) {
      // Create a new Backgammon game in the database and get its unique key
      const newGameRef = push(ref(database, "backgammonGames"));
      const gameKey = newGameRef.key;

      // Save the game details to the database
      const newGame = {
        player1: user.uid,
        player1Email: user.email,
        status: "waiting", // Set the initial status to "waiting"
        currentTurn: 0,
      };

      // Get the starting board with integers
      newGame.board = createStartingBoard();

      set(newGameRef, newGame)
        .then(() => {
          navigate(`/backgammon/${gameKey}`);
        })
        .catch((error) => {
          console.error("Error creating Backgammon game:", error);
        });
    } else {
      console.error("User not logged in");
    }
  };

  const handleJoinBackgammonGame = (gameKey, gameData) => {
    if (user && user.uid) {
      // Check if the game is still waiting
      if (gameData.status === "waiting") {
        // Join the game
        joinGame(gameKey, gameData);
      } else {
        console.error("Game is no longer waiting");
      }
    } else {
      console.error("User not logged in");
    }
  };

  const joinGame = (gameKey, gameData) => {
    if (user && user.uid) {
      // User is logged in and has a valid UID, continue with the logic

      // Update the game data in the database
      const updatedGameData = {
        ...gameData,
        player2: user.uid,
        player2Email: user.email,
        status: "in-progress", // Set the status to "in-progress"
      };

      // Update the game data in Firebase
      set(ref(database, `backgammonGames/${gameKey}`), updatedGameData)
        .then(() => {
          navigate(`/backgammon/${gameKey}`);
        })
        .catch((error) => {
          console.error("Error updating Backgammon game data:", error);
        });
    } else {
      console.error("User not logged in or invalid UID");
    }
  };

  const createStartingBoard = () => {
    // create the starting board
    const startingBoard = {
      0: [1, 1, 1, 1, 1],
      1: [],
      2: [],
      3: [],
      4: [2, 2, 2],
      5: [],
      6: [2, 2, 2, 2, 2],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [1, 1],
      12: [2, 2],
      13: [],
      14: [],
      15: [],
      16: [],
      17: [1, 1, 1, 1, 1],
      18: [],
      19: [1, 1, 1],
      20: [],
      21: [],
      22: [],
      23: [2, 2, 2, 2, 2],
    };
  
    return startingBoard;
  };
  

  useEffect(() => {
    // Fetch the list of waiting games from the database
    const waitingGamesQuery = query(
      ref(database, "backgammonGames"),
      orderByChild("status"),
      equalTo("waiting")
    );

    onValue(waitingGamesQuery, (snapshot) => {
      const waitingGames = snapshot.val();
      if (waitingGames) {
        // Convert the waiting games object into an array
        const waitingGamesArray = Object.entries(waitingGames).map(
          ([key, value]) => {
            return { key, ...value };
          }
        );

        // Update the waiting games state
        setWaitingGames(waitingGamesArray);
      } else {
        // No waiting games found, update the waiting games state to an empty array
        setWaitingGames([]);
      }

      // Fetch the list of in-progress games from the database
      const inProgressGamesQuery = query(
        ref(database, "backgammonGames"),
        orderByChild("status"),
        equalTo("in-progress")
      );

      onValue(inProgressGamesQuery, (snapshot) => {
        const inProgressGames = snapshot.val();
        if (inProgressGames) {
          // Convert the in-progress games object into an array
          const inProgressGamesArray = Object.entries(inProgressGames).map(
            ([key, value]) => {
              return { key, ...value };
            }
          );
          // Update the in-progress games state
          setInProgressGames(inProgressGamesArray);
        } else {
          // No in-progress games found, update the in-progress games state to an empty array
          setInProgressGames([]);
        }
      });
    });
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <button onClick={handleStartBackgammonGame}>Start Backgammon</button>

          {/* Display waiting TicTacToe games */}
          {waitingGames.length > 0 && (
            <div>
              <h2>Waiting Games:</h2>
              <ul>
                {waitingGames.map((game) => (
                  <li key={game.key}>
                    <button
                      onClick={() => handleJoinBackgammonGame(game.key, game)}
                    >
                      Join Game {game.key}
                    </button>
                    {/* Additional game details can be displayed here if needed */}
                  </li>
                ))}
              </ul>

              <hr />
            </div>
          )}

          {/* Display in-progress TicTacToe games */}
          {inProgressGames.length > 0 && (
            <div>
              <h2>In-Progress Games:</h2>
              <ul>
                {inProgressGames.map((game) => (
                  <li key={game.key}>
                    <button onClick={() => navigate(`/backgammon/${game.key}`)}>
                      Continue Game {game.key}
                    </button>
                    {/* Additional game details can be displayed here if needed */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>{/* Show something for non-logged-in users */}</div>
      )}
    </div>
  );
};

export default Home;
