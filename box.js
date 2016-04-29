FM.Box = function( generator, data )
{
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.generator = generator;
    this.scale = data.scale;
    this.name = data.name || "Box";
    this.waveform = data.waveform;
    this.colors = data.colors || {};
    
    //container for all sprites in Box
    this.group = new PIXI.Container();
    this.group.x = data.x;
    this.group.y = data.y;
    FM.stage.addChild(this.group);
    
    //beat marker
    this.marker = PIXI.Sprite.fromImage("blank.png");
    this.marker.tint = data.colors.marker || 0x111111;
    this.marker.width = FM.CELL_WIDTH;
    this.marker.anchor.set(0, 1);
    this.group.addChild(this.marker);
    
    //cell sprite container
    this.sprites = new PIXI.ParticleContainer(FM.MAX_PARTICLES, {
        position: true,
        tint: true
    });
    this.group.addChild(this.sprites);
    
    //initializes particles for easy updating
    this.particles = [];
    for (var i = 0; i < FM.MAX_PARTICLES; i++)
    {
        var particle = PIXI.Sprite.fromImage("button.png");  
        particle.width = FM.CELL_WIDTH;
        particle.height = FM.CELL_HEIGHT;
        particle.alpha = 1;
        this.particles.push(particle);
        this.sprites.addChild(particle);
    }
    
    //background for Box - handles mouse events
    this.background = PIXI.Sprite.fromImage("blank.png");
    this.background.tint = this.colors.background || 0x000099;
    this.background.interactive = true;
    this.background.on("mousedown", (event) => this.touchStart(event));
    this.background.on("mousemove", (event) => this.drag(event));
    this.background.on("mouseup", (event) => this.touchEnd(event));
    this.background.on("click", (event) => FM.inspectBox(this, event));
    this.background.alpha = 0.5;
    this.group.addChildAt(this.background, 0);
    
    Object.defineProperty(this, "rows", {
        get: function(){ return generator.rows;},
        set: function(value){ generator.rows = value;}
    });
    Object.defineProperty(this, "columns", {
        get: function() { return generator.columns; },
        set: function(value) { generator.columns = value; }
    });
    Object.defineProperty(this, "beatsPerMeasure", {
        get: function() { return this.bpm; },
        set: function(value) { 
            this.bpm = value; 
            this.ticksPerNote = Math.floor(FM.TICKS_PER_MEASURE / this.bpm);   
            this.beatCounter = this.ticksPerNote;
        }
    });
    
    this.beat = this.generator.columns;
    this.beatsPerMeasure = data.beatsPerMeasure;
    this.volume = data.volume;
    this.attackDecayEnvelope = data.attackDecayEnvelope;
    this.waveform = data.waveform;
    this.muted = data.muted;
    this.restartOnDeath = data.restartOnDeath;
    this.shouldRestart = data.restartOnLoop;
    this.enabled = data.enabled;
    this.restart();
}

FM.Box.prototype.restart = function()
{
    this.generator.init();
    this.background.width = FM.CELL_WIDTH * this.generator.columns;
    this.background.height = FM.CELL_HEIGHT * this.generator.rows;
    this.marker.height = this.generator.rows * FM.CELL_HEIGHT;
    this.marker.y = this.marker.height;
    this.beat = this.generator.columns;
    this.beatsPerMeasure = this.bpm;
}

FM.Box.prototype.tick = function()
{
    this.beatCounter++;
    if (this.beatCounter >= this.ticksPerNote)
    {
        this.beatCounter = 0;
        this.beat++;
    }
    
    if (this.beat >= this.generator.columns){
        if (this.shouldRestart || this.restartOnDeath && !this.generator.isAlive())
            this.restart();
        this.shouldRestart = false;
        this.beat = 0;
        this.beatCounter = 0;
    }
    
    if (this.enabled && this.beatCounter == 0)
    {
        this.update();
        this.play();
    }
    
}

FM.Box.prototype.update = function()
{
    this.generator.update();
    this.marker.x = FM.CELL_WIDTH * this.beat;
};
    
FM.Box.prototype.draw = function()
{
    this.generator.draw(this.x, this.y, this.particles);
}

FM.Box.prototype.play = function()
{
    var vol = this.muted ? 0 : this.volume;
    this.marker.height = FM.CELL_HEIGHT * (this.generator.play(this.beat, this.scale, this.waveform, this.attackDecayEnvelope, this.bpm, vol) + 1);   
}

FM.Box.prototype.touchStart = function(event)
{
    this.moving = true;
    this.lastTouch = {
        x: event.data.global.x,
        y: event.data.global.y
    };
}

FM.Box.prototype.drag = function(event)
{
    if (this.moving)
    {
        this.x += event.data.global.x - this.lastTouch.x;   
        this.y += event.data.global.y - this.lastTouch.y;  
        this.group.x = this.x;
        this.group.y = this.y;
    }
    this.lastTouch = {
        x: event.data.global.x,
        y: event.data.global.y
    };
}

FM.Box.prototype.touchEnd = function(event)
{
    this.moving = false;
}
