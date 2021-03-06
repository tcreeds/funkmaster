var FM = FM || {};

FM.CELL_WIDTH = 20;
FM.CELL_HEIGHT = 20;
FM.CANVAS_WIDTH = 640;
FM.CANVAS_HEIGHT = 640;

FM.MAX_PARTICLES = 600;
FM.MEASURE_TIME = 900;
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

FM.loader = new AudioSampleLoader();
FM.loader.src = [
    "soundfiles/IMreverbs/Block Inside.wav",
    "soundfiles/IMreverbs/Bottle Hall.wav",
    "soundfiles/IMreverbs/Cement Blocks 1.wav",
    "soundfiles/IMreverbs/Cement Blocks 2.wav",
    "soundfiles/IMreverbs/Chateau de Logne, Outside.wav",
    "soundfiles/IMreverbs/Conic Long Echo Hall.wav",
    "soundfiles/IMreverbs/Deep Space.wav",
    "soundfiles/IMreverbs/Derlon Sanctuary.wav",
    "soundfiles/IMreverbs/Direct Cabinet N1.wav",
    "soundfiles/IMreverbs/Direct Cabinet N2.wav",
    "soundfiles/IMreverbs/Direct Cabinet N3.wav",
    "soundfiles/IMreverbs/Direct Cabinet N4.wav",
    "soundfiles/IMreverbs/Five Columns.wav",
    "soundfiles/IMreverbs/Five Columns Long.wav",
    "soundfiles/IMreverbs/French 18th Century Salon.wav",
    "soundfiles/IMreverbs/Going Home.wav",
    "soundfiles/IMreverbs/Greek 7 Echo Hall.wav",
    "soundfiles/IMreverbs/Highly Damped Large Room.wav",
    "soundfiles/IMreverbs/In The Silo.wav",
    "soundfiles/IMreverbs/In The Silo Revised.wav",
    "soundfiles/IMreverbs/Large Bottle Hall.wav",
    "soundfiles/IMreverbs/Large Long Echo Hall.wav",
    "soundfiles/IMreverbs/Large Wide Echo Hall.wav",
    "soundfiles/IMreverbs/Masonic Lodge.wav",
    "soundfiles/IMreverbs/Musikvereinsaal.wav",
    "soundfiles/IMreverbs/Narrow Bumpy Space.wav",
    "soundfiles/IMreverbs/Nice Drum Room.wav",
    "soundfiles/IMreverbs/On a Star.wav",
    "soundfiles/IMreverbs/Parking Garage.wav",
    "soundfiles/IMreverbs/Rays.wav",
    "soundfiles/IMreverbs/Right Glass Triangle.wav",
    "soundfiles/IMreverbs/Ruby Room.wav",
    "soundfiles/IMreverbs/Scala Milan Opera Hall.wav",
    "soundfiles/IMreverbs/Small Drum Room.wav",
    "soundfiles/IMreverbs/Small Prehistoric Cave.wav",
    "soundfiles/IMreverbs/St Nicolaes Church.wav",
    "soundfiles/IMreverbs/Trig Room.wav",
    "soundfiles/IMreverbs/Vocal Duo.wav",
];
FM.loader.ctx = ctx;
FM.loader.onload = ()=>{
    FM.reverbSamples = {};
    var options = [];
    for (var i = 0; i < FM.loader.src.length; i++)
    {
        var name = FM.loader.src[i].slice(21, FM.loader.src[i].length - 4);
        FM.reverbSamples[name] = FM.loader.response[i];
        options.push(`<option value="${name}">${name}</option>`);
    }
    $("#reverb").append(options);
}
FM.loader.send();

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
    justclicked = false;
    //initialize canvas
    FM.renderer = PIXI.autoDetectRenderer(FM.CANVAS_WIDTH, FM.CANVAS_HEIGHT);
    document.getElementById("canvasContainer").appendChild(FM.renderer.view);
            
    FM.setInputCallbacks();

    // create the root of the scene graph
    var stage = new PIXI.Container();
    FM.stage = new PIXI.Container();
    stage.addChild(FM.stage);
    
    FM.loadConfiguration();
}

