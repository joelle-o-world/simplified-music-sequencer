import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {selectSequencer, setNote, addSteps, setTempo, publish} from './sequencerSlice';
import {PitchParse} from './parsePitch';
import PitchInput from './PitchInput';
import {Synth} from './synth';
import {GrPlayFill} from 'react-icons/gr';
import classNames from 'classnames'

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
    <div className="SequencerControls">
    <button className="SequencerPlay" onClick={handlePlay}>
      <GrPlayFill/>
      Play
    </button>
      <button onClick={() => dispatch(publish())}>Share</button>
      <div className="SequencerTempo">
        <label>Tempo:</label>
        <input type="range" min="50" max="400" value={sequencer.tempo} onChange={e => dispatch(setTempo(Number(e.target.value)))} />
        <span>{sequencer.tempo}bpm</span>
      </div>
    </div>
    <div className="SequencerSteps">
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
      <button className="SequencerAddSteps" onClick={() => dispatch(addSteps(8))}>{"+"}</button>
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
