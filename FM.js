var FM = FM || {};

FM.CELL_WIDTH = 20;
FM.CELL_HEIGHT = 20;
FM.CANVAS_WIDTH = 640;
FM.CANVAS_HEIGHT = 640;

FM.MAX_PARTICLES = 600;
FM.MEASURE_TIME = 600;
FM.TICKS_PER_MEASURE = 12;
FM.renderer;
FM.stage;
FM.selectedBox;
FM.muted = false;

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
    $(".checkbox").on("click", function(){
        if (FM.selectedBox){
            FM.selectedBox[this.getAttribute("boxProperty")] = this.checked;
        }
    });

    //initialize canvas
    FM.renderer = PIXI.autoDetectRenderer(FM.CANVAS_WIDTH, FM.CANVAS_HEIGHT);
    document.getElementById("canvasContainer").appendChild(FM.renderer.view);
    FM.input = new InputManager(FM.renderer.view);

    // create the root of the scene graph
    FM.stage = new PIXI.Container();
    
    
    $.getJSON("data.json", function(data){
        for (var i = 0; i < data.boxes.length; i++){
            (function(box){
                var generator = new FM[box.generator](box.columns, box.rows);
                FM.boxes.push(new FM.Box(generator, box));
            })(data.boxes[i]);
        }
        
        FM.update();
        FM.updateLoop = setInterval(FM.update, FM.MEASURE_TIME / FM.TICKS_PER_MEASURE);
    });
}

FM.update = function()
{
    for (var i = 0; i < FM.boxes.length; i++)
    {
        FM.boxes[i].tick();
    }
    FM.draw();
}

FM.draw = function()
{
    //requestAnimationFrame(FM.draw);
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
    $(".checkbox").each(function(i, el){
        this.checked = FM.selectedBox[this.getAttribute("boxProperty")]; 
    });
    
    if (FM.selectedBox.muted)
        $("#muteButton").text("UNMUTE");
    else
        $("#muteButton").text("MUTE");
    
}

function toggleMute(btn)
{
    FM.selectedBox.muted = !FM.selectedBox.muted;  
    if (FM.selectedBox.muted)
        btn.innerText = "UNMUTE";
    else
        btn.innerText = "MUTE";
};
function toggleMuteAll(btn)
{
    FM.muted = !FM.muted;  
    if (FM.muted)
        btn.innerText = "UNMUTE ALL";
    else
        btn.innerText = "MUTE ALL";
};
function restartBox(btn)
{
    FM.selectedBox.shouldRestart = true;
};
function restartAll()
{
    for (var i = 0; i < FM.boxes.length; i++)
    {
        FM.boxes[i].restart();
    }
    clearInterval(FM.updateLoop);
    FM.update();
    FM.updateLoop = setInterval(FM.update, FM.MEASURE_TIME / FM.TICKS_PER_MEASURE);
};
