class Controller {
    constructor() {
        this.simulation = null;
        this.sliders = Array.from(document.querySelectorAll('input[type="range"]'));
        this.outputs = Array.from(document.querySelectorAll('output'));
        this.config = {};
    }

    setSliderValue(id, value) {
        this.config[id] = parseInt(value);
        this.outputs.filter((output) => output.name === id)[0].value = value;
    }
    
    setSliderMax() {
        this.sliders.forEach((slider)=> {
            this.setSliderValue(slider.id, slider.max);
            slider.value = slider.max;
        })
    }

    setSliderMin() {
        this.sliders.forEach((slider)=> {
            this.setSliderValue(slider.id, slider.min);
            slider.value = slider.min;
        })
    }

    setSliderDefaults() {
        this.sliders.forEach((slider) => {
            this.setSliderValue(slider.id, slider.value);
        });
    }

    setSliderEventListeners() {
        this.sliders.forEach((slider) => slider.addEventListener('change', () => {
            controls.setSliderValue(event.target.id, event.target.value);
        }));
    }

    togglePause() {
        this.simulation.paused = !this.simulation.paused;
    }

    resetSliderValue() {
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
        Object.entries(defaultConfig).forEach(([key, value]) => {
            this.sliders.filter((slider) => slider.id === key)[0].value = value;
            this.outputs.filter((output) => output.name === key)[0].value = value;
            this.config[key] = parseInt(value);
        });
    }

    startSimulation() {
        this.simulation = new Simulation();
        this.simulation.populate(this.config);
    }

    setEventListeners() {
        this.setSliderEventListeners();
        popBtn.addEventListener('click', () => controls.startSimulation());
        document.getElementById('resetBtn').addEventListener('click', ()=> controls.resetSliderValue());
        document.getElementById('maxBtn').addEventListener('click', ()=> controls.setSliderMax());
        document.getElementById('minBtn').addEventListener('click', ()=> controls.setSliderMin());
        document.getElementById('pauseBtn').addEventListener('click', ()=> controls.togglePause());
    }
}

const controls = new Controller();
controls.setSliderDefaults();
controls.setEventListeners();