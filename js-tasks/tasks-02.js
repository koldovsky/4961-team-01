//1. https://www.codewars.com/kata/convert-a-string-to-an-array/train/javascript

function stringToArray(string) {
  const words = string.split(" ");
  return words;
}

//2. https://www.codewars.com/kata/dna-to-rna-conversion/train/javascript

function DNAtoRNA(dna) {
  let s = "";
  const len = dna.length;
  for (let i = 0; i < len; i++) {
    let c = dna.charAt(i);
    if (c == "T") {
      s += "U";
    } else {
      s += c;
    }
  }
  return s;
}

//3. https://www.codewars.com/kata/577a98a6ae28071780000989/train/javascript

var min = function (list) {
  let min = list[0];
  for (let i = 0; i < list.length; i++) {
    if (list[i] < min) {
      min = list[i];
    }
  }
  return min;
};

var max = function (list) {
  let max = list[0];
  for (let i = 0; i < list.length; i++) {
    if (list[i] > max) {
      max = list[i];
    }
  }
  return max;
};

//4. https://www.codewars.com/kata/544a54fd18b8e06d240005c0/train/javascript

function min(arr, toReturn) {
  let minValue = arr[0];
  let minIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }
  return toReturn == "value" ? minValue : minIndex;
}
