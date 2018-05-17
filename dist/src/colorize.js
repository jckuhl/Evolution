module.exports = function colorize(element, ...colors) {
    let index = 0
    let html = '';
    element.innerText.split('').forEach((letter) => {
        html += `<span class="${colors[index]}">${letter}</span>`;
        index += 1;
        if (index >= colors.length) {
            index = 0;
        }
    });
    return html;
}
