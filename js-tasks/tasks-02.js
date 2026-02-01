//1. https://www.codewars.com/kata/convert-a-string-to-an-array/train/javascript

const stringToArray = (string) => string.split(" ");

//2. https://www.codewars.com/kata/dna-to-rna-conversion/train/javascript

const DNAtoRNA = (dna) => dna.replace(/T/g, "U");

//3. https://www.codewars.com/kata/577a98a6ae28071780000989/train/javascript

const min = (list) => Math.min(...list);
const max = (list) => Math.max(...list);

//4. https://www.codewars.com/kata/544a54fd18b8e06d240005c0/train/javascript

const min = (arr, toReturn) => {
  return toReturn === "value"
    ? Math.min(...arr)
    : arr.indexOf(Math.min(...arr));
};
