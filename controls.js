const config = {}

function colorize(element, ...colors) {
    let index = 0
    let html = '';
    element.innerText.split('').forEach((letter)=> {
        html += `<span class="${colors[index]}">${letter}</span>`;
        index += 1;
        if(index >= colors.length) {
            index = 0;
        }
    });
    return html;
}

const h1 = document.getElementById('title');
h1.innerHTML = colorize(h1, 'red', 'green', 'blue');

const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
const outputs = Array.from(document.querySelectorAll('output'));

function setSliderValue(id, value) {
    config[id] = parseInt(value);
    outputs.filter( (output)=> output.name === id)[0].value = value;
}

function resetSimulation() {
    if(simInterval) {
        clearInterval(simInterval);
    }
    creatures = [];
    food = [];
    resetSliderValue();
    clearCanvas();
    popBtn.disabled = false;
}

function resetSliderValue() {
    const defaultConfig = {
        redMin: 10,
        redMax: 20,
        greenMin: 10,
        greenMax: 20,
        blueMin: 10,
        blueMax: 20,
        foodMin: 20,
        foodMax: 50,
    }
    Object.entries(defaultConfig).forEach( ([key, value])=>{
        sliders.filter( (slider)=> slider.id === key)[0].value = value;
        outputs.filter( (output)=> output.name === key)[0].value = value;
        config[key] = parseInt(value);
    });
}

// Set the default values
sliders.forEach( (slider)=> {
    setSliderValue(slider.id, slider.value);
});

// Set the event listeners to modify the values
sliders.forEach( (slider)=> slider.addEventListener('change', ()=> {
    setSliderValue(event.target.id, event.target.value);
}));

popBtn.addEventListener('click', ()=> {
    populate(config);
});

document.getElementById('resetBtn').addEventListener('click', resetSliderValue);
document.getElementById('resetSimBtn').addEventListener('click', resetSimulation);