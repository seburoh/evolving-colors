class Automata {
    constructor(game) {
        Object.assign(this, { game });

        //starting values
        this.plants = [];
        this.animats = [];
        this.height = 40;
        this.width = 80;
        this.cellSize = 20;
        this.tickCount = 0;
        this.ticks = 0;
        
        this.colOffset = 0;
        this.rowOffset = 0;
        this.useAnimats = true;

        //image stuff
        this.animatImg = ASSET_MANAGER.getAsset("./caffiene.png");

        //button
        this.button = document.getElementById('restartButton');
        this.button.addEventListener('click', (e) => {
            this.resetSim();
        });

        //setup
        this.buildSimState();
    }

    /**
     * Reset simulation with updated parameters.
     * Called by HTML button.
     */
    resetSim() {
        this.plants = [];
        this.animats = [];

        this.cellSize = parseInt(document.getElementById('cellsize').value, 10);
        this.height = Math.floor(800 / this.cellSize);
        this.width = Math.floor(1600 / this.cellSize);
        this.rowOffset = Math.floor((800 % this.cellSize) / 2);
        this.colOffset = Math.floor((1600 % this.cellSize) / 2);

        this.useAnimats = !(document.getElementById('wallpaperMode').checked);

        this.buildSimState();

        this.tickCount = 0;
        this.ticks = 0;
    }

    /**
     * Build empty array to required size.
     */
    buildSimState() {
        for (let col = 0; col < this.width; col++) {
            this.plants.push([]);
            for (let row = 0; row < this.height; row++) {
                this.plants[col][row] = null;
            }
        }

        let c = randomInt(this.width);
        let r = randomInt(this.height);
        this.plants[c][r] = new Plant(randomInt(360), c, r, this);

        if (this.useAnimats) {
            let ac = randomInt(this.width);
            let ar = randomInt(this.height);
            this.animats.push(new Animat({col: ac, row: ar, hue: randomInt(360), health: 50}, this));
        }
    }

    /**
     * Keeps val within positive mod max.
     * @param {int} val value to mod.
     * @param {int} max modulus or whatever the right term is.
     * @returns positive value of val mod max
     */
    wrapValue(val, max) {
        return ((val+max) % max);
    }

    /**
     * Logic updates that happen each tick.
     */
    update() {
        //flip the speed slider so it makes human sense
        let speed = 120 - parseInt(document.getElementById('speed').value, 10);

        if (this.tickCount++ >= speed && speed != 119) {
            this.tickCount = 0;
            document.getElementById('ticks').innerHTML = 'Ticks: ' + ++this.ticks;

            //check plant status
            for (let col = 0; col < this.width; col++) {
                for (let row = 0; row < this.height; row++) {
                    this.plants[col][row]?.update()
                    if (randomInt(1000) < 2 && this.useAnimats) {
                        this.plants[col][row] = null;
                    }
                }
            }

            //check animat status
            for (let i = this.animats.length - 1; i >= 0; --i) {
                this.animats[i].update();
                if (this.animats[i].isDead) {
                    this.animats.splice(i, 1);
                }
            }
        }
    }

    /**
     * Draw new state each tick.
     */
    draw(ctx) {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.plants[col][row]?.draw(ctx);
            }
        }

        for (let i = this.animats.length - 1; i >= 0; --i) {
            this.animats[i].draw(ctx);
        }
    }
}