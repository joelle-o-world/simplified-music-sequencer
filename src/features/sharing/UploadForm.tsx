import React, {FunctionComponent, FormEvent} from 'react';
import {IoIosSave, IoIosClose} from 'react-icons/io';
import {useSelector, useDispatch} from 'react-redux';
import {selectSharing, hideUploadForm} from './sharingSlice';
import {selectSequencer, setComposer, setTitle, publish} from '../sequencer/sequencerSlice';

export const UploadForm: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {showingUploadForm} = useSelector(selectSharing);
  const {title, composer} = useSelector(selectSequencer)


  if(showingUploadForm)
    return <div className="UploadFormWrapper" >
      <div className="UploadForm">
        <div className="formField">
          <label>What is your name?</label>
          <input value={composer} onChange={e => {dispatch(setComposer(e.target.value))}}/>
        </div>
        <div className="formField">
          <label>Please choose a title for your sequence:</label>
          <input value={title} onChange={e => {dispatch(setTitle(e.target.value))}} />
        </div>
        <button className="UploadFormSubmit" onClick={() => {dispatch(publish())}}><IoIosSave/>Upload</button>
        <button className="UploadFormCancel" onClick={() => {dispatch(hideUploadForm())}}>
          <IoIosClose/>Cancel
        </button>
      </div>
    </div>

  else
    return null
}
