import EventEmitter from "events";
import {PitchParse} from "../sequencer/parsePitch";
import {SequencerState} from "../sequencer/sequencerSlice";

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
    this.gain.gain.setTargetAtTime(0, t, 0.1)
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

let persistantSynth: Synth;
const getPersistantSynth = () => {
  if(!persistantSynth)
    persistantSynth = new Synth();
  return persistantSynth
}

export function playPitch(midiNumber: number) {
  let synth = getPersistantSynth();
  synth.playNote(midiNumber, synth.ctx.currentTime);
}

export function playSequence(
  sequence:SequencerState, 
  options:{startTime?: number; looping?:boolean;}={},
  synth = getPersistantSynth(),
) {
  const ctx = synth.ctx;
  const startTime = options.startTime || (ctx.currentTime+.3);
  const at = (t: number, f: () => void) => {
    setTimeout(f, 1000*(t - ctx.currentTime));
  }

  /// Number of steps to schedule at once
  const scheduleChunkSize = Math.ceil(sequence.steps.length / 8);

  const events = new EventEmitter();

  let nextStep = 0;
  let nextStepTime = startTime;

  let playing = true;
  const stop = (t: number = nextStepTime) => {
    playing = false
    synth.stop(t);
    at(t+.2, () => events.emit('finish'))
  }

  let looping = options.looping || false;
  let setLooping = (val: boolean):void => {
    looping = val
  };

  const scheduleMore = () => {
    if(!playing)
      return ;
    events.emit('schedule');
    const stepDuration = 60 / (sequence.tempo * (sequence.stepsPerBeat||2));


    // Schedule the notes
    for(let i=0; i < scheduleChunkSize; ++i) {

      // Handle looping / stopping at end
      if(nextStep >= sequence.steps.length) {
        if(looping)
          nextStep = 0;
        else {
          stop(nextStepTime);
          return ;
        }
      }

      let step = sequence.steps[nextStep];
      let midiNumber = step.midiNumber;
      if(midiNumber !== undefined)
        synth.playNote(midiNumber, nextStepTime);
      const stepNumber = nextStep;
      at(nextStepTime, () => events.emit('step', stepNumber))

      nextStep++;
      nextStepTime += stepDuration
    }

    // Schedule next reshedule
    at(nextStepTime - .03, () => scheduleMore());
  }

  const updateSequence = (seq: SequencerState) => {
    sequence = seq;
  }

  // Start it running!
  scheduleMore();


  return {
    events,
    setLooping,
    stop,
    updateSequence,
  }
}
