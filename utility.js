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
function RandomWithinArena () { return new Vec2(-(ArenaSize/2), (ArenaSize/2)) }
/**
 * A simple delay function to attach a callback to a promise
 * @param {Number} time Milliseconds to set the delay to 
 * @param {Function} func Function to call at end of delay. Automatically wrapped with arrow functions
 * @returns {Promise} Returns the promise with the set delay, and will call the callback given, if supplied
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
 * Linear interpolation from value a to b by t
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} t 
 * @returns {Number}
 */
function Lerp(a, b, t) //https://docs.unity3d.com/ScriptReference/Vector3.Lerp.html It's C#, yes, but the psuedo code provided works by itself anyways
{ return a + (b - a) * t}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
/**
 * 
 * https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
 */
function sortedIndex(array, value) {
    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid] < value) low = mid + 1;
        else high = mid;
    }
    return low;
}

