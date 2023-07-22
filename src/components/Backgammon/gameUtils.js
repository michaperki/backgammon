export const initializeBoard = () => {
  const emptyBoard = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: [],
    23: [],
  };
  return emptyBoard;
};

export const createStartingBoard = () => {
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
