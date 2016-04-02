var FM = FM || {};

var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;
var CANVAS_WIDTH = 320;
var CANVAS_HEIGHT = 480;

var box;
var box2;
var marker;

var bass = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88];
var treble = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77];

var beat = 0;

FM.init = function()
{
    
    console.log("init");
    var automata = new FM.Automata(8, 24);
    box = new FM.Box(0, 0, automata);
    var automata2 = new FM.Automata(8, 24);
    box2 = new FM.Box(160, 0, automata2);
    setInterval(update, 300);
    
    
}

function update()
{
    console.log("########################### ");
    if (beat % 2 == 0){
        box.update(beat);
        box.draw();
        box.play(beat, bass);
    }
    box2.update(beat);
    box2.draw();
    box2.play(beat, treble);
    
    renderer.render(stage);
    
    
    
    
    
    beat = (beat + 1) % 8;
}

