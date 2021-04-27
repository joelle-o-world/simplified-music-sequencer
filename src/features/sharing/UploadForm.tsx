import React, {FunctionComponent, } from 'react';
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
  return <input type="text" onFocus={e => e.target.select()} value={title} onChange={e => {dispatch(setTitle(e.target.value))}}/>
};

export const ComposerField: FunctionComponent<{
  autoFocus?: boolean; 
  onEnterPress?: () => void;
  noPlaceholder?: boolean;
}> = ({autoFocus, onEnterPress, noPlaceholder=false}) => {
  const dispatch = useDispatch();
  const {composer} = useSelector(selectSequencer);
  return <input 
    placeholder={noPlaceholder ? undefined : "your name here"}
    autoFocus={autoFocus} 
    type="text"
    value={composer} 
    onChange={e => {dispatch(setComposer(e.target.value))}} 
    onKeyPress={e => {
      if(e.charCode === 13 && onEnterPress)
        onEnterPress();
    }}
  />
}


function scrollToSharedSequencesList() {
  let div = document.getElementById('SharedSequencesList');
  if(div) {
    let top = window.scrollY + div.getBoundingClientRect().top;
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }
}

export const UploadButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  //const sharing = useSelector(selectSharing);
  const sequencer = useSelector(selectSequencer);
  return <button 
    className="SequencerUploadButton" 
    disabled={!sequencer.edited}
    onClick={() => {
      dispatch(publish())
      setTimeout(
        () => scrollToSharedSequencesList(),
        300
      );
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
