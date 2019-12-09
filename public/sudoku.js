const legalInput = "123456789".split("");
const game = window.game
const solution = window.seed;
const clue = window.seedClue;
let guess = clue;

const rightCol = document.getElementById("right");
const leftCol = document.getElementById("left");
const board = document.createElement("div");
board.id = "board";

const render = (content, node) => node.innerHTML = content;

const createGrid = function() {

    const tileOrder = [
        1,2,3,10,11,12,19,20,21,4,5,6,13,14,15,22,23,24,
        7,8,9,16,17,18,25,26,27,28,29,30,37,38,39,46,47,
        48,31,32,33,40,41,42,49,50,51,34,35,36,43,44,45,
        52,53,54,55,56,57,64,65,66,73,74,75,58,59,60,67,
        68,69,76,77,78,61,62,63,70,71,72,79,80,81]
    
    let tileCounter = 0;        
    for (i = 0; i < 9; i++) {

        let square = document.createElement("div");
        square.className = "square";
        square.id = `square-${i + 1}`;

        for (j = 0; j < 9; j++) {            
            tileID = tileOrder[tileCounter];

            let tile = document.createElement("div");
            let numBox = document.createElement("div");
            let column = tileID % 9;
            if(column == 0) {
                column = 9
            };

            numBox.className = "numBox";
            numBox.className = `numBox-${tileID}`;
            tile.className = "tile";
            tile.id = `tile-${tileID}`;
            tile.setAttribute("row", `row-${Math.ceil(tileID / 9)}`);
            tile.setAttribute("column", `column-${column}`);
            tile.setAttribute("box", `box-${i + 1}`)
            tile.setAttribute("secret", `${solution[tileID - 1]}`);
            let numValue = "0";
            let tileHTML = ""
            if (clue[tileID - 1] > 0) {
                numValue = clue[tileID - 1];
                tile.setAttribute("filled", "true");
                tile.setAttribute("baseColour", "midnightblue");
                tileHTML = `<span onmouseover="highlightNeighbours(this.parentElement.parentElement)"
                            onmouseout="clearHighlights()"/>`;
                tileHTML += numValue;  
            } else {
                tileHTML = `<input type='text' size='1' maxlength='1'
                onmouseover="this.focus();this.select();highlightNeighbours(this.parentElement.parentElement)"
                oninput="updateContents(this.parentElement.parentElement,this.value);
                updateGuess(this.value, ${tileID - 1});checkvalue(this)"
                onmouseout="clearSelection();clearHighlights()"/>`;
                tile.setAttribute("filled", "false");
                tile.setAttribute("baseColour", "darkslategrey");
            };

            numBox.innerHTML = tileHTML;
            tile.setAttribute("clashing", "false");
            tile.setAttribute("contents", numValue);
            tile.appendChild(numBox);
            square.appendChild(tile);
            leftCol.appendChild(board); 
            tileCounter++;           
        }
        board.appendChild(square);
    }
}

const updateContents = function(obj, val) {
    obj.setAttribute("contents", val);
}

const neighbours = function(obj) {
    let row = obj.getAttribute("row");
    let column = obj.getAttribute("column");
    let box = obj.getAttribute("box");
    let row_neighbours = document.querySelectorAll(`[row="${obj.getAttribute("row")}"]`);
    let column_neighbours = document.querySelectorAll(`[column="${obj.getAttribute("column")}"]`);
    let box_neighbours = document.querySelectorAll(`[box="${obj.getAttribute("box")}"]`);
    let neighbours = [...row_neighbours,...column_neighbours,...box_neighbours];
    return neighbours;
}

const highlightNeighbours = function(obj) {
    for (let element of neighbours(obj)) {
        if (element.id != obj.id) {
            element.style.background = "lightcyan";
        } else {
            element.style.background = "pink";
        }
    }
}

const hasClash = function(obj) {
    for (let element of neighbours(obj)) {
        if (obj.getAttribute("contents") != "0") {
            if (element.id != obj.id) {
                if (element.getAttribute("contents") == obj.getAttribute("contents")) {
                    element.setAttribute("clashing", "true");
                    return true;
                }
            }
        }
    }
}

const checkvalue = function(obj) {
    if (!legalInput.includes(obj.value)) {obj.value = ""};
    checkClashes();
}

const checkClashes = function() {
    let all_tiles = document.getElementsByClassName("tile");
    for (let element of all_tiles) {
        element.firstChild.firstChild.style.color = element.getAttribute("baseColour");
        if (hasClash(element)) {
            element.firstChild.firstChild.style.color = "darkred";
            console.log(element.getAttribute("clashing"));
        }
    }
}

const clearHighlights = function() {
    let all_tiles = document.getElementsByClassName("tile");
    for (let element of all_tiles) {
        element.style.background = "silver";
    }
}
const clearSelection = function() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

const updateGuess = function(number, position) {
    x = guess.split("");
    x[position] = number;
    guess = x.join("");
    if (guess == solution) {alert("Well Done!!!")};
}

window.onload = createGrid();
const tileSize = document.getElementById("left").offsetWidth / 12;

console.log(`New Solution: ${solution}\n`);
console.log(`New Clue: ${clue}`);
