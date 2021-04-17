import React, {FunctionComponent} from 'react';
import {IoPaperPlaneSharp, IoCloseSharp} from 'react-icons/io5'
import {DialogBox} from '../../components/DialogBox';
import {showShareDialog, SequenceID, selectSharing, hideShareDialog} from './sharingSlice';
import {useDispatch, useSelector} from 'react-redux';

import './ShareDialog.sass'
import {newNotification} from '../notifications/notificationsSlice';

export const ShareButton: FunctionComponent<{sequenceId:SequenceID}> = ({sequenceId}) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(showShareDialog(sequenceId));
  }
  
  return <button className="ShareButton" onClick={handleClick}><IoPaperPlaneSharp/>Share</button>
}
export default ShareButton;

export const ShareDialog: FunctionComponent = () => {
  const sharing = useSelector(selectSharing)
  const dispatch = useDispatch()

  if(!sharing.sequenceToShare || !sharing.showingShareDialog)
    return null

  const [link] = window.location.href.split(/\?|\#/)
  const url = `${link}?sequence=${
    encodeURIComponent(sharing.sequenceToShare)
  }`;

  return <DialogBox id="ShareDialog" darkBg onBGClick={() => dispatch(hideShareDialog())}>
    <button className="CloseButton" onClick={() => dispatch(hideShareDialog())}><IoCloseSharp/></button>
    <h2><IoPaperPlaneSharp/>Send someone this link so they can listen to your sequence</h2>
    <CopyInput toCopy={url} />
  </DialogBox>
}

export const CopyInput: FunctionComponent<{toCopy: string}> = ({
  toCopy,
}) => {
  const dispatch = useDispatch();
  const handleClick = (e:React.MouseEvent<HTMLInputElement>) => {
    // @ts-ignore
    e.target.select();
    try {
      document.execCommand('copy');
      dispatch(newNotification("copied link"));
    } catch(err) {
      console.error(err)
    }
  }

  return <input 
    value={toCopy}  
    className="CopyInput"
    // @ts-ignore
    onClick={handleClick}
    readOnly
  />
}
