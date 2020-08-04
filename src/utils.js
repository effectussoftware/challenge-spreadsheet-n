const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const ERROR = "INVALID ENTRY";

export const isNumber = RegExp("^\\-?[0-9]+$");
export const isCell = RegExp("^[A-Z]+[1-9][0-9]*$");
export const isFunction = RegExp("^=.+");
export const startsWithOperator = RegExp("^[+-]");

export const createSpreadsheet = (N) => {
  let res = [];
  for (let i = 0; i <= N; i++) {
    res[i] = [];
    for (let j = 0; j <= N; j++) {
      res[i][j] = { func: "", value: "" };
    }
  }
  return res;
};

export const getColumnLabel = (n) => {
  let string = "";
  while (n >= 0) {
    string = `${alphabet[n % alphabet.length]}${string}`;
    n = Math.floor(n / alphabet.length) - 1;
  }
  return string;
};

const getColumnNumber = (column) => {
  const lastLetter = column[column.length - 1];
  const alphIndex = alphabet.findIndex((l) => l === lastLetter) + 1;
  if (column.length === 1) {
    return alphIndex;
  } else if (column.length > 1) {
    return (
      alphIndex * alphabet.length +
      getColumnNumber(column.substring(0, column.length - 1))
    );
  }
};

export const getCellValue = (cellName, matrix) => {
  const letter = cellName.match(/[a-zA-Z]+/g)[0];
  const number = cellName.match(/\d+/g)[0];
  let col = 0;
  col = getColumnNumber(letter);
  return matrix[number][col].value;
};
