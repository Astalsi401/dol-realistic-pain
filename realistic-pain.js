const stateInvalid = (...states) => states.some((state) => state === undefined);

const penetratedPain = () => {
  // increase pain based on penetration states every turn in combat
  if (stateInvalid(V.vaginastate, V.anusstate, V.mouthstate, V.bodysize))
    return;
  const painStates = {
    penetrated: 1.5,
    doublepenetrated: 4,
    tentacle: 1.5,
    tentacledeep: 3,
  };
  const bodySizeModifier = {
    0: 1,
    1: 0.5,
    2: 0.1,
    3: 0,
  };
  let pain = 0;
  [V.vaginastate, V.anusstate].forEach((state) => {
    if (Object.keys(painStates).includes(state)) pain += painStates[state];
  }, 0);
  pain += Object.keys(painStates).includes(V.mouthstate)
    ? painStates[V.mouthstate] * 0.5
    : 0;
  statChange.pain(
    (pain / 2) * Object.keys(bodySizeModifier).includes(V.bodysize)
      ? bodySizeModifier[V.bodysize]
      : 0
  );
};

const painChangeByTime = (currentPain) =>
  -Math.max(0.39 * Math.exp(-0.0195 * currentPain), 0.02);

const tirednessChangeByPain = (currentPain) => {
  // max tiredness increase need to < 4
  return Math.max(0.00181 * Math.pow(currentPain, 1.45), 1);
};

const escapeAmount = () => {
  // decrease badend escape amount depending on pain and tiredness
  if (stateInvalid(V.pain, V.tiredness)) return 1;
  const currentPain = V.pain;
  const currentTiredness = V.tiredness;
  const tirednessModifier = Math.min(
    -0.0000001 * currentTiredness * currentTiredness -
      0.0002 * currentTiredness +
      1,
    1
  );
  const painModifier = Math.min(
    -0.000000001 * currentPain ** 4 +
      0.0000007 * currentPain ** 3 -
      0.0001275 * currentPain ** 2 +
      0.00075 * currentPain +
      1,
    1
  );
  return painModifier * tirednessModifier;
};
