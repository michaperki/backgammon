import React from "react";

const BackgammonDice = ({ diceValues }) => {
  // Add the dice rendering logic here
  return (
    <div className="text-center mt-4">
      <h3 className="text-lg font-semibold mb-2">Dice Values:</h3>
      <div className="flex items-center justify-center">
        {diceValues.length > 0 ? (
          diceValues.map((value, index) => (
            <div
              key={index}
              className="dice-border bg-white w-16 h-16 rounded-md border border-gray-400 flex items-center justify-center mx-1"
            >
              <span className="text-3xl font-bold">{value}</span>
            </div>
          ))
        ) : (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
            Roll Dice
          </button>
        )}
      </div>
    </div>
  );
};

export default BackgammonDice;
