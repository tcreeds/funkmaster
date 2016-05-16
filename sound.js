var ctx = new AudioContext();



function playTone( synth, frequency, duration, volume, waveform, attackDecay )
{
    if (FM.muted)
        return;

    synth.carrier.volume.value = volume;
    synth.carrier.oscillator.type = waveform || "square";
    synth.carrier.envelope.attack = attackDecay;
    synth.modulator.oscillator.type = synth.carrier.oscillator.type;
    synth.triggerAttackRelease(frequency, duration);
}



function playNote( props ) {
    if (FM.muted)
        return;
    var carrier = ctx.createOscillator();
    var gainNode = ctx.createGain();
    var volume = props.volume/100 * 0.4 || 0.2;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    
    carrier.type = props.waveform || 'square';

    carrier.frequency.value = props.frequency;
    
    if (props.reverb)
    {
        var reverb = ctx.createConvolver();
        reverb.buffer = FM.reverbSamples[props.reverb];
        carrier.connect( reverb );
        reverb.connect( gainNode ); 
    }
    else
        carrier.connect( gainNode );
    
    var modulator,
        modGain;
    if (props.modulator)
    {
        modulator = ctx.createOscillator();
        modulator.type = props.modulator.waveform || 'square';
        modulator.frequency.value = props.modulator.frequency;
        
        modGain = ctx.createGain();
        modGain.gain.value = props.modulator.modIndex || 40;
        
        modGain.gain.exponentialRampToValueAtTime( volume, ctx.currentTime + props.duration * props.attackDecay / 100);
        modGain.gain.exponentialRampToValueAtTime( 0.001, ctx.currentTime + props.duration);
        
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
    }
    
    gainNode.connect( ctx.destination );
    
    gainNode.gain.linearRampToValueAtTime( volume, ctx.currentTime + props.duration * props.attackDecay / 100);
    gainNode.gain.linearRampToValueAtTime( 0, ctx.currentTime + props.duration);

    modulator.start();
    carrier.start();
    
    modulator.stop( ctx.currentTime + props.duration);
    carrier.stop( ctx.currentTime + props.duration );
    
}

