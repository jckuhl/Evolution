const color = {
    red: 'red',
    green: 'green',
    blue: 'blue'
};

// test object that makes the simulation run only a few times
// set on to true to throttle the simulation
// count limits the number of frames the simulation runs.
const throttle = {
    on: false,
    count: 1
}

let creatures = [];
let food = [];
const canvas = document.querySelector('canvas');
const popBtn = document.getElementById('popBtn');
const context = canvas.getContext('2d');
let simInterval;

function random(min=0, max) {
    if (min > max) {
        let temp = max;
        max = min;
        min = temp;
    }
    return Math.floor(Math.random() * (max - min) + min);
}


function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Food pellets creatures seek
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }

    draw() {
        context.beginPath();
        context.rect(this.x, this.y, 3, 3);
        context.fillStyle = 'yellow';
        context.fill();
        context.strokeStyle = 'yellow';
        context.lineWidth = 1;
        context.stroke();
    }
}

//defines a creature's species
//traits that every creature of a species share.
class Species {
    constructor(props = {
        color,
        size,
        aggro,
        speed
    }) {
        this.color = props.color;
        this.size = props.size;
        this.aggro = props.aggro;
        this.speed = props.speed;
    }
}

// simple creatures that move randomly, search for food
// and eat or flee from creatures of a different species
// depending on size.

class Creature {
    constructor(species, x, y) {
        this.x = x;
        this.y = y;
        this.species = species;
        this.targets = [];
        this.target = null;
        this.isAlive = true;
        this.size = species.size;
        this.direction = 'north';
        this.counter = 0;
    }

    static getDirection(dir='all') {
        let directions = [
            "north",
            "northeast",
            "east",
            "southeast",
            "south",
            "southwest",
            "west",
            "northwest"
        ]
        const filterDirections = (news)=> directions.filter((direction)=> direction.includes(news))
        switch(dir) {
            case 'north':
                directions = filterDirections('north');
                break;
            case 'south':
                directions = filterDirections('south');
                break;
            case 'east':
                directions = filterDirections('east');
                break;
            case 'west':
                directions = filterDirections('west');
                break;
            default:
                break;
        }
        return directions[random(0, directions.length-1)];
    }

    constrain() {
        if(this.x < this.size) {
            this.x = this.size;
            //Get westwardly directions
            this.direction = Creature.getDirection('west');
        }
        if(this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
            //Get eastwardly directions
            this.direction = Creature.getDirection('east');
        }
        if(this.y < this.size) {
            this.y = this.size;
            // Get a southern direction
            this.direction = Creature.getDirection('south');
        }
        if(this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size;
            // Get a northern direction
            this.direction = Creature.getDirection('north');
        }
    }

    // find the closest target, and if targets are at equal distance, pick at random.
    closest(targets) {
        let minDist = 1000000;
        let myTarget = null;
        targets.forEach(target => {
            let distance = this.distanceTo(target);
            if (distance < minDist) {
                minDist = distance;
                myTarget = target;
            }
        });
        return myTarget;
    }

    detectCollision() {
        if (this.isAlive && this.targets.length !== 0) {
            this.targets.forEach((target) => {
                if (this.distanceTo(target) < this.size) {
                    if (target.size > this.size) {
                        target.size += 1;
                        this.isAlive = false;
                    } else {
                        this.size += 1;
                        target.isAlive = false;
                    }
                }
            });
        }
    }

