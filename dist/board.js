class GameBoard {
    constructor(boardW, boardH, initMass, parentElm, scoreElm) {
        this.board = new Grid(boardW, boardH, new MassInfo(MassInfo.Empty()));
        this.fibonacci = new Fibonacci();
        this.initMass = initMass;

        this.drawObj = new BoardDraw(this, parentElm);
        this.scoreDrawObj = new ScoreDraw(scoreElm);

        this.turn = 0;
        this.animation = false;
        this.w = this.board.w;
        this.h = this.board.h;

        this.score = 0;
    }

    // main function

    setup() {
        for (let i = 0; i < this.initMass; i++) {
            this.putMassRandom();
        }
    }

    oneTurn(keyNum) {
        if (!this.animation) {
            if (this.move(keyNum)) {
                this.turn++;
                this.animation = true;

                setTimeout(() => {
                    this.putMassRandom();
                    this.drawObj.allAppear();
                }, Mass.MoveTime());

                setTimeout(() => {
                    this.animation = false;
                }, Mass.TurnTime());
            }
        }
    }

    move(way) {
        this.resetInfo();

        switch (way) {
            case Key.Right():
                return this.moveX(1);
            case Key.Left():
                return this.moveX(-1);
            case Key.Down():
                return this.moveY(1);
            case Key.Up():
                return this.moveY(-1);
        }

        return false;
    }

    drawToConsole(grid) {
        console.log('+--------+')

        for (let y = 0; y < grid.h; y++) {
            let text = y + ': ';

            for (let x = 0; x < grid.w; x++) {
                text += grid.get(x, y).num + ' ';
            }

            console.log(text);
        }
    }

    // sub function

    moveX(xSign) {
        let startX, endX;
        [startX, endX] = this.rangeX(-xSign);

        let copyBoard = Grid.Copy(this.board);

        for (let y = 0; y < this.board.h; y++) {
            for (var x = startX; x != endX; x -= xSign) {
                if (this.get(x, y).num == MassInfo.Empty()) {
                    let ax = -xSign;

                    while (this.inRange(ax + x, 0, this.board.w - 1)) {
                        if (this.get(ax + x, y).num != MassInfo.Empty()) {
                            this.moveMassX(ax + x, x, y);

                            break;
                        }
                        ax -= xSign;
                    }
                }
                let ax = -xSign;

                while (this.inRange(ax + x, 0, this.board.w - 1)) {
                    if (this.get(ax + x, y).num != MassInfo.Empty()) {
                        if (this.get(x, y).num == MassInfo.One() && this.get(ax + x, y).num == MassInfo.One()) {
                            this.uniteMassX(ax + x, x, y);
                        } else if (Math.abs(this.get(x, y).num - this.get(ax + x, y).num) == 1) {
                            this.uniteMassX(ax + x, x, y);
                        } else {
                            this.moveMassX(ax + x, x - xSign, y);
                        }

                        break;
                    }
                    ax -= xSign;
                }
            }
        }

        if (this.board.equal(copyBoard)) {
            return false;
        } else {
            this.drawObj.allMoveX();
            this.scoreDrawObj.update(this.score);
            return true;
        }
    }

    moveY(ySign) {
        let startY, endY;
        [startY, endY] = this.rangeY(-ySign);

        let copyBoard = Grid.Copy(this.board);

        for (let x = 0; x < this.board.w; x++) {
            for (var y = startY; y != endY; y -= ySign) {
                if (this.get(x, y).num == MassInfo.Empty()) {
                    let ay = -ySign;

                    while (this.inRange(ay + y, 0, this.board.h - 1)) {
                        if (this.get(x, ay + y).num != MassInfo.Empty()) {
                            this.moveMassY(ay + y, y, x);

                            break;
                        }
                        ay -= ySign;
                    }
                }
                let ay = -ySign;

                while (this.inRange(ay + y, 0, this.board.h - 1)) {
                    if (this.get(x, ay + y).num != MassInfo.Empty()) {
                        if (this.get(x, y).num == MassInfo.One() && this.get(x, ay + y).num == MassInfo.One()) {
                            this.uniteMassY(ay + y, y, x);
                        } else if (Math.abs(this.get(x, y).num - this.get(x, ay + y).num) == 1) {
                            this.uniteMassY(ay + y, y, x);
                        } else {
                            this.moveMassY(ay + y, y - ySign, x);
                        }

                        break;
                    }
                    ay -= ySign;
                }
            }
        }

        if (this.board.equal(copyBoard)) {
            return false;
        } else {
            this.drawObj.allMoveY();
            this.scoreDrawObj.update(this.score);
            return true;
        }
    }

    uniteMassX(fromX, toX, y) {
        this.set(toX, y, {
            num: Math.max(this.get(fromX, y).num, this.get(toX, y).num) + 1,
            uniteFromX: fromX
        });
        this.set(fromX, y, {
            num: MassInfo.Empty(),
            uniteToX: toX
        });

        this.score += this.getFib(toX, y);
    }

    uniteMassY(fromY, toY, x) {
        this.set(x, toY, {
            num: Math.max(this.get(x, fromY).num, this.get(x, toY).num) + 1,
            uniteFromY: fromY
        });
        this.set(x, fromY, {
            num: MassInfo.Empty(),
            uniteToY: toY
        });
        
        this.score += this.getFib(x, toY);
    }

    moveMassX(fromX, toX, y) {
        if (fromX != toX) {
            this.set(toX, y, {
                num: this.get(fromX, y).num
            });
            this.set(fromX, y, {
                num: MassInfo.Empty(),
                moveToX: toX
            });
        }
    }

    moveMassY(fromY, toY, x) {
        if (fromY != toY) {
            this.set(x, toY, {
                num: this.get(x, fromY).num
            });
            this.set(x, fromY, {
                num: MassInfo.Empty(),
                moveToY: toY
            });
        }
    }

    putMassRandom() {
        let x, y;

        do {
            x = Math.floor(Math.random() * this.board.w);
            y = Math.floor(Math.random() * this.board.h);
        } while (this.existMass(x, y));

        this.set(x, y, {
            num: MassInfo.One(),
            appear: true
        });
    }

    resetInfo() {
        this.setAll({
            uniteFromX: MassInfo.NotIndex(),
            uniteFromY: MassInfo.NotIndex(),
            uniteToX: MassInfo.NotIndex(),
            uniteToY: MassInfo.NotIndex(),
            moveToX: MassInfo.NotIndex(),
            moveToY: MassInfo.NotIndex(),
            appear: false
        });
    }

    rangeX(xSign) {
        return this.range(xSign, 0, this.board.w);
    }

    rangeY(ySign) {
        return this.range(ySign, 0, this.board.h);
    }

    range(sign, p0, p1) {
        let start, end;

        if (sign < 0) {
            start = p1 - 1;
            end = p0
        } else {
            start = p0;
            end = p1 - 1;
        }

        return [start, end];
    }

    inRange(value, p0, p1) {
        return !(value < p0 || value > p1);
    }

    existMass(x, y) {
        return this.get(x, y).num > 0;
    }

    get(x, y) {
        return this.board.get(x, y);
    }

    getFib(x, y) {
        return this.fibonacci.get(this.get(x, y).num);
    }

    setAll(values) {
        for (let y = 0; y < this.board.w; y++) {
            for (let x = 0; x < this.board.h; x++) {
                this.set(x, y, values);
            }
        }
    }

    set(x, y, values) {
        let massInfo = this.get(x, y);

        Object.keys(values).forEach((key) => {
            massInfo[key] = values[key];
        });

        this.board.set(x, y, massInfo);
    }
}

class MassInfo {
    constructor(num) {
        this.num = num;

        this.uniteFromX = MassInfo.NotIndex();
        this.uniteFromY = MassInfo.NotIndex();
        this.uniteToX = MassInfo.NotIndex();
        this.uniteToY = MassInfo.NotIndex();

        this.moveToX = MassInfo.NotIndex();
        this.moveToY = MassInfo.NotIndex();

        this.appear = false;
    }

    // static variable

    static Empty() {
        return 0;
    }

    static One() {
        return 2;
    }

    static NotIndex() {
        return -1;
    }
}