import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sequencerReducer from '../features/sequencer/sequencerSlice';
import sharingReducer from '../features/sharing/sharingSlice';
import synthReducer from '../features/synth/synthSlice';

export const store = configureStore({
  reducer: {
    sequencer: sequencerReducer,
    sharing: sharingReducer,
    synth: synthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
