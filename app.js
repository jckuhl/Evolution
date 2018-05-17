const colorize = require('./dist/src/colorize');

const h1 = document.getElementById('title');
h1.innerHTML = colorize(h1, 'red', 'green', 'blue');

const Controller = require('./dist/src/controls');
const controls = new Controller();
controls.setSliderDefaults();
controls.setEventListeners();