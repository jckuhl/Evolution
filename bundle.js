/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const colorize = __webpack_require__(/*! ./dist/src/colorize */ \"./dist/src/colorize.js\");\n\nconst h1 = document.getElementById('title');\nh1.innerHTML = colorize(h1, 'red', 'green', 'blue');\n\nconst Controller = __webpack_require__(/*! ./dist/src/controls */ \"./dist/src/controls.js\");\nconst controls = new Controller();\ncontrols.setSliderDefaults();\ncontrols.setEventListeners();\n\n//# sourceURL=webpack:///./app.js?");

/***/ }),

/***/ "./dist/src/colorize.js":
/*!******************************!*\
  !*** ./dist/src/colorize.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function colorize(element, ...colors) {\n    let index = 0\n    let html = '';\n    element.innerText.split('').forEach((letter) => {\n        html += `<span class=\"${colors[index]}\">${letter}</span>`;\n        index += 1;\n        if (index >= colors.length) {\n            index = 0;\n        }\n    });\n    return html;\n}\n\n\n//# sourceURL=webpack:///./dist/src/colorize.js?");

/***/ }),

/***/ "./dist/src/controls.js":
/*!******************************!*\
  !*** ./dist/src/controls.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(function() {\n\n    const Simulation = __webpack_require__(/*! ./simulation */ \"./dist/src/simulation.js\");\n\n    class Controller {\n        constructor() {\n            this.simulation = null;\n            this.sliders = Array.from(document.querySelectorAll('input[type=\"range\"]'));\n            this.outputs = Array.from(document.querySelectorAll('output'));\n            this.config = {};\n        }\n\n        setSliderValue(id, value) {\n            this.config[id] = parseInt(value);\n            this.outputs.filter((output) => output.name === id)[0].value = value;\n        }\n\n        setSliderMax() {\n            this.sliders.forEach((slider) => {\n                this.setSliderValue(slider.id, slider.max);\n                slider.value = slider.max;\n            })\n        }\n\n        setSliderMin() {\n            this.sliders.forEach((slider) => {\n                this.setSliderValue(slider.id, slider.min);\n                slider.value = slider.min;\n            })\n        }\n\n        setSliderDefaults() {\n            this.sliders.forEach((slider) => {\n                this.setSliderValue(slider.id, slider.value);\n            });\n        }\n\n        setSliderEventListeners() {\n            this.sliders.forEach((slider) => slider.addEventListener('change', () => {\n                controls.setSliderValue(event.target.id, event.target.value);\n            }));\n        }\n\n        togglePause() {\n            if (this.simulation) {\n                this.simulation.paused = !this.simulation.paused;\n            }\n        }\n\n        resetSliderValue() {\n            const defaultConfig = {\n                redMin: 10,\n                redMax: 20,\n                greenMin: 10,\n                greenMax: 20,\n                blueMin: 10,\n                blueMax: 20,\n                foodMin: 20,\n                foodMax: 50,\n            }\n            Object.entries(defaultConfig).forEach(([key, value]) => {\n                this.sliders.filter((slider) => slider.id === key)[0].value = value;\n                this.outputs.filter((output) => output.name === key)[0].value = value;\n                this.config[key] = parseInt(value);\n            });\n        }\n\n        startSimulation() {\n            this.simulation = new Simulation();\n            this.simulation.populate(this.config);\n        }\n\n        resetSimulation() {\n            if (this.simulation) {\n                this.simulation.resetSimulation();\n                this.simulation = null;\n            }\n        }\n\n        setEventListeners() {\n            this.setSliderEventListeners();\n            popBtn.addEventListener('click', () => this.startSimulation());\n            document.getElementById('resetBtn').addEventListener('click', () => this.resetSliderValue());\n            document.getElementById('maxBtn').addEventListener('click', () => this.setSliderMax());\n            document.getElementById('minBtn').addEventListener('click', () => this.setSliderMin());\n            document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());\n            document.getElementById('resetSimBtn').addEventListener('click', () => this.resetSimulation());\n        }\n\n    }\n\n    module.exports = Controller;\n\n})();\n\n//# sourceURL=webpack:///./dist/src/controls.js?");

/***/ }),

