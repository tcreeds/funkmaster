var ctx = new AudioContext();

function playNote( frequency, duration, volume, type) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    gain.gain.value = volume || 0.5;
    // square, sine, triangle, sawtooth...
    osc.type = type || 'sawtooth';

    osc.frequency.value = frequency;

    osc.connect( gain )
    gain.connect( ctx.destination );

    osc.start();
    osc.stop( ctx.currentTime + duration );
}
