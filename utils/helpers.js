export const makeCols = (arr) => {
  return [...arr.map((el, ind) => el)];
};

export const noOfParams = (numb) => {
  return new Array(numb).fill('?');
};
