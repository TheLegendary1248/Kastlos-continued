//This JS file contains just miscellanous, utility functions
/**
 * Selects a random number between min and max
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function Random(min, max)
{
    return (Math.random() * (max - min)) + min
}
/**
 * A simple delay function to attach a callback to a promise
 * @param {Number} time 
 * @returns {Promise}
 */
function Delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

//https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another Move an array element from one index to another
//I mean, i would've come up with this, but i was wondering if js was "feature-rich" enough to have a function with native code to deal with this
/**
 * Moves an element in an array from one index to another
 * @param {Array} arr 
 * @param {Number} fromIndex 
 * @param {Number} toIndex 
 */
function Arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
/**
 * 
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} t 
 * @returns {Number}
 */
function Lerp(a, b, t)
{ return a + (b - a) * t}