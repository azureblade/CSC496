'use strict';

var input = {
    2: 73,
    3: 1993,
    4: 12345,
    6: 'bad',
    7: {},
    8: [46, 7, 9, 24, 12, 3],
    9: {
        arg1: [1, 2, 3, 4, 5, 6, 7],
        arg2: 5
    },
    10: 20,
    11: -5,
    12: '2647522',
    13: [5, 'a', 'a', 'a', 3, 1, 'a', 4, 'a', 4, 4],
    14: { name: 'Matthew Wallace', age: 21, major: 'Computer Science' }
};

/*
 *  Problem 1
 */
function problemOne() {
    var radius = 45;

    var dia = 2 * radius;
    var cir = Math.PI * dia;
    var area = Math.PI * radius * radius;

    return 'Diameter: ' + dia + '<br>Circumference: ' + cir + '<br>Area: ' + area;
}

/*
 *  Problem 2
 */
function problemTwo(input) {
    return '' + getFahrenheit(input) + '&deg;F';

    function getFahrenheit(celcius) {
        return celcius * 9 / 5 + 32;
    }
}

/*
 *  Problem 3
 */
function problemThree(input) {
    var year = new Date().getFullYear();

    return newArr(birthday(input));

    function birthday(birthYear) {
        var year = new Date().getFullYear();

        return [year - birthYear - 1, year - birthYear];
    }
}

/*
 *  Problem 4
 */
function problemFour(input) {
    alert(reverse(input));

    return 'Done.';

    function reverse(number) {
        return number.toString().split('').reverse().join('');
    }
}

/*
 *  Problem 5
 */
function problemFive() {
    var numbers = [];

    for (var i = 0; i < 3; i++) {
        numbers.push(Math.floor(Math.random() * 1000) + 1);
    }

    return newArr(numbers) + '<br>' + Math.max.apply(Math, numbers);
}

/*
 *  Problem 6
 */
function problemSix(input) {
    return newArr(genetateCombo(input));

    function genetateCombo(str) {
        var combinations = [];

        combine('', str);

        combinations.sort(function (a, b) {
            return a.length - b.length;
        });

        return combinations;

        function combine(pre, str) {
            if (str.length > 0) {
                combinations.push(pre + str[0]);

                var rest = str.substring(1, str.length);

                combine(pre + str[0], rest);
                combine(pre, rest);
            }
        }
    }
}

/*
 *  Problem 7
 */
function problemSeven(input) {
    return getType(input);

    function getType(arg) {
        return typeof arg;
    }
}

/*
 *  Problem 8
 */
function problemEight(input) {
    var sec = findSec(input);

    return newArr(input) + '<br>Second Lowest: ' + sec.secondLowest + '<br>Second Greatest: ' + sec.secondGreatest;

    function findSec(arr) {
        arr.sort(function (a, b) {
            return a < b;
        });

        return {
            secondLowest: arr[arr.length - 2],
            secondGreatest: arr[1]
        };
    }
}

/*
 *  Problem 9
 */
function problemNine(arr, n) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < n) {
            arr.splice(i, 1);
            i--;
        }
    }

    return newArr(arr);
}

/*
 *  Problem 10
 */
function problemTen(n) {
    var numbers = [];
    var num = 0;

    while (numbers.length < n) {
        if (isHappyNum(num)) {
            numbers.push(num);
        }

        num++;
    }

    return newArr(numbers);
}

/*
 *  Problem 11
 */
function problemEleven(n) {
    var numbers = [];
    var num = 0;

    try {
        if (n < 0) {
            throw 'n cannot be negative.';
        }

        while (numbers.length < n) {
            if (isHappyNum(num)) {
                numbers.push(num);
            }

            num++;
        }
    } catch (err) {
        alert('Please enter a value greater than 0.');
    }

    return newArr(numbers);
}

var start = 0;
var maxNum = 1000;


/*
 *  Problem 12
 */
function problemTwelve(input) {
    return insertPlus(input);

    function insertPlus(number) {
        var arr = number.split('');

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] % 2 === 0 && arr[i - 1] % 2 === 0) {
                arr.splice(i, 0, '+');
                i--;
            }
        }

        return arr.join('');
    }
}

/*
 *  Problem 13
 */
function problemThirteen(input) {
    var max = frequent(input);

    return max.key + ': ' + max.value;

    function frequent(arr) {
        var count = {};

        for (var i in arr) {
            if (count[arr[i]]) {
                count[arr[i]]++;
            } else {
                count[arr[i]] = 1;
            }
        }

        var max = {
            key: '',
            value: 0
        };

        for (var i in count) {
            if (count[i] > max.value) {
                max.key = i;
                max.value = count[i];
            }
        }

        return max;
    }
}

/*
 *  Problem 14
 */
function problemFourteen(obj) {
    var output = '';

    for (var i in obj) {
        output += obj[i] + '<br>';
    }

    return output;
}
/*
* Helper functions
*/
function newArr(arr) {
    return '[' + arr.toString().replace(/,/g, ', ') + ']';
}

function isHappyNum(n) {
    var digits = n.toString().split('');
    var sum = 0;

    for (var i in digits) {
        sum += digits[i] * digits[i];
    }

    if (sum !== 1 && start < maxNum) {
        start++;

        return isHappyNum(sum);
    }

    start = 0;

    return sum === 1;
}


