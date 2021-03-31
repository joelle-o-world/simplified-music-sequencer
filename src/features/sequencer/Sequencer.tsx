import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {selectSequencer, setNote, addSteps} from './sequencerSlice';
import {PitchParse} from './parsePitch';
import PitchInput from './PitchInput';
import {Synth} from './synth';
import classNames from 'classnames'

import './Sequencer.sass'

// TODO: Replace this function with time signature context
const printTime = (t:number) => t%2 ? 'and' : String(Math.floor(t/2)%8 + 1);

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
    <button onClick={handlePlay}>Play</button>
    <div className="Sequencer_Steps">
      {sequencer.steps.map((step, i) => ( 
        <SequencerStep 
          note={step} 
          key={i} 
          timeIndex={i}
          timeLabel={printTime(i)}
          isNowPlaying={playingStep === i}
          onChange={val => dispatch(setNote({stepIndex: i, newNote: val}))}
        /> 
      ))}
    </div>
    <button onClick={() => dispatch(addSteps(8))}>Add 8 more steps</button>
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
      ? <span className="SequencerStep_TimeIndex">{timeLabel}</span>
      : null
    }


    <PitchInput 
      value={note.str} 
      onChange={(e: any) => onChange ? onChange(e) : null} 
      className="SequencerStep_input"
    />

    {note.errorMessage 
      ? <span className="parse-error">{note.errorMessage}</span> 
      : null
    }

  </div>
}
