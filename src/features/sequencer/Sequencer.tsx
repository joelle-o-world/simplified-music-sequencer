import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {selectSequencer, setNote, doubleSequence, setTempo, publish} from './sequencerSlice';
import {PitchParse} from './parsePitch';
import PitchInput from './PitchInput';
import {Synth} from './synth';
import classNames from 'classnames'
import {IoPlaySharp } from 'react-icons/io5'
import {IoIosSave} from 'react-icons/io';
import SharedSequencesList from '../sharing/SharedSequencesList'
import {showUploadForm} from '../sharing/sharingSlice';
import {UploadForm} from '../sharing/UploadForm';
import SequencerInstructions from './Instructions';

//import './Sequencer.sass'

// TODO: Replace this function with time signature variable
const printTime = (t:number) => t%2 ? 'and' : String(Math.floor(t/2)%4 + 1);

export const Sequencer: FunctionComponent = () => {
  const sequencer = useSelector(selectSequencer);
  const dispatch = useDispatch();
  const [playingStep, setPlayingStep] = useState(null as null|number)

  const handlePlay = () => {
    let synth = new Synth();
    synth.playSequence(sequencer.steps, sequencer.tempo*2);
    synth.on('step', step => {
      setPlayingStep(step);
    });
  }

  return <div className="Sequencer">
    <UploadForm/>
    <div className="SequencerControls">
    <button className="SequencerPlay" onClick={handlePlay}>
      <IoPlaySharp className="button-icon"/>
      Play
    </button>
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

    <div className="SequencerSteps">
      {sequencer.steps.map((step, i) => ( 
        <div className={classNames("SequencerStep", {nowPlaying: playingStep === i, barline: i%8 === 0})} key={i}>
          <span className="SequencerStepTime">{printTime(i)}</span>
          <PitchInput 
            value={step.str} 
            onChange={val => dispatch(setNote({stepIndex: i, newNote: val}))} 
            className="SequencerStepInput"
            id={"SequencerStepPitch-"+i}
            onKeyDown={(e) => {
              if(e.key == "ArrowDown" || e.key == "j") {
                e.preventDefault();
                let el = document.getElementById("SequencerStepPitch-" + (i+1)%sequencer.steps.length);
                if(el)
                  el.focus();
              } else if(e.key == "ArrowUp" || e.key == "k") {
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
      <button className="SequencerAddSteps" onClick={() => dispatch(doubleSequence())}>{"+"}</button>
    </div>
    <div className="page">
      <SequencerInstructions />
      <SharedSequencesList />
    </div>
  </div>
}

export default Sequencer;

export interface SequencerStepProps {
  note: PitchParse;
  timeIndex?: number;
  onChange?: (e: string) => void;
  timeLabel?: string;
  isNowPlaying?: boolean;
}

export const SequencerStep: FunctionComponent<SequencerStepProps> = ({
  note,
  onChange,
  timeLabel,
  isNowPlaying = false,
}) => {
  return <div className={classNames("SequencerStep", {nowPlaying: isNowPlaying})}>

    {timeLabel !== undefined
      ? <span className="SequencerStepTime">{timeLabel}</span>
      : null
    }


    <PitchInput 
      value={note.str} 
      onChange={(e: any) => onChange ? onChange(e) : null} 
      className="SequencerStepInput"
    />

    {note.errorMessage 
      ? <span className="parse-error">{note.errorMessage}</span> 
      : null
    }

  </div>
}
