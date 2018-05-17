(function() {

    const Food = require('./food');
    const random = require('./random');
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    class Creature {
        constructor(species, x, y, sim) {
            this.x = x;
            this.y = y;
            this.species = species;
            this.targets = [];
            this.target = null;
            this.isAlive = true;
            this.size = species.size;
            this.direction = 'north';
            this.counter = 0;
            this.selected = false;
            this.sim = sim;
        }

        static getDirection(dir = 'all') {
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
            const filterDirections = (news) => directions.filter((direction) => direction.includes(news))
            switch (dir) {
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
            return directions[random(0, directions.length - 1)];
        }

        constrain() {
            if (this.x < this.size) {
                this.x = this.size;
                //Get westwardly directions
                this.direction = Creature.getDirection('west');
            }
            if (this.x > canvas.width - this.size) {
                this.x = canvas.width - this.size;
                //Get eastwardly directions
                this.direction = Creature.getDirection('east');
            }
            if (this.y < this.size) {
                this.y = this.size;
                // Get a southern direction
                this.direction = Creature.getDirection('south');
            }
            if (this.y > canvas.height - this.size) {
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
                        this.targets = [];
                    }
                });
            }
        }

        detectLife() {
            if (this.isAlive) {
                this.targets = this.sim.creatures.concat(this.sim.food);
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
                    if (this.counter === 0) {
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
            context.strokeStyle = this.selected ? 'white' : this.species.color;
            context.lineWidth = 1;
            context.stroke();
        }

        distanceTo(other) {
            return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
        }
    }

    module.exports = Creature;

})();