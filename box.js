FM.Box = function(x, y, generator)
{
    this.x = x || 0;
    this.y = y || 0;
    this.generator = generator;
    this.generator.init();
    
    this.marker = PIXI.Sprite.fromImage("button.png");
    this.marker.tint = 0xcccccc;
    this.marker.width = CELL_WIDTH;
    this.marker.height = this.generator.height * CELL_HEIGHT;
    this.marker.x = this.x;
    this.marker.y = this.y;
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
        this.particles.push(particle);
        this.sprites.addChild(particle);
    }
}

FM.Box.prototype.update = function(beat)
{
    this.generator.update();
    this.marker.x = this.x + CELL_WIDTH * beat;
};
    
FM.Box.prototype.draw = function()
{
    this.generator.draw(this.x, this.y, this.particles);
}

FM.Box.prototype.play = function(beat, sounds)
{
    
    this.generator.play(beat, sounds);   
}
