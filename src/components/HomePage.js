// Lets rewrite the code above but make it
// actually work.

import React, { useState, useEffect } from "react";
import {
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
import { createStartingBoard } from "./Backgammon/gameUtils";

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

  const handleJoinGame = (gameKey, gameData) => {
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
    <div className="bg-gray-100 min-h-screen py-8">
      {isLoggedIn ? (
        <div className="container mx-auto px-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            onClick={handleStartBackgammonGame}
          >
            Start Backgammon
          </button>
          {/* Display waiting Backgammon games */}
          {waitingGames.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Waiting Games:</h2>
              <ul className="space-y-2">
                {waitingGames.map((game) => (
                  <li key={game.key}>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                      onClick={() => handleJoinGame(game.key, game)}
                    >
                      Join Game {game.key}
                    </button>
                    {/* Additional game details can be displayed here if needed */}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display in-progress Backgammon games */}
          {inProgressGames.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">In-Progress Games:</h2>
              <ul className="space-y-2">
                {inProgressGames.map((game) => (
                  <li key={game.key}>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                      onClick={() => navigate(`/backgammon/${game.key}`)}
                    >
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
