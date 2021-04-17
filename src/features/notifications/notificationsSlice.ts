import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
export interface NotificationObject {
  message: string;
  dismissed?: boolean;
  isError?: boolean;
  id: string;
}

export interface NotificationsState {
  notifications: NotificationObject[];
}

const initialState: NotificationsState = {
  notifications: [],
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    newNotification: (state, action: PayloadAction<NotificationObject|string>) => {
      let id = String(state.notifications.length)
      let notification = typeof action.payload === 'string'
        ? { message: action.payload, id }
        : action.payload;

      state.notifications.push(notification);
    },

    dismissNotification: (state, action: PayloadAction<string>) => {
      let notification = state.notifications.find(n => n.id === action.payload);
      if(notification)
        notification.dismissed = true;
    },

    newErrorNotification: (state, action: PayloadAction<string>) => {
      let id = String(state.notifications.length)
      let notification = { message: action.payload, id, isError: true }
      state.notifications.push(notification);
    }
  },
});

export const {dismissNotification, newErrorNotification, newNotification} = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const selectNotifications = (state: RootState) => state.notifications;
