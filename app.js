const color = {
    red: 'red',
    green: 'green',
    blue: 'blue'
};

// test object that makes the simulation run only a few times
// set on to true to throttle the simulation
// count limits the number of frames the simulation runs.
const throttle = {
    on: true,
    count: 1
}
  
let creatures = [];
let food = [];
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function random(min, max) {
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
        this.alive = true;
    }
    
    draw() {
        context.beginPath();
        context.rect(this.x, this.y, 3,3);
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
    constructor(props = {color, size, aggro, speed}) {
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
    }

    // find the closest target, and if targets are at equal distance, pick at random.
    closest(targets) {
        let minDist = 1000000;
        let myTarget = null;
        targets.forEach(target => {
            let distance = this.distanceTo(target);
            if(distance < minDist) {
                minDist = distance;
                myTarget = target;
            }
        });
        // targets = targets.filter( target => target.distance === minDist);
        return myTarget;
    }

    detectLife() {
        if(this.isAlive) {
            this.targets = creatures.concat(food);
            this.targets = this.targets.filter( target => {
                let isInRange = this.distanceTo(target) < this.species.aggro;
                let isNotSameSpecies = false;
                if(target instanceof Creature) {
                    isNotSameSpecies = this.species.color !== target.species.color;
                } else if(target instanceof Food) {
                    isNotSameSpecies = true;
                }
                return target !== this && isInRange && isNotSameSpecies;
            });
            //console.log(this.targets);
            if(!this.targets) {
                //pick a random direction
            } else {
                this.target = this.closest(this.targets);
                console.log(this.target);
                if(this.target) {
                  if(this.target.x < this.x) {
                    this.x -= this.speed;
                  } else {
                    this.x += this.speed;
                  }
                  if(this.target.y < this.y) {
                    this.y -= this.speed;
                  } else {
                    this.y += this.speed;
                  }
                }
            }
        }
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.species.size, 0, 2 * Math.PI, false);
        context.fillStyle = this.species.color;
        context.fill();
        context.strokeStyle = this.species.color;
        context.lineWidth = 1;
        context.stroke();
    }

    distanceTo(other) {
        return Math.sqrt(Math.pow(this.x-other.x,2) + Math.pow(this.y-other.y,2));
    }
}
  
const speciesList = {
    red: new Species({color: color.red, size: 10, aggro: 250, speed: 1}),
    green: new Species({color: color.green, size: 7, aggro: 200, speed: 1}),
    blue: new Species({color: color.blue, size: 5, aggro: 300, speed: 1})
};

function generateSpecies(species) {
    let posX = random(species.size, canvas.width - species.size);
    let posY = random(species.size, canvas.height - species.size);
    creatures.push(new Creature(species, posX, posY));
}
  
function generateFood(amt) {
    while(food.length < amt) {
        let posX = random(3, canvas.width - 3);
        let posY = random(3, canvas.height - 3);
        food.push(new Food(posX, posY));
    }
}
  
function startSimulation() {
    const simInterval = setInterval(()=> {
        clearCanvas();
        creatures = creatures.filter( creature => creature.alive );
        food = food.filter( munchie => munchie.alive );
        creatures.forEach( creature => {
            creature.detectLife();
            creature.draw();
        });
        food.forEach( munchie => munchie.draw() )
        count += 1;
        if(throttle.on && throttle.count >= 1) {
            clearInterval(simInterval);
        }
    }, 33);
}
  
function populate() {
    const reds = random(10, 20);
    const greens = random(10, 20);
    const blues = random(10, 20);
    const total = reds + blues + greens;

    while(creatures.length < total) {
        if(creatures.length < reds) {
            generateSpecies(speciesList.red);
        } else if(creatures.length >= reds && creatures.length < reds + greens) {
            generateSpecies(speciesList.green);
        } else if(creatures.length >= reds + greens && creatures.length < total) {
            generateSpecies(speciesList.blue);
        }
    }
    generateFood(random(20,50));
    creatures.forEach( creature => creature.draw() );
    food.forEach( munchie=> munchie.draw() );
    startSimulation();
}
  
function test() {
    creatures.push(new Creature(speciesList.red, 100, 100));
    creatures.push(new Creature(speciesList.red, 100, 130));
    creatures.push(new Creature(speciesList.green, 85, 100));
    food.push(new Food(100, 180));
    startSimulation();
}
  
  
// test();