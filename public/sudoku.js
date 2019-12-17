const legalInput = "123456789".split("");
const game = window.game
const solution = window.seed;
const clue = window.seedClue;
let gameWon = false;
let guess = clue;

const rightCol = document.getElementById("right");
const leftCol = document.getElementById("left");
const board = document.createElement("div");
board.id = "board";

let paused = false

let clues = 0;
let unfilled = 0;
let filled = 0;

const modal = document.getElementById("pause-or-victory-modal");
// const leftDiv = document.getElementById("left");
// const rightDiv = document.getElementById("right");
const victoryButton = document.getElementById("victory-test");
let victoryMessage = "<p><h2>Well Done!!!</h2></p>";
let pausedMessage = `Paused`;

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
            let events = document.createElement("span");
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
                tileHTML = "<span />"
                numValue = clue[tileID - 1];
                tile.setAttribute("filled", "true");
                tile.setAttribute("baseColour", "midnightblue");
                tileHTML += numValue;
                clues += 1;
            } else {
                tileHTML = `<input type='text' inputmode='tel' size='1' maxlength='1'
                onmouseover="this.focus();this.select()"
                oninput="updateContents(this.parentElement.parentElement,this.value);
                updateGuess(this.value, ${tileID - 1});checkvalue(this)"
                onmouseout="clearSelection()"/>`;
                tile.setAttribute("filled", "false");
                tile.setAttribute("baseColour", "darkslategrey");
            };
            numBox.innerHTML = tileHTML;
            tile.addEventListener("mouseover", function() {highlightNeighbours(tile)});
            tile.addEventListener("mouseout", function() {clearHighlights()});
            tile.setAttribute("clashing", "false");
            tile.setAttribute("contents", numValue);
            tile.appendChild(numBox);
            square.appendChild(tile);
            leftCol.appendChild(board); 
            tileCounter++;           
        }
        board.appendChild(square);
        unfilled = 81 - clues;
    }
}

const updateContents = function(obj, val) {
    obj.setAttribute("contents", val);
}

const winGame = function() {
    paused = true;
    gameWon = true;
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
            element.style.background = "gainsboro";
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
        }
    }
}

const filledString = function() {
    return `Completed: ${filled}/${unfilled}`;
}

const showFilled = function() {
    document.getElementById("complete-count").innerHTML = filledString()  
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

const showVictory = function() {
    modal.style.setProperty("--modalTop", modalTop);
    modal.style.setProperty("--modalSize", modalSize);
    victoryMessage = `<p><h2>Well Done!</h2></p><p><h4>${filledString()}</p></h4>`
    modal.firstChild.innerHTML = victoryMessage;     
    modal.style.backgroundImage = `url("fireworks.gif")`;         
    modal.style.backgroundSize = "cover";    
    modal.style.backgroundBlendMode = "saturation";     
    modal.style.display = "flex";
}

const updateGuess = function(number, position) {
    if (legalInput.includes(number)) {
        x = guess.split("");
        x[position] = number;
        guess = x.join("");
        if (gameWon == false) {filled += 1};
    }
    else {
        if ((filled > 0) && (gameWon == false)) {
        filled -= 1;            
        }
    }
    if (guess == solution) {
        winGame();
        showVictory();
    };
    showFilled();   
}

const vanishTiles = function() {
    let all_tiles = document.getElementsByClassName("tile");
    for (let element of all_tiles) {
        element.firstChild.firstChild.style.color = "transparent";
    }
}
const unVanishTiles = function() {
    let all_tiles = document.getElementsByClassName("tile");
    for (let element of all_tiles) {
        element.firstChild.firstChild.style.color = element.getAttribute("baseColour");
    }
}

const pause = function() {
    vanishTiles();        
    paused = true;
    modal.style.setProperty("--modalTop", modalTop);
    modal.style.setProperty("--modalSize", modalSize);
    pausedMessage = `<h1>Paused</h1> <h4><p>${filledString()}</p></h4>`;    
    modal.firstChild.innerHTML = pausedMessage;
    modal.style.backgroundImage = `url("snow.gif")`;             
    modal.style.display = "flex";
}

const unpause = function() {
    paused = false;
    unVanishTiles();
    modal.style.display = "none";
}

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyP') {
        clearSelection();
        if (paused == false) {
            pause();
        }
    } else {
        unpause();        
    }
});

document.onvisibilitychange = function() {
    if (document.hidden) {
        if (paused == false) {pause()}
    }
}

window.onload = createGrid();
window.onload = showFilled();

let windowWidth = screen.availWidth;
let windowHeight = screen.availHeight;
let bodyHeight = screen.availHeight;
let modalSize = `${document.getElementById("board").offsetWidth + 10}px`;
let modalTop = `${document.getElementById("board").offsetTop - 4}px`;

const width25 = function() {(windowWidth / 100) * 25};
const width75 = function() {(windowWidth / 100) * 75};
const height25 = function() {(windowHeight / 100) * 25};
const height75 = function() {(windowHeight / 100) * 75};

const resizeElements = function() {
    windowWidth = screen.availWidth;
    windowHeight = screen.availHeight;
    bodyWidth = screen.availWidth;    
    bodyHeight = screen.availHeight;
    document.body.style.setProperty("--bodyWidth", windowWidth);    
    document.body.style.setProperty("--bodyHeight", windowHeight);
    if (window.screen.orientation == "portrait") {
        leftCol.style.setProperty("--divWidth", windowWidth);
        rightCol.style.setProperty("--divWidth", windowWidth);
        leftCol.style.setProperty("--divHeight", height75());
        rightCol.style.setProperty("--divHeight", height25());        
    }
    else {
        leftCol.style.setProperty("--divWidth", width75());
        rightCol.style.setProperty("--divWidth", width25());
        leftCol.style.setProperty("--divHeight", windowHeight);
        rightCol.style.setProperty("--divHeight", windowHeight); 
    }
    modalSize = `${document.getElementById("board").offsetWidth + 10}px`;
    modalTop = `${document.getElementById("board").offsetTop - 4}px`;
    modal.style.setProperty("--modalTop", modalTop);
    modal.style.setProperty("--modalSize", modalSize);
}

window.onresize = resizeElements();

ScreenOrientation.onchange = resizeElements();

window.onclick = function(event) {
    if (event.target == modal) {
        paused = false;
        unpause();
    }
} 