/***/ "./dist/src/creature.js":
/*!******************************!*\
  !*** ./dist/src/creature.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(function() {\n\n    const Food = __webpack_require__(/*! ./food */ \"./dist/src/food.js\");\n    const random = __webpack_require__(/*! ./random */ \"./dist/src/random.js\");\n    const canvas = document.querySelector('canvas');\n    const context = canvas.getContext('2d');\n\n    class Creature {\n        constructor(species, x, y, sim) {\n            this.x = x;\n            this.y = y;\n            this.species = species;\n            this.targets = [];\n            this.target = null;\n            this.isAlive = true;\n            this.size = species.size;\n            this.direction = 'north';\n            this.counter = 0;\n            this.selected = false;\n            this.sim = sim;\n        }\n\n        static getDirection(dir = 'all') {\n            let directions = [\n                \"north\",\n                \"northeast\",\n                \"east\",\n                \"southeast\",\n                \"south\",\n                \"southwest\",\n                \"west\",\n                \"northwest\"\n            ]\n            const filterDirections = (news) => directions.filter((direction) => direction.includes(news))\n            switch (dir) {\n                case 'north':\n                    directions = filterDirections('north');\n                    break;\n                case 'south':\n                    directions = filterDirections('south');\n                    break;\n                case 'east':\n                    directions = filterDirections('east');\n                    break;\n                case 'west':\n                    directions = filterDirections('west');\n                    break;\n                default:\n                    break;\n            }\n            return directions[random(0, directions.length - 1)];\n        }\n\n        constrain() {\n            if (this.x < this.size) {\n                this.x = this.size;\n                //Get westwardly directions\n                this.direction = Creature.getDirection('west');\n            }\n            if (this.x > canvas.width - this.size) {\n                this.x = canvas.width - this.size;\n                //Get eastwardly directions\n                this.direction = Creature.getDirection('east');\n            }\n            if (this.y < this.size) {\n                this.y = this.size;\n                // Get a southern direction\n                this.direction = Creature.getDirection('south');\n            }\n            if (this.y > canvas.height - this.size) {\n                this.y = canvas.height - this.size;\n                // Get a northern direction\n                this.direction = Creature.getDirection('north');\n            }\n        }\n\n        // find the closest target, and if targets are at equal distance, pick at random.\n        closest(targets) {\n            let minDist = 1000000;\n            let myTarget = null;\n            targets.forEach(target => {\n                let distance = this.distanceTo(target);\n                if (distance < minDist) {\n                    minDist = distance;\n                    myTarget = target;\n                }\n            });\n            return myTarget;\n        }\n\n        detectCollision() {\n            if (this.isAlive && this.targets.length !== 0) {\n                this.targets.forEach((target) => {\n                    if (this.distanceTo(target) < this.size) {\n                        if (target.size > this.size) {\n                            target.size += 1;\n                            this.isAlive = false;\n                        } else {\n                            this.size += 1;\n                            target.isAlive = false;\n                        }\n                        this.targets = [];\n                    }\n                });\n            }\n        }\n\n        detectLife() {\n            if (this.isAlive) {\n                this.targets = this.sim.creatures.concat(this.sim.food);\n                this.targets = this.targets.filter((target) => {\n                    let isInRange = this.distanceTo(target) < this.species.aggro;\n                    let isNotSameSpecies = false;\n                    if (target instanceof Creature) {\n                        isNotSameSpecies = this.species.color !== target.species.color;\n                    } else if (target instanceof Food) {\n                        isNotSameSpecies = true;\n                    }\n                    return target !== this && isInRange && isNotSameSpecies;\n                });\n                if (this.targets.length === 0) {\n                    //pick a random direction\n                    if (this.counter === 0) {\n                        this.direction = Creature.getDirection();\n                        this.counter = random(50, 250);\n                    }\n                    switch (this.direction) {\n                        case 'north':\n                            this.x += 0;\n                            this.y -= this.species.speed;\n                            break;\n                        case 'northeast':\n                            this.x += this.species.speed;\n                            this.y -= this.species.speed;\n                            break;\n                        case 'east':\n                            this.x += this.species.speed;\n                            this.y += 0;\n                            break;\n                        case 'southeast':\n                            this.x += this.species.speed;\n                            this.y += this.species.speed;\n                            break;\n                        case 'south':\n                            this.x += 0;\n                            this.y += this.species.speed;\n                            break;\n                        case 'southwest':\n                            this.x -= this.species.speed;\n                            this.y += this.species.speed;\n                            break;\n                        case 'west':\n                            this.x -= this.species.speed;\n                            this.y -= 0;\n                            break;\n                        case 'northwest':\n                            this.x -= this.species.speed;\n                            this.y -= this.species.speed;\n                            break;\n                    }\n                    this.constrain();\n                    this.counter -= 1;\n                } else {\n                    this.target = this.closest(this.targets);\n                    if (this.target.size < this.size) {\n                        //if bigger, chase\n                        if (this.target.x < this.x) {\n                            this.x -= this.species.speed;\n                        } else {\n                            this.x += this.species.speed;\n                        }\n                        if (this.target.y < this.y) {\n                            this.y -= this.species.speed;\n                        } else {\n                            this.y += this.species.speed;\n                        }\n                    } else {\n                        //if not, run away\n                        if (this.target.x < this.x) {\n                            this.x += this.species.speed;\n                        } else {\n                            this.x -= this.species.speed;\n                        }\n                        if (this.target.y < this.y) {\n                            this.y += this.species.speed;\n                        } else {\n                            this.y -= this.species.speed;\n                        }\n                    }\n                    this.constrain();\n                }\n            }\n        }\n\n        draw() {\n            context.beginPath();\n            context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);\n            context.fillStyle = this.species.color;\n            context.fill();\n            context.strokeStyle = this.selected ? 'white' : this.species.color;\n            context.lineWidth = 1;\n            context.stroke();\n        }\n\n        distanceTo(other) {\n            return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));\n        }\n    }\n\n    module.exports = Creature;\n\n})();\n\n//# sourceURL=webpack:///./dist/src/creature.js?");

