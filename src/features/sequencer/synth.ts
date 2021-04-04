import EventEmitter from "events";
import {PitchParse} from "./parsePitch";

// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;

export class Synth extends EventEmitter {
  
  ctx: AudioContext;
  gain: GainNode;
  osc: OscillatorNode;

  constructor() {
    super();
    this.ctx = new AudioContext();
    this.gain = this.ctx.createGain();
    this.osc = this.ctx.createOscillator();
    this.osc.connect(this.gain);
    this.osc.type = "square"
    this.gain.connect(this.ctx.destination);
    this.gain.gain.value = 0;
    this.osc.start();
  }

  playFrequency(f:number, t:number) {
    this.osc.frequency.setValueAtTime(f, t);
    this.gain.gain.setValueAtTime(1, t);
    this.gain.gain.setTargetAtTime(0, t+.001, 0.2)
  }

  playNote(midiNumber: number, t: number) {
    let f = 440 * Math.pow(2, (midiNumber-65)/12);
    this.playFrequency(f, t)
  }

  stop(t: number) {
    this.osc.stop(t);
  }

  gracefulStop(t: number) {
    this.gain.gain.setTargetAtTime(0, t, 0.1)
    this.osc.stop(t + 2);
  }

  playSequence(sequence: PitchParse[], tempo=140, startTime=this.ctx.currentTime) {
    let tOffset = startTime - this.ctx.currentTime;
    let stepInterval = 60/tempo
    for(let i=0; i < sequence.length; ++i) {
      let t = startTime + i * stepInterval;
      let note = sequence[i].midiNumber;
      if(sequence[i].hasPitch && note !== undefined)
        this.playNote(note, t);

      setTimeout(() => {
        this.emit('step', i);
      }, t*1000 + tOffset);
    }

    this.gracefulStop(startTime + sequence.length * stepInterval)
    setTimeout(() => {
      this.emit('step', null);
    }, startTime + sequence.length * stepInterval*1000)
  }
}
