module.exports = function random(min = 0, max) {
    if (min > max) {
        let temp = max;
        max = min;
        min = temp;
    }
    return Math.floor(Math.random() * (max - min) + min);
}