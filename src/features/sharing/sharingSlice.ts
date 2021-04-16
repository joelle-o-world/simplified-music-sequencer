import {SequencerState, setSequence} from '../sequencer/sequencerSlice';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState, AppThunk} from '../../app/store';
import {listSequences, fetchSequenceData} from '../../client-api/publishSequence';
import {synthPlay} from '../synth/synthSlice';
import {errorNotification} from '../errors/errorsSlice';

export interface PublishedSequence {
  id: string;
  title?: string;
  composer?: string;
  data?: SequencerState;
}

export interface SharingState {
  publishedSequences: PublishedSequence[];
  isRefreshing: boolean;
  showingUploadForm: boolean;
}

const initialState: SharingState = {
  publishedSequences: [],
  isRefreshing: false,
  showingUploadForm: false,
}

export const sharingSlice = createSlice({
  name: 'sharing',
  initialState,
  reducers: {
    setPublishedSequences: (state, action: PayloadAction<PublishedSequence[]>) => {
      state.publishedSequences = action.payload;
    },
    
    showUploadForm: state => {
      state.showingUploadForm = true
    },

    hideUploadForm: state => {
      state.showingUploadForm = false;
    },
  },
})
export default sharingSlice.reducer;

export const {setPublishedSequences, showUploadForm, hideUploadForm} = sharingSlice.actions;

export const refreshSequencesIndex = ():AppThunk => async (dispatch) => {
  try {
    let result = await listSequences();
    dispatch(setPublishedSequences(result.reverse()));
  } catch(err) {
    dispatch(errorNotification("There was a problem loading the shared sequences"))
  }
}

export const openSequence = (id:string):AppThunk => async (dispatch, getState) => {
  try {
    let result = await fetchSequenceData(id)
    dispatch(setSequence({
      ...result,
      composer: getState().sequencer.composer,
      title: `reply to ${result.composer}`,
      edited: false,
    }));

    if(!getState().synth.playing)
      dispatch(synthPlay())
  } catch(err) {
    dispatch(errorNotification("There was a problem opening the sequence"))
  }
}

export const selectSharing = (state: RootState) => state.sharing;
