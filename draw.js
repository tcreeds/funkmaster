var canvas;
var context;
var cellWidth;
var cellHeight;
var firstDraw = true;

function initDraw()
{
  canvas = document.getElementById("canvas1");
  context = canvas.getContext("2d");
  cellWidth = canvas.width / GRID_SIZE;
  cellHeight = canvas.height / GRID_SIZE;
}

function draw()
{
  for (var x = 0; x < currentBuffer.length; x++)
  {
    for (var y = 0; y < currentBuffer[x].length; y++)
    {
      if (firstDraw || currentBuffer[x][y] !== backBuffer[x][y])
      {
        context.fillStyle = (currentBuffer[x][y] === 0) ? "#ffffff" : species[currentBuffer[x][y] - 1];
        context.fillRect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);
      }
      
    }
  }
  firstDraw = false;
}

function clearDraw()
{
  return;
  canvas.width = canvas.width;
  for (var x = 0; x < currentBuffer.length; x++)
  {
    for (var y = 0; y < currentBuffer[x].length; y++)
    {
      if (currentBuffer[x][y] !== 0)
      {
        context.fillStyle = species[currentBuffer[x][y] - 1];
        context.fillRect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);
      }
      
    }
  }
}