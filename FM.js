var FM = FM || {};

FM.CELL_WIDTH = 20;
FM.CELL_HEIGHT = 20;
FM.CANVAS_WIDTH = 640;
FM.CANVAS_HEIGHT = 640;

FM.MAX_PARTICLES = 10000;
FM.renderer;
FM.stage;
FM.selectedBox;

FM.boxes = [];

FM.sounds = {
    "c3": [130.81, 146.83, 164.81, 174.61, 196, 220, 246.94],
    "c4": [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88],
    "c5": [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77]
};

window.onload = function(){
    
    $(".input").on("change", function(){
       if (FM.selectedBox)
           FM.selectedBox[this.getAttribute("boxProperty")] = this.value;        
    });

    irestart = document.getElementById("restartButton");
    imute = document.getElementById("muteButton");

    irestart.addEventListener("click", restartBox);
    imute.addEventListener("click", toggleMute);

    //initialize canvas
    FM.renderer = PIXI.autoDetectRenderer(FM.CANVAS_WIDTH, FM.CANVAS_HEIGHT);
    document.getElementById("canvasContainer").appendChild(FM.renderer.view);

    // create the root of the scene graph
    FM.stage = new PIXI.Container();
    
    FM.init();
    requestAnimationFrame(FM.draw);
    setInterval(FM.update, 300);
}

FM.update = function()
{
    for (var i = 0; i < FM.boxes.length; i++)
    {
        FM.boxes[i].tick();
        if (FM.boxes[i].enabled)
        {
            FM.boxes[i].update();
            FM.boxes[i].play();
        }
    }
}

FM.draw = function()
{
    requestAnimationFrame(FM.draw);
    for (var i = 0; i < FM.boxes.length; i++)
    {
        if (FM.boxes[i].enabled)
            FM.boxes[i].draw();
    }
    FM.renderer.render(FM.stage);
}

//binds inputs to Box
FM.inspectBox = function(box, event)
{
    if (FM.selectedBox)
        FM.selectedBox.background.tint = FM.selectedBox.colors.background;
    FM.selectedBox = box;
    FM.selectedBox.background.tint = 0x333333;
    
    $(".input").each(function(i, el){
         this.value = FM.selectedBox[this.getAttribute("boxProperty")];
    });
    
    if (FM.selectedBox.muted)
        imute.innerText = "UNMUTE";
    else
        imute.innerText = "MUTE";
    
}

function changeName() 
{ 
    FM.selectedBox.name = iname.value; 
};
function changeRows() 
{ 
    FM.selectedBox.generator.rows = irows.value; 
};
function changeColumns()
{ 
    FM.selectedBox.generator.columns = icolumns.value; 
};
function changeScale()
{ 
    FM.selectedBox.scale = iscale.value; 
};
function toggleMute()
{
    FM.selectedBox.muted = !FM.selectedBox.muted;  
    if (FM.selectedBox.muted)
        imute.innerText = "UNMUTE";
    else
        imute.innerText = "MUTE";
};
function restartBox()
{
    FM.selectedBox.restart();
};
