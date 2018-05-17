const Creature = require('./creature');
const Species = require('./species');
const Food = require('./food');
const random = require('./random');
const title = require('./title');

const popBtn = document.getElementById('popBtn');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const indivStats = document.getElementById('indivStats');
indivStats.style.visibility = 'hidden';

const redTotal = document.getElementById('redTotal');
const greenTotal = document.getElementById('greenTotal');
const blueTotal = document.getElementById('blueTotal');

const speciesSpan = document.getElementById('species');
const posXSpan = document.getElementById('posX');
const posYSpan = document.getElementById('posY');
const targetSpan = document.getElementById('target');

class Simulation {

    constructor() {
        this.paused = false;
        this.creatures = [];
        this.food = [];
        this.clicktargets = [];
        this.simInterval = null;
        this.selectedCreature = null;

        this.speciesList = {
            red: new Species({
                color: 'red',
                size: 10,
                aggro: 45,
                speed: 1
            }),
            green: new Species({
                color: 'green',
                size: 7,
                aggro: 40,
                speed: 2
            }),
            blue: new Species({
                color: 'blue',
                size: 5,
                aggro: 50,
                speed: 2.5
            })
        };
    }

    generateSpecies(species) {
        let posX = random(species.size, canvas.width - species.size);
        let posY = random(species.size, canvas.height - species.size);
        this.creatures.push(new Creature(species, posX, posY, this));
    }

    generateFood(amt) {
        while (this.food.length < amt) {
            let posX = random(3, canvas.width - 3);
            let posY = random(3, canvas.height - 3);
            this.food.push(new Food(posX, posY));
        }
    }

    trackStats() {
        let counter = {};
        this.creatures.forEach((creature) => {
            if (!counter[creature.species.color]) {
                counter[creature.species.color] = 1;
            } else {
                counter[creature.species.color] += 1;
            }
        });
        redTotal.innerText = counter.red;
        greenTotal.innerText = counter.green;
        blueTotal.innerText = counter.blue;
    }

    trackCreatureStats(creature) {
        speciesSpan.innerText = title(creature.species.color) + ' Circle'
        posXSpan.innerText = creature.x;
        posYSpan.innerText = creature.y;
        if (creature.target) {
            if (creature.target instanceof Food) {
                targetSpan.innerText = 'Food';
            } else {
                targetSpan.innerText = title(creature.target.species.color) + ' Circle';
            }
        } else {
            targetSpan.innerText = 'None';
        }
    }

    populate(opts = {
        redMin: 10,
        redMax: 20,
        greenMin: 10,
        greenMax: 20,
        blueMin: 10,
        blueMax: 20,
        foodMin: 20,
        foodMax: 50,
    }) {
        this.setEventListeners();

        const reds = random(opts.redMin, opts.redMax);
        const greens = random(opts.greenMin, opts.greenMax);
        const blues = random(opts.blueMin, opts.blueMax);
        const total = reds + blues + greens;

        popBtn.disabled = true;

        while (this.creatures.length < total) {
            if (this.creatures.length < reds) {
                this.generateSpecies(this.speciesList.red);
            } else if (this.creatures.length >= reds && this.creatures.length < reds + greens) {
                this.generateSpecies(this.speciesList.green);
            } else if (this.creatures.length >= reds + greens && this.creatures.length < total) {
                this.generateSpecies(this.speciesList.blue);
            }
        }
        this.generateFood(random(opts.foodMin, opts.foodMax));
        this.creatures.forEach(creature => creature.draw());
        this.food.forEach(munchie => munchie.draw());

        this.simInterval = setInterval(() => {
            if (!this.paused) {
                clearCanvas();
                this.creatures = this.creatures.filter(creature => creature.isAlive);
                this.food = this.food.filter(munchie => munchie.isAlive);
                this.creatures.forEach(creature => {
                    creature.detectLife();
                    creature.detectCollision();
                    creature.draw();
                });
                this.food.forEach(munchie => munchie.draw())
            }
            if (this.selectedCreature) {
                this.trackCreatureStats(this.selectedCreature);
                indivStats.style.visibility = 'visible';
                indivStats.className = this.selectedCreature.species.color;
            } else {
                indivStats.style.visibility = 'hidden';
            }
            this.trackStats();

        }, 33);
    }

    resetSimulation() {
        if (this.simInterval) {
            clearInterval(this.simInterval);
        }
        this.creatures = [];
        this.food = [];
        clearCanvas();
        popBtn.disabled = false;
    }

    clickCreature() {
        const clickTarget = {
            x: event.offsetX,
            y: event.offsetY
        }
        this.creatures.forEach((creature) => {
            if (creature.distanceTo(clickTarget) < creature.size + 5) {
                creature.selected = true;
                this.clicktargets.push(creature);
            } else {
                creature.selected = false;
            }
            if (this.clicktargets.length === 0) {
                this.selectedCreature = null;
            } else if (this.clicktargets.length >= 1) {
                this.selectedCreature = this.clicktargets[0];
                // this.clicktargets.shift();
                // this.clicktargets.forEach( (creature)=> creature.selected = false);
            }
            this.clicktargets = this.clicktargets.filter((creature) => creature.selected);
        });
    }

    setEventListeners() {
        canvas.addEventListener('click', () => this.clickCreature());
    }
}

module.exports = Simulation;