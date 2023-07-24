export const createStartingBoard = () => {
  // create the starting board
  const startingBoard = {
    0: [], // White bar
    1: [1, 1],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [2, 2, 2, 2, 2],
    7: [],
    8: [2, 2, 2],
    9: [],
    10: [],
    11: [],
    12: [1, 1, 1, 1, 1],
    13: [2, 2, 2, 2, 2],
    14: [],
    15: [],
    16: [],
    17: [1, 1, 1],
    18: [],
    19: [1, 1, 1, 1, 1],
    20: [],
    21: [],
    22: [],
    23: [],
    24: [2, 2],
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

export const divideBoardArray = (board) => {
  // Convert the board object to an array of points with their respective pieces
  const points = Object.entries(board);

  const whiteBearOff = points[25];
  const blackBearOff = points[26];

  const whiteBar = [1];
  const blackBar = [1];

  // Divide the points array into two rows
  const firstRowPoints = points.slice(1, 13);
  const secondRowPoints = points.slice(13, 25);

  return {
    whiteBearOff,
    blackBearOff,
    whiteBar,
    blackBar,
    firstRowPoints,
    secondRowPoints,
  };
};
