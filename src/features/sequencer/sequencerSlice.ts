import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {PitchParse, parsePitch} from './parsePitch';


interface SequencerState {
  steps: PitchParse[];
  tempo: number;
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
}

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState,
  reducers: {
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
    }
  },
})

export const {setNote, clearNote, addSteps, setTempo} = sequencerSlice.actions;

export const selectSequencer = (state: RootState) => state.sequencer;

export default sequencerSlice.reducer;
