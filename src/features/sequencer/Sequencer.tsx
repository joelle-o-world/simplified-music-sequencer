import React from 'react';
import {FunctionComponent} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {selectSequencer, setNote, doubleSequence} from './sequencerSlice';
import SequencerStepInput from './SequencerStepInput';
import classNames from 'classnames'
import SharedSequencesList from '../sharing/SharedSequencesList'
import {UploadForm, UploadButton} from '../sharing/UploadForm';
import SequencerInstructions from './Instructions';
import {selectSynth} from '../synth/synthSlice';
import {PlaybackButtons} from '../synth/PlaybackButtons';
import {SequencerHistory} from '../../components/SequencerHistory';
import {Notifications} from '../notifications/Notifications';
import {selectSharing} from '../sharing/sharingSlice';
import LoadingSequence from '../sharing/LoadingSequence';
import {SequenceHeadings} from '../sharing/SequenceHeadings';
import ShareButton, {ShareDialog} from '../sharing/ShareButton';
import {TempoInput} from './TempoInput';

//import './Sequencer.sass'

// TODO: Replace this function with time signature variable
const printTime = (t:number) => t%2 ? 'and' : String(Math.floor(t/2)%4 + 1);

interface SequencerProps {
  horizontal?: boolean;
  vertical?: boolean;
}

export const Sequencer: FunctionComponent<SequencerProps> = ({horizontal}) => {

  const {currentlyLoadingASequence} = useSelector(selectSharing)

  const orientation = horizontal ? 'horizontal' : 'vertical'

  return <div className={classNames("Sequencer", orientation)}>
    <Notifications/>
    <ShareDialog/>
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
  const sequencer = useSelector(selectSequencer);
  return <div className="SequencerControls">
    <PlaybackButtons/>

    { sequencer.edited 
      ? <UploadButton/>
      : null}

    { !sequencer.edited && sequencer.originalId && sequencer.steps.some(step => step.hasPitch)
      ? <ShareButton sequenceId={sequencer.originalId}/>
      : null }

      <TempoInput/>
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
          <SequencerStepInput 
            value={step.str} 
            onChange={val => dispatch(setNote({stepIndex: i, newNote: val}))} 
            //className="SequencerStepInput"
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
