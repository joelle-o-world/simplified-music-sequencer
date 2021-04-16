import React, {FunctionComponent, useEffect, useState} from 'react';
import {useSelector, useDispatch, } from 'react-redux';
import {selectUndismissedErrors, ErrorObject, dismissError, selectErrors} from './errorsSlice';

import './ErrorNotifications.sass'
import {IoSadOutline, IoClose} from 'react-icons/io5';
import classNames from 'classnames';

export const ErrorNotifications: FunctionComponent = () => {
  const {errors} = useSelector(selectErrors)

  if(errors.length)
    return <div className="ErrorNotifications">
      {errors.map(e => <ErrorNotification error={e} key={e.errorMessage} />)}
    </div>
  else
    return null
}

export const ErrorNotification:FunctionComponent<{error:ErrorObject}> = ({error}) => {

  const dispatch = useDispatch();
  
  let {dismissed, errorMessage, id} = error
  
  useEffect(() => {
    if(!dismissed) {
      let timeout = setTimeout(() => dispatch(dismissError(error.id)), 5000)
      return () => clearTimeout(timeout);
    }
  }, [dismissed]);

  return <div className={classNames('ErrorNotification', {dismissed})}>
    <button className="DismissError" onClick={() => dispatch(dismissError(id))}><IoClose/></button>
    <IoSadOutline/>
    {errorMessage}
  </div>
}
