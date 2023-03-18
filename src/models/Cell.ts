export class Cell {
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMinesCount: number;
    
    constructor(row: number, col: number, isMine: boolean) {
        this.row = row;
        this.col = col;
        this.isMine = isMine;
        this.isRevealed = false;
        this.isFlagged = false;
        this.neighborMinesCount = 0;

    }
}