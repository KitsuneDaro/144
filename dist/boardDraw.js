class BoardDraw {
    constructor(boardObj, parentElm) {
        this.boardObj = boardObj;
        this.parentElm = parentElm;
        this.masses = [];
    }

    allAppear() {
        for (let y = 0; y < this.boardObj.h; y++) {
            for (let x = 0; x < this.boardObj.w; x++) {
                if (this.boardObj.get(x, y).appear) {
                    this.appear(x, y);
                }
            }
        }
    }

    allMoveX() {
        for (let i = 0; i < this.masses.length; i++) {
            let mass = this.masses[i];
            let x = mass.x;
            let y = mass.y;

            if (mass.deleted) {
                this.masses.splice(i,1);
                i -= 1;
                continue;
            }

            if (this.boardObj.get(x, y).uniteToX != MassInfo.NotIndex()) {
                mass.uniteToX(this.boardObj.get(x, y).uniteToX);
            }

            if (this.boardObj.get(x, y).moveToX != MassInfo.NotIndex()) {
                mass.moveX(this.boardObj.get(x, y).moveToX);
            }
            
            x = mass.x;
            y = mass.y;

            if (this.boardObj.get(x, y).uniteFromX != MassInfo.NotIndex()) {
                console.log(this.boardObj.getFib(x, y));
                mass.uniteFromX(this.boardObj.getFib(x, y));
            }
        }
    }

    allMoveY() {
        for (let i = 0; i < this.masses.length; i++) {
            let mass = this.masses[i];
            let x = mass.x;
            let y = mass.y;

            if (mass.deleted) {
                this.masses.splice(i,1);
                i -= 1;
                continue;
            }

            if (this.boardObj.get(x, y).uniteToY != MassInfo.NotIndex()) {
                mass.uniteToY(this.boardObj.get(x, y).uniteToY);
            }

            if (this.boardObj.get(x, y).moveToY != MassInfo.NotIndex()) {
                mass.moveY(this.boardObj.get(x, y).moveToY);
            }
            
            x = mass.x;
            y = mass.y;

            if (this.boardObj.get(x, y).uniteFromY != MassInfo.NotIndex()) {
                mass.uniteFromY(this.boardObj.getFib(x, y));
            }
        }
    }

    appear(x, y) {
        let mass = this.put(x, y);
        if (mass) {
            mass.appear();
        }
    }

    put(x, y) {
        if (this.boardObj.get(x, y).num != MassInfo.Empty()) {
            let mass = new Mass(x, y, this.boardObj.getFib(x, y));
            this.masses.push(mass);
            this.parentElm.append(mass.elm);
            return mass;
        }

        return false;
    }

    changeScore() {
        
    }
}

class Mass {
    constructor(x, y, num) {
        this.num = num;

        this.elm = $('<div></div>', {
            'class': 'mass'
        });
        this.put(x, y);

        this.numElm = $('<span></span>', {
            'text': num
        });

        this.elm.append(this.numElm);
        this.deleted = false;
    }

    put(x, y) {
        this.x = x;
        this.y = y;

        this.elm.css('left', x * (Mass.Size() + Mass.Dist()) + Mass.Dist() + '%');
        this.elm.css('top', y * (Mass.Size() + Mass.Dist()) + Mass.Dist() + '%');
    }

    appear() {
        this.elm.css('animation', 'appear ' + Mass.AppearTime() / 1000 + 's ease-in');
    }

    uniteFromX(num) {
        this.elm.css('z-index', 1);
        setTimeout(() => {
            this.elm.css('animation', 'appear ' + Mass.AppearTime() / 1000 + 's ease-in');
            this.updateNum(num);
        }, Mass.MoveTime());
    }

    uniteFromY(num) {
        this.elm.css('z-index', 1);
        setTimeout(() => {
            this.elm.css('animation', 'appear ' + Mass.AppearTime() / 1000 + 's ease-in');
            this.updateNum(num);
        }, Mass.MoveTime());
    }

    uniteToX(x) {
        this.x = x;

        this.elm.animate({ left: x * (Mass.Size() + Mass.Dist()) + Mass.Dist() + '%' }, Mass.MoveTime());
        setTimeout(() => {
            this.elm.remove();
            this.deleted = true;
        }, Mass.MoveTime());
    }

    uniteToY(y) {
        this.y = y;

        this.elm.animate({ top: y * (Mass.Size() + Mass.Dist()) + Mass.Dist() + '%' }, Mass.MoveTime());
        setTimeout(() => {
            this.elm.remove();
            this.deleted = true;
        }, Mass.MoveTime());
    }

    moveX(x) {
        this.x = x;

        this.elm.animate({ left: x * (Mass.Size() + Mass.Dist()) + Mass.Dist() + '%' }, Mass.MoveTime());
    }
  
    moveY(y) {
        this.y = y;

        this.elm.animate({ top: y * (Mass.Size() + Mass.Dist()) + Mass.Dist() + '%' }, Mass.MoveTime());
    }
    

    updateNum(num){
        this.num = num;
        this.numElm.text(num);
    }

    static Size() {
        return 22;
    }

    static Dist() {
        return (100 - Mass.Size() * 4) / (4 + 1);
    }

    static MoveTime() {
        return 150;
    }

    static AppearTime() {
        return 100;
    }

    static TurnTime() {
        return Mass.MoveTime() + Mass.AppearTime();
    }
}

class ScoreDraw{
    constructor(elm){
        this.elm = elm; // .score
        this.numP = this.elm.find('.score_num > p');
    }

    update(score){
        if (score != this.numP.text()) {
            this.elm.css('animation', 'bibe ' + ScoreDraw.BibeTime() / 1000 + 's ease-in');

            setTimeout(() => {
                this.elm.css('animation', '');
            }, ScoreDraw.BibeTime());
        }

        this.numP.text(score);
    }

    static BibeTime(){
        return 350;
    }
}