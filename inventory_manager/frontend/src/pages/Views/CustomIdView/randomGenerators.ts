export const generateRandom32 = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0].toString(16);
};

export const generateRandom20 = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return (array[0] & 0xfffff).toString(16);
};

export const generateRandom6 = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateRandom9 = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};
