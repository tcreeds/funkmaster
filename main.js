var FM = FM || {};

var GRID_WIDTH = 20;
var GRID_HEIGHT = 20;
var box;
var marker;

var sounds = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77];

var beat = 0;
var measureWidth = 4;

FM.init = function()
{
    marker = PIXI.Sprite.fromImage("button.png");
    marker.tint = 0xcccccc;
    marker.width = GRID_WIDTH;
    marker.height = 480;
    marker.x = 0;
    marker.y = 0;
    stage.addChild(marker);
    
    var automata = new FM.Automata(8, 24);
    box = new FM.Box(160, 480, automata);
    setInterval(update, 300);
    
    
}

function update()
{
    marker.x = beat * GRID_WIDTH;
    box.update();
    box.draw();
    renderer.render(stage);
    
    box.play(beat);
    
    
    
    beat = (beat + 1) % 8;
}

