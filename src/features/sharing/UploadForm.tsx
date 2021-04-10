import React, {FunctionComponent, } from 'react';
import {IoIosSave, IoIosClose} from 'react-icons/io';
import {useSelector, useDispatch} from 'react-redux';
import {selectSharing, hideUploadForm, showUploadForm} from './sharingSlice';
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

export const ComposerField: FunctionComponent<{autoFocus?: boolean; onEnterPress?: () => void}> = ({autoFocus, onEnterPress}) => {
  const dispatch = useDispatch();
  const {composer} = useSelector(selectSequencer);
  return <input 
    autoFocus={autoFocus} 
    value={composer} 
    onChange={e => {dispatch(setComposer(e.target.value))}} 
    onKeyPress={e => {
      if(e.charCode === 13 && onEnterPress)
        onEnterPress();
    }}
  />
}

export const UploadButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  const sharing = useSelector(selectSharing);
  const sequencer = useSelector(selectSequencer);
  return <button 
    className="SequencerUploadButton" 
    disabled={!sequencer.edited}
    onClick={() => {
      if(sharing.showingUploadForm)
        dispatch(publish())
      else
        dispatch(showUploadForm())
    }
  }>
    <IoIosSave/>
    Upload
    { !sequencer.edited
      ? <span className="hover-info">You need to edit the sequence before you can upload it</span>
      : null
    }
  </button>
}