/***/ }),

/***/ "./dist/src/food.js":
/*!**************************!*\
  !*** ./dist/src/food.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function() {\n\n    const canvas = document.querySelector('canvas');\n    const context = canvas.getContext('2d');\n\n    class Food {\n        constructor(x, y) {\n            this.x = x;\n            this.y = y;\n            this.isAlive = true;\n        }\n\n        draw() {\n            context.beginPath();\n            context.rect(this.x, this.y, 3, 3);\n            context.fillStyle = 'yellow';\n            context.fill();\n            context.strokeStyle = 'yellow';\n            context.lineWidth = 1;\n            context.stroke();\n        }\n    }\n\n    module.exports = Food;\n\n})();\n\n//# sourceURL=webpack:///./dist/src/food.js?");

/***/ }),

/***/ "./dist/src/random.js":
/*!****************************!*\
  !*** ./dist/src/random.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function random(min = 0, max) {\n    if (min > max) {\n        let temp = max;\n        max = min;\n        min = temp;\n    }\n    return Math.floor(Math.random() * (max - min) + min);\n}\n\n//# sourceURL=webpack:///./dist/src/random.js?");

/***/ }),

/***/ "./dist/src/simulation.js":
/*!********************************!*\
  !*** ./dist/src/simulation.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Creature = __webpack_require__(/*! ./creature */ \"./dist/src/creature.js\");\nconst Species = __webpack_require__(/*! ./species */ \"./dist/src/species.js\");\nconst Food = __webpack_require__(/*! ./food */ \"./dist/src/food.js\");\n(function() {\n\n    const random = __webpack_require__(/*! ./random */ \"./dist/src/random.js\");\n    const title = __webpack_require__(/*! ./title */ \"./dist/src/title.js\");\n\n    const popBtn = document.getElementById('popBtn');\n    const canvas = document.querySelector('canvas');\n    const context = canvas.getContext('2d');\n\n    function clearCanvas() {\n        context.clearRect(0, 0, canvas.width, canvas.height);\n    }\n\n    const indivStats = document.getElementById('indivStats');\n    indivStats.style.visibility = 'hidden';\n\n    const redTotal = document.getElementById('redTotal');\n    const greenTotal = document.getElementById('greenTotal');\n    const blueTotal = document.getElementById('blueTotal');\n\n    const speciesSpan = document.getElementById('species');\n    const posXSpan = document.getElementById('posX');\n    const posYSpan = document.getElementById('posY');\n    const targetSpan = document.getElementById('target');\n\n    class Simulation {\n\n        constructor() {\n            this.paused = false;\n            this.creatures = [];\n            this.food = [];\n            this.clicktargets = [];\n            this.simInterval = null;\n            this.selectedCreature = null;\n\n            this.speciesList = {\n                red: new Species({\n                    color: 'red',\n                    size: 10,\n                    aggro: 45,\n                    speed: 1\n                }),\n                green: new Species({\n                    color: 'green',\n                    size: 7,\n                    aggro: 40,\n                    speed: 2\n                }),\n                blue: new Species({\n                    color: 'blue',\n                    size: 5,\n                    aggro: 50,\n                    speed: 2.5\n                })\n            };\n        }\n\n        generateSpecies(species) {\n            let posX = random(species.size, canvas.width - species.size);\n            let posY = random(species.size, canvas.height - species.size);\n            this.creatures.push(new Creature(species, posX, posY, this));\n        }\n\n        generateFood(amt) {\n            while (this.food.length < amt) {\n                let posX = random(3, canvas.width - 3);\n                let posY = random(3, canvas.height - 3);\n                this.food.push(new Food(posX, posY));\n            }\n        }\n\n        trackStats() {\n            let counter = {};\n            this.creatures.forEach((creature) => {\n                if (!counter[creature.species.color]) {\n                    counter[creature.species.color] = 1;\n                } else {\n                    counter[creature.species.color] += 1;\n                }\n            });\n            redTotal.innerText = counter.red;\n            greenTotal.innerText = counter.green;\n            blueTotal.innerText = counter.blue;\n        }\n\n        trackCreatureStats(creature) {\n            speciesSpan.innerText = title(creature.species.color) + ' Circle'\n            posXSpan.innerText = creature.x;\n            posYSpan.innerText = creature.y;\n            if (creature.target) {\n                if (creature.target instanceof Food) {\n                    targetSpan.innerText = 'Food';\n                } else {\n                    targetSpan.innerText = title(creature.target.species.color) + ' Circle';\n                }\n            } else {\n                targetSpan.innerText = 'None';\n            }\n        }\n\n        populate(opts = {\n            redMin: 10,\n            redMax: 20,\n            greenMin: 10,\n            greenMax: 20,\n            blueMin: 10,\n            blueMax: 20,\n            foodMin: 20,\n            foodMax: 50,\n        }) {\n            this.setEventListeners();\n\n            const reds = random(opts.redMin, opts.redMax);\n            const greens = random(opts.greenMin, opts.greenMax);\n            const blues = random(opts.blueMin, opts.blueMax);\n            const total = reds + blues + greens;\n\n            popBtn.disabled = true;\n\n            while (this.creatures.length < total) {\n                if (this.creatures.length < reds) {\n                    this.generateSpecies(this.speciesList.red);\n                } else if (this.creatures.length >= reds && this.creatures.length < reds + greens) {\n                    this.generateSpecies(this.speciesList.green);\n                } else if (this.creatures.length >= reds + greens && this.creatures.length < total) {\n                    this.generateSpecies(this.speciesList.blue);\n                }\n            }\n            this.generateFood(random(opts.foodMin, opts.foodMax));\n            this.creatures.forEach(creature => creature.draw());\n            this.food.forEach(munchie => munchie.draw());\n\n            this.simInterval = setInterval(() => {\n                if (!this.paused) {\n                    clearCanvas();\n                    this.creatures = this.creatures.filter(creature => creature.isAlive);\n                    this.food = this.food.filter(munchie => munchie.isAlive);\n                    this.creatures.forEach(creature => {\n                        creature.detectLife();\n                        creature.detectCollision();\n                        creature.draw();\n                    });\n                    this.food.forEach(munchie => munchie.draw())\n                }\n                if (this.selectedCreature) {\n                    this.trackCreatureStats(this.selectedCreature);\n                    indivStats.style.visibility = 'visible';\n                    indivStats.className = this.selectedCreature.species.color;\n                } else {\n                    indivStats.style.visibility = 'hidden';\n                }\n                this.trackStats();\n\n            }, 33);\n        }\n\n        resetSimulation() {\n            if (this.simInterval) {\n                clearInterval(this.simInterval);\n            }\n            this.creatures = [];\n            this.food = [];\n            clearCanvas();\n            popBtn.disabled = false;\n        }\n\n        clickCreature() {\n            const clickTarget = {\n                x: event.offsetX,\n                y: event.offsetY\n            }\n            this.creatures.forEach((creature) => {\n                if (creature.distanceTo(clickTarget) < creature.size + 5) {\n                    creature.selected = true;\n                    this.clicktargets.push(creature);\n                } else {\n                    creature.selected = false;\n                }\n                if (this.clicktargets.length === 0) {\n                    this.selectedCreature = null;\n                } else if (this.clicktargets.length >= 1) {\n                    this.selectedCreature = this.clicktargets[0];\n                    // this.clicktargets.shift();\n                    // this.clicktargets.forEach( (creature)=> creature.selected = false);\n                }\n                this.clicktargets = this.clicktargets.filter((creature) => creature.selected);\n            });\n        }\n\n        setEventListeners() {\n            canvas.addEventListener('click', () => this.clickCreature());\n        }\n    }\n\n    module.exports = Simulation;\n\n})();\n\n//# sourceURL=webpack:///./dist/src/simulation.js?");

/***/ }),

/***/ "./dist/src/species.js":
/*!*****************************!*\
  !*** ./dist/src/species.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Species {\n    constructor(props = {\n        color,\n        size,\n        aggro,\n        speed\n    }) {\n        this.color = props.color;\n        this.size = props.size;\n        this.aggro = props.aggro;\n        this.speed = props.speed;\n    }\n}\n\nmodule.exports = Species;\n\n//# sourceURL=webpack:///./dist/src/species.js?");

/***/ }),

/***/ "./dist/src/title.js":
/*!***************************!*\
  !*** ./dist/src/title.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function title(string) {\n    return string.split('').map((c, index) => {\n        return index === 0 ? c.toUpperCase() : c;\n    }).join('');\n}\n\n//# sourceURL=webpack:///./dist/src/title.js?");

/***/ })

/******/ });