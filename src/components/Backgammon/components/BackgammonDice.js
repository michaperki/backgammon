import React from "react";

const BackgammonDice = ({ diceValues }) => {
  // Add the dice rendering logic here
  return (
    <div>
      <h3>Dice Values:</h3>
      {diceValues.length > 0 ? (
        <p>{diceValues.join(", ")}</p>
      ) : (
        <button>Roll Dice</button>
      )}
    </div>
  );
};

export default BackgammonDice;
