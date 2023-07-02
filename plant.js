class Plant {
    constructor(hue, col, row, automata) {
        Object.assign(this, {hue, col, row, automata});
        this.growth = 0;
        this.cellSize = this.automata.cellSize;
        this.cOff = this.automata.colOffset;
        this.rOff = this.automata.rowOffset;
        this.wrapVal = function(v, m) {
            return this.automata.wrapValue(v, m);
        };
    }

    /**
     * Drops a seed in an adjacent location. Will not overwrite existing plants.
     */
    dropSeed() {
        let nCol = this.wrapVal(this.col - 1 + randomInt(3), this.automata.width);
        let nRow = this.wrapVal(this.row - 1 + randomInt(3), this.automata.height);

        if (!this.automata.plants[nCol][nRow]) {
            let hue = this.wrapVal(this.hue - 18 + randomInt(37), 360);
            this.automata.plants[nCol][nRow] = new Plant (hue, nCol, nRow, this.automata);
        }
    }

    /**
     * Called by automata, grows plant by user-set amount, drops seed if able.
     */
    update() {
        this.growth += this.wrapVal(this.growth + parseInt(document.getElementById("plantgrowamount").value), 100);

        if (this.growth > 70) {
            this.growth -= 70;
            this.dropSeed();
        }
    }

    /**
     * Called by automata, draws plant with outline for health.
     * @param {context} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = hsl(this.hue, 100, 50);
        ctx.strokeStyle = hsl(this.hue, 30 + this.growth, 50);

        ctx.fillRect(this.col * this.cellSize + this.cOff, this.row * this.cellSize + this.rOff,
            this.cellSize, this.cellSize);
        ctx.strokeRect(this.col * this.cellSize + this.cOff, this.row * this.cellSize + this.rOff,
            this.cellSize, this.cellSize)
    }
};