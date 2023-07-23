export const createStartingBoard = () => {
  // create the starting board
  const startingBoard = {
    0: [], // White bar
    1: [1, 1, 1, 1, 1],
    2: [],
    3: [],
    4: [],
    5: [2, 2, 2],
    6: [],
    7: [2, 2, 2, 2, 2],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [1, 1],
    13: [2, 2],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [1, 1, 1, 1, 1],
    19: [],
    20: [1, 1, 1],
    21: [],
    22: [],
    23: [],
    24: [2, 2, 2, 2, 2],
    25: [], // Black bar
    26: [], // White bear off
    27: [], // Black bear off
  };

  return startingBoard;
};

export const rollDice = () => {
  // Roll two dice (d6)
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
};

export const reverseIndex = (index) => {
  // Add logic to reverse the index here
  // Assuming the board has 24 points, the formula to reverse the index is:
  return 23 - index;
};
