const rollDice = () => {
  // Roll two dice (d6)
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
};

export { rollDice };