const identifierTypes = [
  "%count% %adverb% %verb%ing %noun%",
  "%adverb% %verb%ing %count% %noun%",
  "%count% %verb%ing %noun%",
  "%verb%ing %count% %noun%",
  "%adverb% %verb%ing %noun%",
  "%adverb% %verb% %count% %noun%",
  "%verb% %count% %noun%",
  "%verb%ing %noun%",
  "%verb% %noun%"
];
// short words best
const nouns = [ // plural
  'llamas', 'cats', 'toads', 'cupcakes', 'knights', 'ants', 'hippos', 'feet'
];
const verbs = [ // must work as [verb]ing e.g. fucking. Stick w/ physical
  'eat', 'kick', 'kiss', 'push', 'lick', 'pull', 'color', 'throw', 'chew'
];
const adverbs = [
  'eagerly', 'slowly', 'weirdly', 'kindly', 'slyly', 'firmly', 'quickly'
];

function generate(min = 5, max = 99) {
  const randomType = random(0, identifierTypes.length - 1);
  const randomVerb = random(0, verbs.length - 1);
  const randomNoun = random(0, nouns.length - 1);
  const randomAdverb = random(0, adverbs.length -1);
  const randomCount = random(min, max);

  let randomIdentifier = identifierTypes[randomType];
  randomIdentifier = randomIdentifier.replace('%count%', randomCount);
  randomIdentifier = randomIdentifier.replace('%noun%', nouns[randomNoun]);
  randomIdentifier = randomIdentifier.replace('%verb%', verbs[randomVerb]);
  randomIdentifier = randomIdentifier.replace('%adverb%', adverbs[randomAdverb]);

  return randomIdentifier;
}

function random(min, max) { // (0, 2) will have possible values 0,1,2
  const rangeMax = max - min + 1;
  return Math.floor(Math.random() * Math.floor(rangeMax)) + min;
}

module.exports = { random, generate };
