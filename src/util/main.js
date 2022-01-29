const popRandomItem = arr => {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
};

export {popRandomItem};

