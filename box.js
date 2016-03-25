FM.Box = function(width, height, generator)
{
    
    this.width = width;
    this.height = height;
    this.generator = generator;
    this.generator.init();
    
    this.sprites = new PIXI.ParticleContainer(MAX_PARTICLES, {
        position: true,
        tint: true
    });
    stage.addChild(this.sprites);
    
    this.particles = [];

    for (var i = 0; i < MAX_PARTICLES; i++)
    {
        var particle = PIXI.Sprite.fromImage("button.png");  
        particle.width = GRID_WIDTH;
        particle.height = GRID_HEIGHT;
        this.particles.push(particle);
        this.sprites.addChild(particle);
    }
}

FM.Box.prototype.update = function()
{
    this.generator.update();
};
    
FM.Box.prototype.draw = function()
{
    this.generator.draw(this.particles);
}

FM.Box.prototype.play = function(beat)
{
    this.generator.play(beat);   
}
