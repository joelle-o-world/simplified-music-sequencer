import React, {FunctionComponent, FormEvent} from 'react';
import {IoIosSave, IoIosClose} from 'react-icons/io';
import {useSelector, useDispatch} from 'react-redux';
import {selectSharing, hideUploadForm} from './sharingSlice';
import {selectSequencer, setComposer, setTitle, publish} from '../sequencer/sequencerSlice';

export const UploadForm: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {showingUploadForm} = useSelector(selectSharing);


  if(showingUploadForm)
    return <div className="UploadFormWrapper" >
      <div className="UploadForm">
        <div className="formField">
          <label>What is your name?</label>
          <ComposerField />
        </div>
        <div className="formField">
          <label>Please choose a title for your sequence:</label>
          <TitleField/>
        </div>
        <UploadButton />
        <button className="UploadFormCancel" onClick={() => {dispatch(hideUploadForm())}}>
          <IoIosClose/>Cancel
        </button>
      </div>
    </div>

  else
    return null
}

export const TitleField: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {title} = useSelector(selectSequencer);
  return <input onFocus={e => e.target.select()} value={title} onChange={e => {dispatch(setTitle(e.target.value))}}/>
};

export const ComposerField: FunctionComponent<{autoFocus?: boolean}> = ({autoFocus}) => {
  const dispatch = useDispatch();
  const {composer} = useSelector(selectSequencer);
  return <input autoFocus={autoFocus} value={composer} onChange={e => {dispatch(setComposer(e.target.value))}} />
}

export const UploadButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  return <button className="UploadFormSubmit" onClick={() => {dispatch(publish())}}><IoIosSave/>Upload</button>
}
