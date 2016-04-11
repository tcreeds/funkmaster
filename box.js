FM.Box = function(x, y, generator, scale, colors )
{
    colors = colors || {};
    this.x = x || 0;
    this.y = y || 0;
    this.generator = generator;
    this.scale = scale;
    this.name = "Box";
    this.colors = colors;
    
    this.group = new PIXI.Container();
    this.group.x = x;
    this.group.y = y;
    stage.addChild(this.group);
    
    this.background = PIXI.Sprite.fromImage("blank.png");
    this.background.tint = colors.background || 0x000099;
    this.background.interactive = true;
    this.background.on("mousedown", (event) => this.touchStart(event));
    this.background.on("mousemove", (event) => this.drag(event));
    this.background.on("mouseup", (event) => this.touchEnd(event));
    this.background.on("click", (event) => FM.inspectBox(this, event));
    this.group.addChild(this.background);
    
    this.marker = PIXI.Sprite.fromImage("blank.png");
    this.marker.tint = colors.marker || 0xcccccc;
    this.marker.width = CELL_WIDTH;
    this.marker.anchor.set(0, 1);
    this.group.addChild(this.marker);
    
    this.sprites = new PIXI.ParticleContainer(MAX_PARTICLES, {
        position: true,
        tint: true
    });
    this.group.addChild(this.sprites);
    
    this.particles = [];

    for (var i = 0; i < MAX_PARTICLES; i++)
    {
        var particle = PIXI.Sprite.fromImage("button.png");  
        particle.width = CELL_WIDTH;
        particle.height = CELL_HEIGHT;
        particle.alpha = 0.5;
        this.particles.push(particle);
        this.sprites.addChild(particle);
    }
    
    this.beat = this.generator.columns;
    this.muted = false;
    this.enabled = true;
    this.restart();
}

FM.Box.prototype.restart = function()
{
    this.generator.init();
    this.background.width = CELL_WIDTH * this.generator.columns;
    this.background.height = CELL_HEIGHT * this.generator.rows;
    this.marker.height = this.generator.rows * CELL_HEIGHT;
    this.marker.y = this.marker.height;
}

FM.Box.prototype.tick = function()
{
    this.beat++;
    if (this.beat >= this.generator.columns)
        this.beat = 0;
    
}

FM.Box.prototype.update = function()
{
    this.generator.update();
    this.marker.x = CELL_WIDTH * this.beat;
};
    
FM.Box.prototype.draw = function()
{
    this.generator.draw(this.x, this.y, this.particles);
}

FM.Box.prototype.play = function()
{
    this.marker.height = CELL_HEIGHT * (this.generator.play(this.beat, this.scale, this.muted) + 1);   
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
