var FM = FM || {};

var CELL_WIDTH = 20;
var CELL_HEIGHT = 20;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 640;

var MAX_PARTICLES = 10000;
var renderer;
var stage;
var selectedBox;

var boxes = [];

var sounds = [];
sounds["c4"] = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88];
sounds["c5"] = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77];

var beat = 0;

window.onload = function(){
    
    iname = document.getElementById("nameBox");
    irows = document.querySelector("#rows");
    icolumns = document.getElementById("columns");
    iscale = document.getElementById("scale");
    irestart = document.getElementById("restartButton");
    imute = document.getElementById("muteButton");

    iname.addEventListener("change", changeName);
    irows.addEventListener("change", changeRows);
    icolumns.addEventListener("change", changeColumns);
    iscale.addEventListener("change", changeScale);
    irestart.addEventListener("click", restartBox);
    imute.addEventListener("click", toggleMute);

    renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT);
    document.getElementById("canvasContainer").appendChild(renderer.view);

    // create the root of the scene graph
    stage = new PIXI.Container();
    
    FM.init();
    requestAnimationFrame(FM.draw);
}

FM.update = function()
{
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
    beat = (beat + 1) % 8;
}

FM.draw = function()
{
    requestAnimationFrame(FM.draw);
    renderer.render(stage);
}

FM.inspectBox = function(box, event)
{
    if (selectedBox)
        selectedBox.background.tint = selectedBox.colors.background;
    selectedBox = box;
    selectedBox.background.tint = 0x333333;
    
    iname.value = selectedBox.name;
    irows.value = selectedBox.generator.rows;
    icolumns.value = selectedBox.generator.columns;
    iscale.value = selectedBox.scale;
    
    if (selectedBox.muted)
        imute.innerText = "UNMUTE";
    else
        imute.innerText = "MUTE";
    
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
function toggleMute()
{
    selectedBox.muted = !selectedBox.muted;  
    if (selectedBox.muted)
        imute.innerText = "UNMUTE";
    else
        imute.innerText = "MUTE";
};
function restartBox()
{
    selectedBox.restart();
};
