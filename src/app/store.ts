import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sequencerReducer from '../features/sequencer/sequencerSlice';
import sharingReducer from '../features/sharing/sharingSlice';

export const store = configureStore({
  reducer: {
    sequencer: sequencerReducer,
    sharing: sharingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