    detectLife() {
        if (this.isAlive) {
            this.targets = creatures.concat(food);
            this.targets = this.targets.filter((target) => {
                let isInRange = this.distanceTo(target) < this.species.aggro;
                let isNotSameSpecies = false;
                if (target instanceof Creature) {
                    isNotSameSpecies = this.species.color !== target.species.color;
                } else if (target instanceof Food) {
                    isNotSameSpecies = true;
                }
                return target !== this && isInRange && isNotSameSpecies;
            });
            if (this.targets.length === 0) {
                //pick a random direction
                if(this.counter === 0) {
                    this.direction = Creature.getDirection();
                    this.counter = random(50, 250);
                }
                switch (this.direction) {
                    case 'north':
                        this.x += 0;
                        this.y -= this.species.speed;
                        break;
                    case 'northeast':
                        this.x += this.species.speed;
                        this.y -= this.species.speed;
                        break;
                    case 'east':
                        this.x += this.species.speed;
                        this.y += 0;
                        break;
                    case 'southeast':
                        this.x += this.species.speed;
                        this.y += this.species.speed;
                        break;
                    case 'south':
                        this.x += 0;
                        this.y += this.species.speed;
                        break;
                    case 'southwest':
                        this.x -= this.species.speed;
                        this.y += this.species.speed;
                        break;
                    case 'west':
                        this.x -= this.species.speed;
                        this.y -= 0;
                        break;
                    case 'northwest':
                        this.x -= this.species.speed;
                        this.y -= this.species.speed;
                        break;
                }
                this.constrain();
                this.counter -= 1;
            } else {
                this.target = this.closest(this.targets);
                if (this.target.size < this.size) {
                    //if bigger, chase
                    if (this.target.x < this.x) {
                        this.x -= this.species.speed;
                    } else {
                        this.x += this.species.speed;
                    }
                    if (this.target.y < this.y) {
                        this.y -= this.species.speed;
                    } else {
                        this.y += this.species.speed;
                    }
                } else {
                    //if not, run away
                    if (this.target.x < this.x) {
                        this.x += this.species.speed;
                    } else {
                        this.x -= this.species.speed;
                    }
                    if (this.target.y < this.y) {
                        this.y += this.species.speed;
                    } else {
                        this.y -= this.species.speed;
                    }
                }
                this.constrain();
            }
        }
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        context.fillStyle = this.species.color;
        context.fill();
        context.strokeStyle = this.species.color;
        context.lineWidth = 1;
        context.stroke();
    }

    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
}


const speciesList = {
    red: new Species({
        color: color.red,
        size: 10,
        aggro: 45,
        speed: 1
    }),
    green: new Species({
        color: color.green,
        size: 7,
        aggro: 40,
        speed: 2
    }),
    blue: new Species({
        color: color.blue,
        size: 5,
        aggro: 50,
        speed: 2.5
    })
};

function generateSpecies(species) {
    let posX = random(species.size, canvas.width - species.size);
    let posY = random(species.size, canvas.height - species.size);
    creatures.push(new Creature(species, posX, posY));
}

function generateFood(amt) {
    while (food.length < amt) {
        let posX = random(3, canvas.width - 3);
        let posY = random(3, canvas.height - 3);
        food.push(new Food(posX, posY));
    }
}

function populate(opts = {
    redMin: 10,
    redMax: 20,
    greenMin: 10,
    greenMax: 20,
    blueMin: 10,
    blueMax: 20,
    foodMin: 20,
    foodMax: 50,
}) {
    const reds = random(opts.redMin, opts.redMax);
    const greens = random(opts.greenMin, opts.greenMax);
    const blues = random(opts.blueMin, opts.blueMax);
    const total = reds + blues + greens;

    popBtn.disabled = true;

    while (creatures.length < total) {
        if (creatures.length < reds) {
            generateSpecies(speciesList.red);
        } else if (creatures.length >= reds && creatures.length < reds + greens) {
            generateSpecies(speciesList.green);
        } else if (creatures.length >= reds + greens && creatures.length < total) {
            generateSpecies(speciesList.blue);
        }
    }
    generateFood(random(opts.foodMin, opts.foodMax));
    creatures.forEach(creature => creature.draw());
    food.forEach(munchie => munchie.draw());

    simInterval = setInterval(() => {
        clearCanvas();
        creatures = creatures.filter(creature => creature.isAlive);
        food = food.filter(munchie => munchie.isAlive);
        creatures.forEach(creature => {
            creature.detectLife();
            creature.detectCollision();
            creature.draw();
        });
        food.forEach(munchie => munchie.draw())
        if (throttle.on && throttle.count > 0) {
            clearInterval(simInterval);
            throttle.count -= 1;
        }
    }, 33);
}

function test() {
    creatures.push(new Creature(speciesList.red, 100, 100));
    creatures.push(new Creature(speciesList.red, 100, 110));
    startSimulation();
}