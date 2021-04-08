import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IoPlaySharp, IoStopSharp} from 'react-icons/io5';
import {synthPlay, selectSynth, stopPlaying, unloop} from './synthSlice';
import {ImLoop} from 'react-icons/im/'

export const PlayButton: FunctionComponent<{loop?:boolean}> = ({loop=false}) => {
  const dispatch = useDispatch();
  const {playing} = useSelector(selectSynth);
  if(!playing)
    return <button className="PlaybackButton PlayButton" onClick={() => dispatch(synthPlay(loop))}><IoPlaySharp/>Play</button>
  else
    return <button className="PlaybackButton StopButton" onClick={() => dispatch(stopPlaying())}><IoStopSharp/>Stop</button>
}

export const LoopButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {looping} = useSelector(selectSynth);
  if(looping)
    return <button className="PlaybackButton UnloopButton" onClick={() => dispatch(unloop())}>Un-Loop</button>
  else
    return <button className="PlaybackButton LoopButton" onClick={() => dispatch(synthPlay(true))}><ImLoop/>Loop</button>
}

export const PlaybackButtons: FunctionComponent = () => <>
  <PlayButton loop/>
</>
