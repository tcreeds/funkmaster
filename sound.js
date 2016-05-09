var ctx = new AudioContext();

function playNote( frequency, duration, volume, waveform, attackDecay, reverb) {
    if (FM.muted)
        return;
    var osc = ctx.createOscillator();
    var gainNode = ctx.createGain();
    volume = volume/100 * 0.4 || 0.2;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    // square, sine, triangle, sawtooth...
    osc.type = waveform || 'sawtooth';

    osc.frequency.value = frequency;
    osc.connect( gainNode );
    if (reverb)
    {
        var reverb = ctx.createConvolver();
        reverb.buffer = FM.reverbSample;
        gainNode.connect( reverb );
        reverb.connect( ctx.destination );
    }
    else
        gainNode.connect( ctx.destination );
    
    gainNode.gain.linearRampToValueAtTime( volume, ctx.currentTime + duration * attackDecay / 100);
    gainNode.gain.linearRampToValueAtTime( 0, ctx.currentTime + duration);

    osc.start();
    
    osc.stop( ctx.currentTime + duration );
}
