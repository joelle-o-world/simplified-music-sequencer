import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, AppThunk} from "../../app/store";
import {playSequence} from './synth';

export interface SynthState {
  playing: boolean;
  looping: boolean;
  nowPlayingStep: number | null;
}

const initialState: SynthState = {
  playing: false,
  looping: false,
  nowPlayingStep: null,
}

export const synthSlice = createSlice({
  name: 'synth',
  initialState,
  reducers: {
    startPlaying: state => {
      state.playing = true;
      state.looping = false;
    },
    startLooping: state => {
      state.playing = true;
      state.looping = true;
    },
    stopPlaying: state => {
      state.playing = false;
      state.looping = false;
      state.nowPlayingStep = null;
    },
    unloop: state => {
      state.looping = false;
    },
    setNowPlayingStep: (state, action:PayloadAction<number>) => {
      state.nowPlayingStep = action.payload;
    },
    finishedPlaying: state => {
      state.playing = false;
      state.looping = false;
      state.nowPlayingStep = null;
    }
  },
});

export const {startLooping, stopPlaying, startPlaying, setNowPlayingStep, finishedPlaying, unloop} = synthSlice.actions;
export default synthSlice.reducer
export const selectSynth = (state: RootState) => state.synth;

export const synthPlay = (looping=false): AppThunk => async (dispatch, getState) => {
  if(looping)
    dispatch(startLooping())
  else
    dispatch(startPlaying())

  const sequence = getState().sequencer;
  const {events, updateSequence, setLooping, stop} = playSequence(sequence, {looping})

  events.on('step', n => dispatch(setNowPlayingStep(n))) 
  events.on('schedule', () => {
    let state = getState();
    updateSequence(state.sequencer);
    setLooping(state.synth.looping)
    if(!state.synth.playing)
      stop();
  })
  events.on('finish', () => {
    dispatch(finishedPlaying());
  })
}
