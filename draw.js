var MAX_PARTICLES = 10000;
var particles = [];
var renderer;
var stage;
var sprites;

window.onload = function(){    

    renderer = PIXI.autoDetectRenderer(CANVAS_WIDTH, CANVAS_HEIGHT);
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    stage = new PIXI.Container();

    
    FM.init();
}
