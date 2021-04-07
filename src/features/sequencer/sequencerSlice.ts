import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, AppThunk} from "../../app/store";
import {PitchParse, parsePitch} from './parsePitch';
import {publishSequence} from "../../client-api/publishSequence";
import {refreshSequencesIndex, hideUploadForm} from "../sharing/sharingSlice";

export type SequencerStepState = PitchParse;

export interface SequencerState {
  steps: PitchParse[];
  tempo: number;
  stepsPerBeat?: number;
  title: string;
  composer: string;
}

const initialState: SequencerState = {
  steps: [
    parsePitch(''),
    parsePitch(''),
    parsePitch(''),
    parsePitch(''),
    parsePitch(''),
    parsePitch(''),
    parsePitch(''),
    parsePitch(''),
  ],
  tempo: 140,
  stepsPerBeat: 2,
  title: "Untitled Sequence",
  composer: "",
}

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState,
  reducers: {
    setSequence: (state, action: PayloadAction<SequencerState>) => {
      return action.payload;
    },
    setNote: (state, action: PayloadAction<{stepIndex: number, newNote:string|PitchParse}>) => {
      if(action.payload.stepIndex > state.steps.length) {
        // TODO: handle error.
      }
      
      let {newNote} = action.payload
      if(typeof newNote === 'string')
        state.steps[action.payload.stepIndex] = parsePitch(newNote);
      else
        state.steps[action.payload.stepIndex] = newNote
    },

    clearNote: (state, action: PayloadAction<number>) => {
      if(action.payload > state.steps.length) {
        // TODO: Handle error.
      }

      state.steps[action.payload] = parsePitch('');
    },

    addSteps: (state, action: PayloadAction<number>) => {
      for(let i=0; i < action.payload; ++i)
        state.steps.push(parsePitch(''));
    },

    setTempo: (state, action: PayloadAction<number>) => {
      state.tempo = action.payload;
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    setComposer: (state, action: PayloadAction<string>) => {
      state.composer = action.payload;
    },

    clearComposerAndTitle: state => {
      state.composer = "";
      state.title = "";
    },

    doubleSequence: state => {
      let clone = JSON.parse(JSON.stringify(state.steps))
      state.steps = [...state.steps, ...clone];
    },
  },
})

export const {setSequence, setNote, clearNote, addSteps, setTempo, doubleSequence, setTitle, setComposer} = sequencerSlice.actions;


export const publish = (): AppThunk => async (dispatch, getState) => {
  let sequencerState = getState().sequencer;
  try {
    let result = await publishSequence(sequencerState);

    dispatch(refreshSequencesIndex());
    dispatch(hideUploadForm())
  } catch(err) {
    throw err;
  }

};

export const selectSequencer = (state: RootState) => state.sequencer;

export default sequencerSlice.reducer;
