import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch, } from 'react-redux';
import {NotificationObject, selectNotifications, dismissNotification} from './notificationsSlice';

import './Notifications.sass'
import {IoSadOutline, IoClose} from 'react-icons/io5';
import classNames from 'classnames';

export const Notifications: FunctionComponent = () => {
  const {notifications} = useSelector(selectNotifications);

  if(notifications.length)
    return <div className="Notifications">
      {notifications.map((n:NotificationObject) => <Notification {...n} key={n.id} />)}
    </div>
  else
    return null
}

export const Notification:FunctionComponent<NotificationObject> = ({isError, dismissed, message, id}) => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    if(!dismissed) {
      let timeout = setTimeout(() => dispatch(dismissNotification(id)), 5000)
      return () => clearTimeout(timeout);
    }
  }, [dismissed, dispatch, id]);

  return <div className={classNames('Notification', {dismissed, isError})}>
    <button className="DismissNotification" onClick={() => dispatch(dismissNotification(id))}><IoClose/></button>
    {isError ? <IoSadOutline/> : null}
    {message}
  </div>
}
