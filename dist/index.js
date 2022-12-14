$(window).on('load', () => {
    new Main(4, 4, 4);
});

class Main {
    constructor(boardW, boardH, initMass) {
        this.board = new GameBoard(boardW, boardH, initMass, $('.app'), $('.score'));

        this.board.setup();
        this.board.drawObj.allAppear();
        this.board.drawToConsole(this.board);

        $('html').keydown((e) => {
            let keyNum = e.which;

            if (Key.ofArrow(keyNum)) {
                this.board.oneTurn(keyNum);
                this.board.drawToConsole(this.board);
            }
        });
    }
}