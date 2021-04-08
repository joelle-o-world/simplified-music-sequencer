import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {selectSequencer, setNote, doubleSequence, setTempo} from './sequencerSlice';
import {PitchParse} from './parsePitch';
import PitchInput from './PitchInput';
import classNames from 'classnames'
import {IoPlaySharp } from 'react-icons/io5'
import {IoIosSave} from 'react-icons/io';
import SharedSequencesList from '../sharing/SharedSequencesList'
import {showUploadForm} from '../sharing/sharingSlice';
import {UploadForm} from '../sharing/UploadForm';
import SequencerInstructions from './Instructions';
import {synthPlay, selectSynth} from '../synth/synthSlice';
import {PlayButton, PlaybackButtons} from '../synth/PlaybackButtons';

//import './Sequencer.sass'

// TODO: Replace this function with time signature variable
const printTime = (t:number) => t%2 ? 'and' : String(Math.floor(t/2)%4 + 1);

interface SequencerProps {
  horizontal?: boolean;
  vertical?: boolean;
}

export const Sequencer: FunctionComponent<SequencerProps> = ({horizontal, vertical}) => {
  const sequencer = useSelector(selectSequencer);
  const dispatch = useDispatch();

  const {nowPlayingStep} = useSelector(selectSynth)

  const handlePlay = () => {
    dispatch(synthPlay())
  }

  const orientation = horizontal ? 'horizontal' : 'vertical'

  return <div className={classNames("Sequencer", orientation)}>
    <UploadForm/>
    <SequencerInstructions />
    <div className="SequencerSteps">
      {sequencer.steps.map((step, i) => ( 
        <div className={classNames("SequencerStep", {nowPlaying: nowPlayingStep === i, barline: i%8 === 0})} key={i}>
          <span className="SequencerStepTime">{printTime(i)}</span>
          <PitchInput 
            value={step.str} 
            onChange={val => dispatch(setNote({stepIndex: i, newNote: val}))} 
            className="SequencerStepInput"
            id={"SequencerStepPitch-"+i}
            onKeyDown={(e) => {
              if(e.key === "ArrowDown" || e.key === "j") {
                e.preventDefault();
                let el = document.getElementById("SequencerStepPitch-" + (i+1)%sequencer.steps.length);
                if(el)
                  el.focus();
              } else if(e.key === "ArrowUp" || e.key === "k") {
                e.preventDefault()
                let el = document.getElementById("SequencerStepPitch-" + (i-1+sequencer.steps.length)%sequencer.steps.length);
                if(el)
                  el.focus();
              }
            }}
          />
          {step.errorMessage 
            ? <span className="parse-error">{step.errorMessage}</span> 
            : null
          }
        </div>
      ))}
      <button className="SequencerAddSteps" onClick={() => dispatch(doubleSequence())}>Add more steps</button>
    </div>
    <SequencerControls />
    <SharedSequencesList />
  </div>
}

export default Sequencer;

export const SequencerControls: FunctionComponent = () => {
  const dispatch = useDispatch();
  const sequencer = useSelector(selectSequencer);
  return <div className="SequencerControls">
    <PlaybackButtons/>
    <button onClick={() => dispatch(showUploadForm())} className="SequencerUpload">
      <IoIosSave/>
      Upload
    </button>
    <div className="SequencerTempo">
      <label>Tempo:</label>
      <input type="range" min="50" max="400" value={sequencer.tempo} onChange={e => dispatch(setTempo(Number(e.target.value)))} />
      <span>{sequencer.tempo}bpm</span>
    </div>
  </div>
}

