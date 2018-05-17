const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

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

module.exports = Food;