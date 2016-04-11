var ctx = new AudioContext();

function playNote( frequency, duration, volume, type) {
    //console.log(frequency);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    gain.gain.value = volume || 0.5;
    // square, sine, triangle, sawtooth...
    osc.type = type || 'sawtooth';

    osc.frequency.value = frequency;

    osc.connect( gain )
    gain.connect( ctx.destination );

    osc.start();

    // remove the node two seconds from
    // the current audio time
    osc.stop( ctx.currentTime + duration );
}
