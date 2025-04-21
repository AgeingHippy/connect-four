const Piece = Object.freeze({ 
    Red:"Red", 
    Black: "Black"
});

class BoardStorage {
    #rows = 0;
    #cols=0;
    #cells=[];

    constructor(rows,cols) {
        this.#rows = rows;
        this.#cols = cols;
        this.clear();
    }

    //drop a piece into a column
    //return y position of piece (0 based)
    dropPiece(col, piece) {
        if (col < 0 || col > this.#cols - 1) {
            throw new RangeError(`Column '${col}' out of bounds`);
        }
        
        let column = this.#cells[col];
        if (column.length >= this.#rows ) {
            throw new RangeError(`Column '${col}' is full`);
        }
        
        return column.push(piece) - 1;
    }

    //return the element contained in cell row,col
    peek(row, col)  {
        return this.#cells[row, col];
    }

    //reset the board to an empty state
    clear() {
        for (let x = 0; x < this.#cols; x++) {
            this.#cells[x,0] = [];  
         }
    }
}