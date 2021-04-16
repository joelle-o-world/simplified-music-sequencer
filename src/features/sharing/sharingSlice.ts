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
  currentlyLoadingASequence: boolean;
  currentlyLoadingSequence: string|null;
}

const initialState: SharingState = {
  publishedSequences: [],
  isRefreshing: false,
  showingUploadForm: false,
  currentlyLoadingASequence: false,
  currentlyLoadingSequence: null,
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

    startedLoading: (state, action: PayloadAction<string>) => {
      state.currentlyLoadingASequence = true
      state.currentlyLoadingSequence = action.payload
    },

    finishedLoading: state => {
      state.currentlyLoadingASequence = false;
    },

    errorLoading: state => {
      state.currentlyLoadingASequence = false;
    },
  },
})
export default sharingSlice.reducer;

export const {setPublishedSequences, showUploadForm, hideUploadForm, startedLoading, finishedLoading, errorLoading} = sharingSlice.actions;

export const refreshSequencesIndex = ():AppThunk => async (dispatch) => {
  try {
    let result = await listSequences();
    dispatch(setPublishedSequences(result.reverse()));
  } catch(err) {
    dispatch(errorNotification("There was a problem loading the shared sequences"))
  }
}

export const openSequence = (id:string, playOnceLoaded=false):AppThunk => async (dispatch, getState) => {
  try {
    dispatch(startedLoading(id));
    let result = await fetchSequenceData(id)
    dispatch(setSequence({
      ...result,
      originalComposer: result.composer,
      originalTitle: result.title,
      composer: getState().sequencer.composer,
      title: `reply to ${result.composer}`,
      edited: false,
    }));

    dispatch(finishedLoading())

    if(playOnceLoaded && !getState().synth.playing)
      dispatch(synthPlay())
    

  } catch(err) {
    console.error(err);
    dispatch(errorNotification("There was a problem opening the sequence: "+id))
    dispatch(errorLoading());
  }
}

export const selectSharing = (state: RootState) => state.sharing;
