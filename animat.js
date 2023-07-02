class Animat {
    constructor(args, automata) {
        Object.assign(this, args); //{col, row, hue, health}
        this.automata = automata;
        this.cellSize = this.automata.cellSize;
        this.cOff = this.automata.colOffset;
        this.rOff = this.automata.rowOffset;
        this.aImg = this.automata.animatImg;
        this.wrapVal = function (v, m) {
            return this.automata.wrapValue(v, m);
        };
    }

    /**
     * Move to tastiest plant based on hue.
     * If no plant, wander randomly.
     */
    move() {
        let bestCol = this.wrapVal(randomInt(3) - 1 + this.col, this.automata.width);
        let bestRow = this.wrapVal(randomInt(3) - 1 + this.row, this.automata.height);
        let best = Infinity;

        for (let tCol = -1; tCol < 2; tCol++) {
            for (let tRow = -1; tRow < 2; tRow++) {
                let c = this.wrapVal(this.col + tCol, this.automata.width);
                let r = this.wrapVal(this.row + tRow, this.automata.height);
                let plant = this.automata.plants[c][r];
                let diff = plant ? Math.abs(this.hue - plant.hue) : Infinity;

                if (diff < best) {
                    best = diff;
                    bestCol = c;
                    bestRow = r;
                }
            }
        }

        this.col = bestCol;
        this.row = bestRow;
    }

    /**
     * Eat a plant if present.
     */
    eat() {
        let growth = parseInt(document.getElementById("animatgrowamount").value);
		let pickiness = parseInt(document.getElementById("animatpickiness").value);
		let plant = this.automata.plants[this.col][this.row];

        let diff = plant ? Math.abs(this.hue - plant.hue) : 180;
        if (diff > 180) {
            diff = 360 - diff;
        }

        if (plant && diff < pickiness) {
            this.automata.plants[this.col][this.row] = null;
            this.health += this.ingest(diff, growth);
        }
    }

    /**
     * Math for how much health an animat gains/loses when eating a plant.
     * @param {int} diff different in hue from plant between 0 to 180.
     * @param {int} growth growth rate modifier.
     * @returns 
     */
    ingest(diff, growth) {
        let growthMod = growth/100+0.2;
        diff = Math.floor(diff/10);
        return (9-diff)*growthMod;
    }

    /**
     * Spawn new animat if possible.
     */
    spawn() {
        if (this.health > 80) {
            this.health -= 80;
            let nCol = this.wrapVal(this.col - 1 + randomInt(3), this.automata.width);
            let nRow = this.wrapVal(this.row - 1 + randomInt(3), this.automata.height);
            this.automata.animats.push(
                new Animat({col: nCol, row: nRow,
                    hue: this.wrapVal(this.hue - 18 + randomInt(37), 360),
                    health: 50}, this.automata));
        }
    }

    /**
     * Called by automata to update animat state.
     */
    update() {
        this.move();
        this.eat();
        this.spawn();
        if (this.health < 1 || randomInt(100) < 1) {
            this.isDead = true;
        }
    }

    /**
     * Called by automata to draw animat.
     * @param {context} ctx 
     */
    draw(ctx) {
        if (document.getElementById('useImageCheckbox').checked) {
            ctx.drawImage(this.aImg, this.col * this.cellSize + this.cOff,
                this.row * this.cellSize + this.rOff,
                this.cellSize, this.cellSize);
        } else {
            ctx.fillStyle = hsl(this.hue, 100, 50);
            ctx.strokeStyle = hsl(this.hue, 30 + this.growth, 50); //"light gray";
            ctx.beginPath();
            ctx.arc((this.col + 1/2)*this.cellSize + this.cOff,
                (this.row + 1/2)*this.cellSize + this.rOff,
                this.cellSize/2 - 1, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
};