FM.Automata = function(width, height)
{
    this.columns = width;
    this.rows = height;
}

FM.Automata.prototype.constructor = FM.Automata;

FM.Automata.prototype.init = function()
{
    this.generatePlot(this.columns, this.rows);   
}

FM.Automata.prototype.generatePlot = function(columns, rows)
{
    this.currentBuffer = [];
    this.backBuffer = [];
    for (var x = 0; x < columns; x++)
    {
        this.currentBuffer.push([]);
        this.backBuffer.push([]);
        for (var y = 0; y < rows; y++)
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
                particles[counter].alpha = 1;
                particles[counter].x = i * FM.CELL_WIDTH;
                particles[counter].y = j * FM.CELL_HEIGHT;
                counter++;
            }
        }
    }
    for (var n = counter; n < particles.length; n++)
    {
        particles[n].alpha = 0;
        particles[n].x = -1000;
    }   
}

FM.Automata.prototype.play = function(beat, scale, waveform, attackDecayEnvelope, bpm, volume)
{
    var notes = FM.sounds[scale];
    var note = 0;
    for (var i = 0; i < this.currentBuffer[beat].length; i++)
        note += this.currentBuffer[beat][i];    
    note = note % (notes.length + 1);
    
    var duration = (FM.MEASURE_TIME / 1000) / bpm;
    
    if (volume > 0 && note != 0)
    {
        playNote(notes[note - 1], duration * 0.8, volume, waveform, attackDecayEnvelope);
        return note;
    }
    return 0;
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

FM.Automata.prototype.isAlive = function()
{
    var total = 0;
    for (var x = 0; x < this.currentBuffer.length; x++)
    {
        for (var y = 0; y < this.currentBuffer[x].length; y++)
        {
            total += this.currentBuffer[x][y];
        }   
    }
    return total != 0;
}