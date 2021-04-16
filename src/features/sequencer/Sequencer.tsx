import React from 'react';
import {FunctionComponent} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {selectSequencer, setNote, doubleSequence, setTempo} from './sequencerSlice';
import PitchInput from './PitchInput';
import classNames from 'classnames'
import SharedSequencesList from '../sharing/SharedSequencesList'
import {UploadForm, UploadButton} from '../sharing/UploadForm';
import SequencerInstructions from './Instructions';
import {synthPlay, selectSynth} from '../synth/synthSlice';
import {PlaybackButtons} from '../synth/PlaybackButtons';
import {SequencerHistory} from '../../components/SequencerHistory';
import {ErrorNotifications} from '../errors/ErrorNotifications';
import {selectSharing} from '../sharing/sharingSlice';
import LoadingSequence from '../sharing/LoadingSequence';
import {SequenceHeadings} from '../sharing/SequenceHeadings';

//import './Sequencer.sass'

// TODO: Replace this function with time signature variable
const printTime = (t:number) => t%2 ? 'and' : String(Math.floor(t/2)%4 + 1);

interface SequencerProps {
  horizontal?: boolean;
  vertical?: boolean;
}

export const Sequencer: FunctionComponent<SequencerProps> = ({horizontal, vertical}) => {

  const {currentlyLoadingASequence} = useSelector(selectSharing)

  const orientation = horizontal ? 'horizontal' : 'vertical'

  return <div className={classNames("Sequencer", orientation)}>
    <ErrorNotifications/>
    <UploadForm/>
    <SequencerInstructions />
    <div className="red-border-box">
      <SequenceHeadings/>
      { currentlyLoadingASequence
        ? <LoadingSequence/>
        : <SequencerSteps />
      }
    </div>
    <SequencerControls />
    <SharedSequencesList />
    <SequencerHistory/>
  </div>
}

export default Sequencer;

export const SequencerControls: FunctionComponent = () => {
  const dispatch = useDispatch();
  const sequencer = useSelector(selectSequencer);
  return <div className="SequencerControls">
    <PlaybackButtons/>
    { sequencer.edited 
      ? <UploadButton/>
      : null}
    <div className="SequencerTempo">
      <label>Tempo:</label>
      <input type="range" min="50" max="400" value={sequencer.tempo} onChange={e => dispatch(setTempo(Number(e.target.value)))} />
      <span>{sequencer.tempo}bpm</span>
    </div>
  </div>
}

export const SequencerSteps: FunctionComponent = () => {
  const sequencer = useSelector(selectSequencer);
  const dispatch = useDispatch();
  const {nowPlayingStep} = useSelector(selectSynth)
  return <div className="SequencerSteps" id="SequencerSteps">
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
};
