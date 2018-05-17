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

module.exports = Species;