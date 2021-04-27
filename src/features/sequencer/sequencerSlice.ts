import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, AppThunk} from "../../app/store";
import {PitchParse, parsePitch} from './parsePitch';
import {publishSequence} from "../../client-api/publishSequence";
import {refreshSequencesIndex, hideUploadForm, SequenceID} from "../sharing/sharingSlice";
import {newErrorNotification, newNotification} from '../notifications/notificationsSlice'
import {StepParse} from "./SequencerStepInput";

export type SequencerStepState = PitchParse;

export interface SequencerState {
  steps: StepParse[];
  tempo: number;
  stepsPerBeat?: number;
  title: string;
  composer: string;
  edited?: boolean;
  originalTitle?: string;
  originalComposer?: string;
  originalId?: SequenceID;
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
  title: "New Sequence",
  composer: "",
  edited: false,
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

      state.edited = true;
    },

    clearNote: (state, action: PayloadAction<number>) => {
      if(action.payload > state.steps.length) {
        // TODO: Handle error.
      }

      state.steps[action.payload] = parsePitch('');
      state.edited = true;
    },

    addSteps: (state, action: PayloadAction<number>) => {
      for(let i=0; i < action.payload; ++i)
        state.steps.push(parsePitch(''));
    },

    setTempo: (state, {payload}: PayloadAction<number|string>) => {
      if(typeof payload === 'number')
        state.tempo = payload;
      else if(typeof payload == 'string') {
        let parsed = parseFloat(payload);
        if(parsed > 0 && !isNaN(parsed))
          state.tempo = parsed
      }
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
    let uploadedSequenceID = result

    dispatch(refreshSequencesIndex());
    dispatch(hideUploadForm())
    dispatch(setSequence({
      ...sequencerState,
      originalComposer: sequencerState.composer,
      originalTitle: sequencerState.title,
      originalId: uploadedSequenceID,
      edited: false,
    }))
    dispatch(newNotification("Your sequence has been uploaded!"))
  } catch(err) {
    dispatch(newErrorNotification('something went wrong uploading your sequence'))
  }

};

export const selectSequencer = (state: RootState) => state.sequencer;

export default sequencerSlice.reducer;
