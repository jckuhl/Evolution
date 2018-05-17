module.exports = function title(string) {
    return string.split('').map((c, index) => {
        return index === 0 ? c.toUpperCase() : c;
    }).join('');
}