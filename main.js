/*
    I added multiple "species" of living cells that fight each other for space. If a cell is outnumbered by a different species, it dies.
    If a dead cell is surrounded by enough cells of the same species, it generates a new cell of that species.
    This contention, along with looser rules for overpopulation, means that the cells will pretty much never reach equilibrium.
    I currently have a random number for each species that determines ties, so one color will eventually dominate. I set it up to be able to 
    use a different random number for each tie, or each iteration, but currently it uses just one for each species for the program's lifecycle.
*/


var GRID_SIZE = 150;

var currentBuffer = [];
var backBuffer = [];

var noteCounts = [];

var noteLength = 0.28;

var species =       ["#ee0000", "#00ee00", "#0000ee", "#551a8b", "#ffa500"];
var speciesSounds = [220,       261.63,    293.66,    329.63,    349.23];
var speciesRandomCounter = [];
var randomNumbers;
var drawLoop;
var running = false;
var worker;

window.onload = function()
{
  //worker = new Worker("sound.js");
  initDraw();
  randomizeGrid();
  setInterval(iterate, 15);
  setInterval(function(){ if (running) playNote(55, noteLength/2, 2, "triangle"); }, noteLength * 2000);
  setInterval(beep, noteLength * 500);
  drawLoop = setInterval(clearDraw, noteLength * 1000);
}

function randomizeGrid()
{
  generateRandomArray();
  
  canvas.width = canvas.width;
  currentBuffer = [];
  backBuffer = [];
  for (var x = 0; x < GRID_SIZE; x++)
  {
    currentBuffer.push([]);
    backBuffer.push([]);
    for (var y = 0; y < GRID_SIZE; y++)
    {
      currentBuffer[x].push(0);
      backBuffer[x].push(0);
      if (Math.random() > 0.94)
      {
        var rand = Math.floor(Math.random() * species.length);
        currentBuffer[x][y] =  rand + 1;
      }
    }
  }
  clearDraw();
}

function beep()
{
    if (running && noteCounts)
    {
      var highestIndex = 1;
      for (var n = 1; n < noteCounts.length; n++){
        if ((noteCounts[n] > noteCounts[highestIndex] && Math.random() > 0.5) || Math.random() > 0.99)
          highestIndex = n;
      }
      document.getElementById("output").innerText = highestIndex;
      playNote(speciesSounds[highestIndex-1], noteLength - 0.05, noteCounts[n] / (GRID_SIZE * GRID_SIZE), "sawtooth");
    }
}

function start()
{
  running = true;
}

function stop()
{
  running = false;
}

function iterate()
{
  if (running){
    noteCounts = [];
    for (var n = 0; n < species.length + 1; n++)
      noteCounts.push(0);
    for (var i = 0; i < currentBuffer.length; i++)
    {
      for (var j = 0; j < currentBuffer[i].length; j++)
      {
        if (currentBuffer[i][j] > 0 )
        {
          type = processLiveCell(i, j);
        }
        else
        {
          processDeadCell(i, j);  
        }
        noteCounts[backBuffer[i][j]]++;
      }
    }

    //swap buffers
    var swap = currentBuffer;
    currentBuffer = backBuffer;
    backBuffer = swap;
  }
  //requestAnimationFrame(iterate);
}

// if live cell has too many or too few neighbors, it dies
function processLiveCell(x, y)
{
  var allies = getAlliedNeighbors(x, y);
  var enemies = getEnemyNeighbors(x, y);
  if (enemies > allies || allies + enemies < 2 || allies + enemies > 3)
    backBuffer[x][y] = 0;
  else if (allies > enemies && allies > 2)
    backBuffer[x][y] = currentBuffer[x][y];
  else
    backBuffer[x][y] = 0;
  
}

// if dead cell has 3 neighbors, new live cell
function processDeadCell(x, y)
{
  var conqueror = getConqueror(x, y);
  if (conqueror !== 0)
    backBuffer[x][y] = conqueror;
  else
    backBuffer[x][y] = 0;
}

// calculate allies around cell
function getAlliedNeighbors(x, y)
{
  var neighbors = 0;
  for (var i = x-1; i <= x+1; i++)
  {
    for (var j = y-1; j <= y+1; j++)
    {
      if (i >= 0 && i < currentBuffer.length && j >= 0 && j < currentBuffer[i].length && !(i === x && j === y))
      {
        if (currentBuffer[i][j] === currentBuffer[x][y])
          neighbors += 1;  
      }
    }
  }
  return neighbors;
}

// calculate enemies around cell
function getEnemyNeighbors(x, y)
{
  var neighbors = 0;
  for (var i = x-1; i <= x+1; i++)
  {
    for (var j = y-1; j <= y+1; j++)
    {
      if (i >= 0 && i < currentBuffer.length && j >= 0 && j < currentBuffer[i].length && !(i === x && j === y))
      {
        if (currentBuffer[i][j] !== currentBuffer[x][y])
          neighbors += 1;  
      }
    }
  }
  return neighbors;
}

// calculate enemies around cell
function getConqueror(x, y)
{
  var neighbors = [];
  for (var n = 0; n < species.length; n++)
    neighbors.push(0);
  for (var i = x-1; i <= x+1; i++)
  {
    for (var j = y-1; j <= y+1; j++)
    {
      if (i >= 0 && i < currentBuffer.length && j >= 0 && j < currentBuffer[i].length && !(i === x && j === y) && currentBuffer[i][j] !== 0)
      {
        if (currentBuffer[i][j] !== currentBuffer[x][y])
          neighbors[currentBuffer[i][j] - 1] += 1;  
        if (neighbors.length === 4)
          console.log("wtf");
      }
    }
  }
  
  var total = 0;
  var highest = 0;
  for (var n = 0; n < species.length; n++)
  {
    total += neighbors[n];
    if (neighbors[n] > neighbors[highest] + Math.random()-0.5)
      highest = n;
  }
  if (total < 2 || total > 2)
    return 0;
  return highest + 1;
}

//currently only uses one value, but supports many random values
function generateRandomArray()
{
  randomNumbers = [];
  speciesRandomCounter = [];
  for (var x = 0; x < species.length; x++)
  {
    speciesRandomCounter[x] = Math.floor(Math.random() * GRID_SIZE);
    randomNumbers.push([]);
    for (var y = 0; y < GRID_SIZE; y++)
    {
      randomNumbers[x].push(Math.random());    
    }
  }

}