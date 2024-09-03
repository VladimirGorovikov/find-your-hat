const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
        this._numRows = field.length;
        this._numCols = field[0].length;
        // playerLoc = [row, col]
        this._playerLoc = [0, 0];
    }

    get field() {
        return this._field;
    }

    get playerLoc() {
        return this._playerLoc;
    }

    get fieldRows() {
        return this._fieldRows;
    }

    get fieldCols() {
        return this._fieldCols;
    }

    set field(newField) {
        this._field = newField;
    }

    set playerLoc(newPlayerLoc) {
        this._playerLoc = newPlayerLoc;
    }

    // Prints the board to the screen
    print() {
        for (let row of this.field) {
            console.log(row.join(' '));
        }
    }

    // Accepts a direction 'u', 'd' , 'l', 'r' and returns -1 if loss, 0 if continue playing and 1 if win
    // Updates the field and playerLoc
    move(dir) {
        switch(dir) {
            case 'u':
                // Moves the player up one row
                this.playerLoc[0]--;
                break;
            case 'd':
                // Movies the player down one row
                this.playerLoc[0]++;
                break;
            case 'l':
                // Movies the player left one row
                this.playerLoc[1]--;
                break;
            case 'r':
                // Movies the player right one row
                this.playerLoc[1]++;
                break;
        }

        // Check if player is out of bounds
        if (this.playerLoc[0] < 0 || this.playerLoc[1] < 0 || this.playerLoc[0] >= this.fieldRows || this.playerLoc[1] >= this.fieldCols) {
            return -1;
        // Check if player stepped on a hole
        } else if (this.field[this.playerLoc[0]][this.playerLoc[1]] === hole) {
            return -1;
        // Otherwise update gameboard and check if player is on hat
        } else if (this.field[this.playerLoc[0]][this.playerLoc[1]] === hat) {
            return 1;
        } else {
            this.field[this.playerLoc[0]][this.playerLoc[1]] = pathCharacter;
            return 0;
        } 
    }

    // Prompts the user for a direction and checks that its a valid direction of travel 'u', 'd', 'l', 'r'
    // If direction is valid then returns, otherwise prompts the user for the direction again
    getDir() {
        let dir;
        do {
            dir = prompt("Please select a direction to move (u, d, l, r): ");
        } while (dir !== 'u' && dir !== 'd' && dir !== 'l' && dir !== 'r');

        return dir;
    }

    // Creates the game loop by prompting the user with getDir and checking their move with move
    game() {
        console.log("Find your hat!");
        this.print();
        let moveResult = 0;
        
        do {
            moveResult = this.move(this.getDir());
            this.print();
        } while (moveResult === 0);

        if (moveResult === -1) {
            console.log("You have lost!");
        } else {
            console.log("You win!!!");
        }
    }

    static generateField(numRows, numCols, percentHole) {
        let newField = [];

        // Distribute the holes
        for (let i = 0; i < numRows; i++) {
            newField[i] = [];
            for (let j = 0; j < numCols; j++) {
                // Place the player character at 0, 0
                if (i === 0 && j === 0) {
                    newField[i][j] = pathCharacter;
                    continue;
                }

                // Determine if the field should have a hole at the specified space
                let randomNum = Math.floor(Math.random() * 101);
                if (randomNum < percentHole) {
                    newField[i][j] = hole;
                } else {
                    newField[i][j] = fieldCharacter;
                }
            }
        }

        let hatRow = Math.floor(Math.random() * numRows);
        let hatCol = Math.floor(Math.random() * numCols);

        newField[hatRow][hatCol] = hat;

        return newField;
    }
}

const testField = new Field(Field.generateField(10,10,50));

testField.game();