/**
 * @author      Kulin Choksi
 * @copyright   Copyright (C) 2014 Kulin Choksi
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

function checkWin() {
  var x = 0;
  while(x <= limit) {
    var id = "td" + x;
    if (document.getElementById(id).innerHTML != x + 1) {
      break;
    }
    x++;
  }
  
  if (x == limit) { // puzzle solved
  
    // store offline score with chrome local storage
    var newBestScore = false;
    if (bestScore > steps) {
      scoreManager.set(steps);
      document.getElementById('yourBestScore').innerHTML = steps; // update best score in current score board
      newBestScore = true;
    }
    
    // alert("Congratulations...!!\nYou win the game within " + steps + " steps");
    document.getElementById('stepsToSolve').innerHTML = steps;
    document.getElementById('overlay').style.display = 'block';
    var gameFinished = document.getElementById('puzzleSolved');
    
    if (newBestScore && initialHighestSteps !== bestScore) {
      document.getElementById('newBestScore').style.display = 'block';
      
    } else if (steps < randomMoves/2) {
      document.getElementById('lessThanRandomMoves').style.display = 'block';
    }
    
    if (newBestScore) {
      bestScore = steps; // udpate global best score variable
    }
    
    gameFinished.style.display = 'block';
    gameFinished.onclick = function() {
      // location.reload();
      // chrome.runtime.reload();
      resetPuzzle();
    };
  }
}
function swap() {
  var cell = this;

  if (cell.innerHTML != "&nbsp;") {
    var id = cell.id.substring(2);
    
    // search space position in possible legal moves of clicked cell
    var swapPosition = legalMoveMap[id].in_array(spacePosition); // find pointer where we can move
    
    if (swapPosition !== false) { // found legal move
      // swap cells
      var swapCellId = "td" + legalMoveMap[id][swapPosition];
      document.getElementById(swapCellId).innerHTML = cell.innerHTML;      
      cell.innerHTML = "&nbsp;";
      
      // update space position globally
      spacePosition = id;
      
      // increase step count and update display
      steps++;
      document.getElementById("steps").innerHTML = steps;      
      
      // check for winning position after move
      checkWin();
    }
  }
}

Array.prototype.in_array = function(p_val) {
  for(var i = 0, l = this.length; i < l; i++) {
    if(this[i] == p_val) {
      return i;
    }
  }
  return false;
};

/* function genRndm() {
  while(1) {
    var newRndm = Math.floor(Math.random()*limit)+1;
    if(newRndm > 0 && newRndm < gridSize && !rndm.in_array(newRndm)) {
      rndm[i] = newRndm;
      i++;
    }
    if(i == limit)
      break;
  }
} */

function randomizePuzzle() {
  var rndmMovePosition, rndmMove, cellId, rndmLength;
  var space = "&nbsp;";
  var rndmMoves = randomMoves;
  steps = 0; // reset global step counter

  // initialize with solved state
  for (var i=0; i < limit; i++) {
    rndm[i] = i+1;
  }
  
  rndm[i] = space;
  
  // take random legal moves of random numbers list
  while (rndmMoves--) {
    spacePosition = rndm.in_array("&nbsp;"); // find pointer where we can move
    rndmMovePosition = Math.floor(Math.random() * legalMoveMap[spacePosition].length);
    rndmMove = legalMoveMap[spacePosition][rndmMovePosition];
    
    // swap space box with new random position to take move
    rndm[spacePosition] = rndm[rndmMove];
    rndm[rndmMove] = space;
  }
  spacePosition = rndmMove;
  
  // assign random list to table cells
  rndmLength = rndm.length;
  for (var k = 0; k < rndmLength; k++) {
    cellId = 'td' + k;
    document.getElementById(cellId).innerHTML = rndm[k];
  }
}

function genTbl() {
  var boardTable = document.createElement('table');
  var k = 0;
  
  for(var i=0; i<rows; i++) {
    var tableRow = document.createElement('tr');
    boardTable.appendChild(tableRow);
    
      for(var j=0; j<cols; j++) {
        var tableTd = document.createElement('td');
        tableTd.className = 'boardCell';
        tableTd.id = 'td' + k;
        tableTd.onclick = swap;
        
        // tableTd.innerHTML = rndm[k];
        /* if(k < limit) {
          tableTd.innerHTML = rndm[k];
        } else {
          tableTd.innerHTML = '&nbsp;';
        } */
        
        k++;
        
        tableRow.appendChild(tableTd);
      }
  }

  document.getElementById('board').appendChild(boardTable);
}

function resetPuzzle() {
  randomizePuzzle(); // generate random solvable puzzle again
  
  // reset step counter display
  document.getElementById('steps').innerHTML = 0;
  
  // hide popup box and show new puzzle
  document.getElementById('puzzleSolved').style.display = 'none';
  document.getElementById('newBestScore').style.display = 'none';
  document.getElementById('lessThanRandomMoves').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';  
}

var legalMoveMap = {
  8: [7, 5],
  7: [8, 6, 4],
  6: [7, 3],
  5: [8, 4, 2],
  4: [7, 5, 3, 1],
  3: [6, 4, 0],
  2: [5, 1],
  1: [4, 2, 0],
  0: [3, 1]
};

var rows = 3;
var cols = 3;
var gridSize = rows * cols;
var limit = gridSize - 1;
var rndm = new Array(gridSize);
var spacePosition = 8;
var steps = 0;
var randomMoves = 100; // complexity of puzzle
var initialHighestSteps = 9999; // assuming puzzle would be solved in less steps ;-)
var bestScore = initialHighestSteps; // initialize for first time playing

// get offline score with chrome local storage
var scoreManager = new LocalScoreManager;
scoreManager.get(function(localScore){
    // fast forcing int
    bestScore = localScore * 1 || initialHighestSteps;
    document.getElementById("yourBestScore").innerHTML = bestScore === initialHighestSteps ? '?' : bestScore;
}, this);

// genRndm();
genTbl(); // create table dynamically
randomizePuzzle(); // generate random solvable puzzle

// Close button handler
window.document.getElementById('close').onclick = function() {
	chrome.app.window.current().close();
}

/* (function() {
    
  // querySelector, jQuery style
  var $ = function (selector) {
    return document.querySelectorAll(selector);
  };

  // Iterate over <td class="boardCell">
  // Use querySelector to target class boardCell having <td> tag
  var boardCells = $('.boardCell');

  // For each <td> having .boardCell
  for (var i = 0; i < boardCells.length; i++) {
    var boardCell = boardCells[i];
    
    // <td> onclick
    boardCell.onclick = swap;
  }
}) (); */
