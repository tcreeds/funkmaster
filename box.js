FM.Box = function(x, y, generator, colors )
{
    colors = colors || {};
    this.x = x || 0;
    this.y = y || 0;
    this.generator = generator;
    this.generator.init();
    this.background = PIXI.Sprite.fromImage("blank.png");
    this.background.tint = colors.background || 0x000099;
    this.background.width = CELL_WIDTH * this.generator.width;
    this.background.height = CELL_HEIGHT * this.generator.height;
    this.background.x = x;
    this.background.y = y;
    stage.addChild(this.background);
    
    this.marker = PIXI.Sprite.fromImage("blank.png");
    this.marker.tint = colors.marker || 0xcccccc;
    this.marker.width = CELL_WIDTH;
    this.marker.height = this.generator.height * CELL_HEIGHT;
    this.marker.x = this.x;
    this.marker.y = this.y + this.marker.height;
    this.marker.anchor.set(0, 1);
    stage.addChild(this.marker);
    
    this.sprites = new PIXI.ParticleContainer(MAX_PARTICLES, {
        position: true,
        tint: true
    });
    stage.addChild(this.sprites);
    
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
    
    this.beat = this.generator.width;
}

FM.Box.prototype.tick = function()
{
    this.beat++;
    if (this.beat >= this.generator.width)
        this.beat = 0;
    
}

FM.Box.prototype.update = function()
{
    this.generator.update();
    this.marker.x = this.x + CELL_WIDTH * this.beat;
};
    
FM.Box.prototype.draw = function()
{
    this.generator.draw(this.x, this.y, this.particles);
}

FM.Box.prototype.play = function(sounds)
{
    
    this.marker.height = CELL_HEIGHT * (this.generator.play(this.beat, sounds) + 1);   
}
