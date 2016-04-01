FM.Automata = function(width, height)
{
    this.width = width;
    this.height = height;
}

FM.Automata.prototype.constructor = FM.Automata;

FM.Automata.prototype.init = function()
{
    this.generatePlot(this.width, this.height);   
}

FM.Automata.prototype.generatePlot = function(width, height)
{
    this.currentBuffer = [];
    this.backBuffer = [];
    for (var x = 0; x < width; x++)
    {
        this.currentBuffer.push([]);
        this.backBuffer.push([]);
        for (var y = 0; y < height; y++)
        {
            this.currentBuffer[x].push(Math.random() > 0.8 ? 1 : 0);
            this.backBuffer[x].push(0);
        }
    }
}

FM.Automata.prototype.update = function()
{
    for (var i = 0; i < this.currentBuffer.length; i++)
    {
        for (var j = 0; j < this.currentBuffer[i].length; j++)
        {
            var check = this.getNeighbors(i, j);
            if (this.currentBuffer[i][j] == 1)
            {
                if (check == 2 || check == 3)
                    this.backBuffer[i][j] = 1;
                else
                    this.backBuffer[i][j] = 0;
            }
            else
            {
                if (check === 3)
                    this.backBuffer[i][j] = 1;
                else
                    this.backBuffer[i][j] = 0;
            }
        }
    }
    
    var temp = this.currentBuffer;
    this.currentBuffer = this.backBuffer;
    this.backBuffer = temp;
}

FM.Automata.prototype.draw = function(x, y, particles)
{
    var counter = 0;
    for (var i = 0; i < this.currentBuffer.length; i++)
    {
        for (var j = 0; j < this.currentBuffer[i].length; j++)
        {
            if (this.currentBuffer[i][j] == 1)
            {
                particles[counter].x = i * CELL_WIDTH + x;
                particles[counter].y = j * CELL_HEIGHT + y;
                counter++;
            }
        }
    }
    for (var n = counter; n < particles.length; n++)
    {
        particles[n].x = -100;
        particles[n].y = -100;
    }   
}

FM.Automata.prototype.play = function(beat, sounds)
{
    var note = 0;
    for (var i = 0; i < this.currentBuffer[beat].length; i++)
        note += this.currentBuffer[beat][i];
    
    playNote(sounds[note % sounds.length], 0.3, 1, "sine");
}

FM.Automata.prototype.getNeighbors = function(x, y)
{
    var count = 0;
    for (var i = x-1; i < x+2; i++)
    {
        for (var j = y-1; j < y+2; j++)
        {
            if (i == x && j ==y)
                continue;
            if (i >= 0 && i < this.currentBuffer.length && 
                j >= 0 && j < this.currentBuffer[i].length && 
                this.currentBuffer[i][j] == 1)
                count++;            
        }
    }
    return count;
}