FM.update = function()
{
    var updated = false;
    this.beat = this.beat + 1 % FM.TICKS_PER_MEASURE;
    for (var i = 0; i < FM.boxes.length; i++)
    {
        if (FM.boxes[i].tick())
            updated = true;
    }
    if (updated)
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

FM.saveConfiguration = function(name)
{
    FM.currentConfiguration.configName = name;
    FM.currentConfiguration.boxes = [];
    for (var i = 0; i < FM.boxes.length; i++)
        FM.currentConfiguration.boxes.push(FM.boxes[i].toJSON());
    var str = JSON.stringify(FM.currentConfiguration);
    $.ajax({
        type: "POST",
        url: "/saveConfig",
        data: str,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert(data);},
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}

FM.loadConfiguration = function(name)
{
    if (name == undefined || name == "")
        name = "Default.json";
    else
        name = "./json/" + name + ".json";
    $.getJSON(name, function(data){
        
        while (FM.boxes.length > 0)
        {
            var box = FM.boxes.pop();
            box.destroy();
        }
        
        FM.currentConfiguration = data;
        for (var i = 0; i < data.boxes.length; i++){
            FM.addBox(data.boxes[i]);
        }

        clearInterval(FM.updateLoop);
        FM.update();
        FM.updateLoop = setInterval(FM.update, FM.MEASURE_TIME / FM.TICKS_PER_MEASURE);
    });
}

//binds inputs to Box
FM.inspectBox = function(box, event)
{
    FM.clearSelectedBox();

    $(".boxData").css("display", "block");
    FM.selectedBox = box;
    FM.selectedBox.background.tint = 0xFFFFFF;

    justclicked = true;

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

FM.clearSelectedBox = function()
{
    if (FM.selectedBox)
    {
        $(".boxData").css("display", "none");
        FM.selectedBox.background.tint = FM.selectedBox.colors.background;
        FM.selectedBox = undefined;
    }
}

FM.setInputCallbacks = function () 
{
    $("canvas").on("mousedown", function(e){
        
        if (!justclicked && FM.selectedBox)
        {
            FM.clearSelectedBox();
        }
        else if (!justclicked)
        {
            FM.lastMousePosition = { x: e.pageX, y: e.pageY }; 
        }
        justclicked = false;
    });
    $("canvas").on("mousemove", function(e){
        if (FM.lastMousePosition)
        {
            FM.stage.x += e.pageX - FM.lastMousePosition.x;
            FM.stage.y += e.pageY - FM.lastMousePosition.y;
            FM.lastMousePosition.x = e.pageX;
            FM.lastMousePosition.y = e.pageY;
        }
    });
    $("canvas").on("mouseup mouseleave", function(e){
        FM.lastMousePosition = undefined;
    });
    $("canvas").on("mousewheel", function(e){
        var delta = e.originalEvent.wheelDelta / 1000;
        FM.stage.scale.x = FM.stage.scale.x * (1+delta);
        FM.stage.scale.y = FM.stage.scale.y * (1+delta);
        return false;
    });   
}

FM.addBox = function(data)
{
    data = data || FM.defaultBox;
    var generator = new FM[data.generator.type](data.columns, data.rows);
    FM.boxes.push(new FM.Box(generator, data));
}

FM.removeBox = function()
{
    if (FM.selectedBox)
    {
        for (var i = 0; i < FM.boxes.length; i++)
        {
            if (FM.boxes[i] == FM.selectedBox)
            {
                var box = FM.selectedBox;
                FM.clearSelectedBox();
                FM.boxes.splice(i,1);
                box.destroy();
                break;
            }
        }
    }
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

function pause()
{
   FM.paused = !FM.paused;
}

FM.defaultBox = {
    "x": 0,
    "y": 5,
    "scale": "c4",
    "waveform": "square",
    "attackDecayEnvelope": 5,
    "reverb": "",
    "beatsPerMeasure": 4,
    "rows": 16,
    "columns": 4,
    "restartOnDeath": true,
    "restartOnLoop": false,
    "volume": 50,
    "muted": false,
    "enabled": true,
    "colors":{
        "background": "0x009900",
        "cell": "0x000000"
    },
    "generator": {
        type: "Automata",
        toroidal: true,
        lowBound: 3,
        highBound: 4
    },
    modulator: {
        waveform: 'square',
        frequency: 220,
        harmonicity: 2,
        modIndex: 0.5
    }
};
