const identifierTypes = [
  //"%count% %adverb% %verb%ing %noun%",
  //"%adverb% %verb%ing %count% %noun%",
  //"%count% %verb%ing %noun%",
  //"%verb%ing %count% %noun%",
  //"%adverb% %verb%ing %noun%",
  //"%adverb% %verb% %count% %noun%",
  //"%verb% %count% %noun%",
  //"%verb%ing %noun%",
  //"%verb% %noun%",
  "%adjective% %noun% %count%",
  "%adjective% %noun%",
];
// short words best
const nouns = [
  // animals
  'llama', 'cat', 'toad', 'knight', 'ant', 'hippo', 'bovine', 'kitty', 'lizard',
  'beetle', 'bug', 'panther', 'cheetah', 'lion', 'tiger', 'horse', 'moose', 'raptor', 'dinosaur',
  'slug', 'snail', 'squid', 'fish', 'shark', 'whale', 'orca', 'gerbil', 'rat', 'hamster', 'dog',
  'bulldog', 'husky', 'terrier', 'retriever', 'pup', 'puppy',
  // food items
  'cupcake', 'cake', 'pie', 'pizza', 'burger', 'sandwich', 'roast', 'nugget', 'apple', 'grape',
  'berry', 'seed',
  // body parts
  'foot', 'tooth', 'finger', 'toe', 'ear', 'nose', 'armpit',
  // places
  'valley', 'kitchen', 'bathtub', 'tub', 'yard', 'hill', 'forest', 'river',
  // vehicles
  'boat', 'sled', 'car', 'bike', 'skateboard', 'snowboard', 'moped',
  // other
  'basket', 'shoe', 'shirt', 'skirt',
  // plants
  'tree', 'fruit', 'bush',
];
const verbs = [ // must work as [verb]ing e.g. fucking. Stick w/ physical
  'eat', 'kick', 'kiss', 'push', 'lick', 'pull', 'color', 'throw', 'chew'
];
const adverbs = [
  'eagerly', 'slowly', 'weirdly', 'kindly', 'slyly', 'firmly', 'quickly'
];
const adjectives = [
  // texture
  'smooth', 'rough', 'jagged', 'sharp', 'slippery', 'textured',
  // shape
  'square', 'oval', 'round',
  // colors
  'yellow', 'green', 'red', 'crimson', 'black', 'dark', 'bright', 'white', 'cream',
  'orange', 'blue', 'navy', 'purple', 'pink',
  // other
  'albino', 'greasy', 'lazy', 'crazy', 'creepy', 'scary', 'lovely', 'funny',
  // size
  'tiny', 'small', 'fat', 'skinny', 'large', 'huge', 'medium', 'normal',
];

function generate(min = 5, max = 99) {
  const randomType = random(0, identifierTypes.length - 1);
  const randomVerb = random(0, verbs.length - 1);
  const randomNoun = random(0, nouns.length - 1);
  const randomAdverb = random(0, adverbs.length - 1);
  const randomAdj = random(0, adjectives.length - 1);
  const randomCount = random(min, max);

  let randomIdentifier = identifierTypes[randomType];
  randomIdentifier = randomIdentifier.replace('%count%', randomCount);
  randomIdentifier = randomIdentifier.replace('%noun%', nouns[randomNoun]);
  randomIdentifier = randomIdentifier.replace('%adjective%', adjectives[randomAdj]);
  //randomIdentifier = randomIdentifier.replace('%verb%', verbs[randomVerb]);
  //randomIdentifier = randomIdentifier.replace('%adverb%', adverbs[randomAdverb]);

  return randomIdentifier;
}

function random(min, max) { // (0, 2) will have possible values 0,1,2
  const rangeMax = max - min + 1;
  return Math.floor(Math.random() * Math.floor(rangeMax)) + min;
}

module.exports = { random, generate };
