var FM = FM || {};

var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 640;

var MAX_PARTICLES = 10000;
var renderer;
var stage;


var boxes = [];

var sounds = [];
sounds["c4"] = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88];
sounds["c5"] = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77];

var beat = 0;

window.onload = function(){
    FM.init();  
} 

FM.init = function()
{
    
    console.log("init");

    irows = undefined;
    irows = document.querySelector("#rows");
    icolumns = document.getElementById("columns");
    iscale = document.getElementById("scale");
    irestart = document.getElementById("restartButton");
    iname = undefined;
    iname = document.getElementById("nameBox");

    irows.addEventListener("change", changeRows);
    icolumns.addEventListener("change", changeColumns);
    iscale.addEventListener("change", changeScale);
    irestart.addEventListener("click", restartBox);

    iname.addEventListener("change", changeName);

    renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT);
    document.getElementById("canvasContainer").appendChild(renderer.view);

    // create the root of the scene graph
    stage = new PIXI.Container();
    
    var automata = new FM.Automata(8, 24);
    boxes.push(new FM.Box(0, 0, automata, "c4", {
        background: 0x000099,
        marker: 0x111111
    }));
    
    var automata2 = new FM.Automata(8, 24);
    boxes.push(new FM.Box(160, 0, automata2, "c5", {
        background: 0x009900,
        marker: 0x111111
    }));
    
    var automata3 = new FM.Automata(4, 8);
    boxes.push(new FM.Box(0, CELL_HEIGHT * 24, automata3, "c5", {
        background: 0x990000,
        marker: 0x111111
    }));
    
    setInterval(FM.update, 300);
    
    
}

FM.update = function()
{
    console.log("########################### ");
    for (var i = 0; i < boxes.length; i++)
    {
        if (boxes[i].enabled)
        {
            boxes[i].tick();
            boxes[i].update();
            boxes[i].draw();
            boxes[i].play();
        }
    }
    
    renderer.render(stage);
    beat = (beat + 1) % 8;
}

FM.inspectBox = function(box, event)
{
    selectedBox = box;
    
    iname.value = selectedBox.name;
    irows.value = selectedBox.generator.rows;
    icolumns.value = selectedBox.generator.columns;
    iscale.value = selectedBox.scale;
    
}

function changeName() 
{ 
    selectedBox.name = iname.value; 
};
function changeRows() 
{ 
    selectedBox.generator.rows = irows.value; 
};
function changeColumns()
{ 
    selectedBox.generator.columns = icolumns.value; 
};
function changeScale()
{ 
    selectedBox.scale = iscale.value; 
};
function restartBox()
{
    selectedBox.generator.init();
};
