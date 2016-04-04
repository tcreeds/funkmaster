var FM = FM || {};

var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 640;

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
    box = new FM.Box(0, 0, automata, {
        background: 0x000099,
        marker: 0x111111
    });
    
    var automata2 = new FM.Automata(8, 24);
    box2 = new FM.Box(160, 0, automata2, {
        background: 0x009900,
        marker: 0x111111
    });
    
    setInterval(update, 300);
    
    
}

function update()
{
    console.log("########################### ");
    if (beat % 2 == 0){
        box.tick();
        box.update();
        box.draw();
        box.play(bass);
    }
    box2.tick();
    box2.update(beat);
    box2.draw();
    box2.play(treble);
    
    renderer.render(stage);
    
    
    
    
    
    beat = (beat + 1) % 8;
}

