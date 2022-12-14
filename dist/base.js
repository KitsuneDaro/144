class Grid {
    constructor(w, h, initValue) {
        this.w = w;
        this.h = h;
        this.grid = Array(this.w);

        for (let x = 0; x < this.w; x++) {
            this.grid[x] = Array(this.h);

            for (let y = 0; y < this.h; y++) {

                if (typeof (initValue) != 'object') {
                    this.grid[x][y] = initValue;
                } else {
                    this.grid[x][y] = Object.assign({}, initValue);
                }
            }
        }
    }

    equal(grid2) {
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                if (this.get(x, y).num != grid2.get(x, y).num) {
                    return false;
                }
            }
        }

        return true;
    }

    get(x, y) {
        return this.grid[x][y];
    }

    set(x, y, value) {
        this.grid[x][y] = value;
    }

    static Copy(grid) {
        let grid2 = new Grid(grid.w, grid.h, 0);

        for (let x = 0; x < grid.w; x++) {
            for (let y = 0; y < grid.h; y++) {
                grid2.set(x, y, Object.assign({}, grid.get(x, y)));
            }
        }

        return grid2;
    }
}

class Key {
    static ofArrow(keyNum) {
        return (keyNum >= 37 && keyNum <= 40);
    }

    static Left() {
        return 37;
    }

    static Up() {
        return 38;
    }

    static Right() {
        return 39;
    }

    static Down() {
        return 40;
    }
}