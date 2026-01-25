// https://www.codewars.com/kata/geometry-basics-circle-circumference-in-2d/train/javascript

const circleCircumference = (circle) => 2 * Math.PI * circle.radius;

// https://www.codewars.com/kata/training-js-number-12-loop-statement-for-dot-in-and-for-dot-of/train/javascript

function giveMeFive(obj) {
    const wordArray = [];
    for (const key in obj) {
        if (key.length === 5) wordArray.push(key);
        if (obj[key].length === 5) wordArray.push(obj[key]);
    }
    return wordArray;
}

// https://www.codewars.com/kata/understanding-closures-the-basics/train/javascript

function buildFun(n) {

    let res = []

    for (let i = 0; i < n; i++) {
        res.push(function() {
            return i;
        })
    }
    return res;
}