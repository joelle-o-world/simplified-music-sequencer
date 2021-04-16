import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState, AppThunk} from '../../app/store';


export interface ErrorObject {
  errorMessage: string;
  dismissed?: boolean;
  id: string;
}

export interface ErrorsState {
  errors: ErrorObject[];
}

const initialState: ErrorsState = {
  errors: [],
}

function quickError(msg: string, id: string) {
  return {
    errorMessage: msg,
    id,
  }
}

export const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    errorNotification: (state, action: PayloadAction<ErrorObject|string>) => {
      let id = state.errors.length.toString()
      let errorObject = typeof action.payload === 'string'
        ? quickError(action.payload, id)
        : action.payload;

      state.errors = [...state.errors, errorObject];
    },

    dismissError: (state, action: PayloadAction<string>) => {
      let error = state.errors.find(err => err.id == action.payload)
      if(error)
        error.dismissed = true
    },
  },
});

export default errorsSlice.reducer;

export const {errorNotification, dismissError} = errorsSlice.actions;

export const selectErrors = (state: RootState) => state.errors;

export const selectUndismissedErrors = (state: RootState) => state.errors.errors.filter(err => !err.dismissed);
