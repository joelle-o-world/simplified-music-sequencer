import React, {useRef} from 'react'
import {FunctionComponent, useState} from 'react';
import classNames from 'classnames';
import {isMobile, isTablet} from 'react-device-detect';

import {PitchParse} from './parsePitch';
import parsePitch from './parsePitch';

import PianoKeyboard from './PianoKeyboard';

import './SequencerStepInput.sass'

import {playPitch, playDrums} from '../synth/synth';
import {useSelector} from 'react-redux';
import {selectSynth} from '../synth/synthSlice';
import {useElementPosition} from '../../hooks/useElementPosition';

import {cssPitchClassNames} from './PitchInput'
import {parseDrum} from '../synth/drums';
import {DrumSelector} from './DrumSelector';

// NOTE: All properties added in future versions should be optional for backwards compatibility.
export interface StepParse {
  str: string;
  hasPitch?: boolean;
  midiNumber?: number;
  hasError?: boolean;
  errorMessage?: string;
  hasDrums?: boolean;
  drums?: string[];
}

export function parseStep(str: string):StepParse {
  const drumParse = parseDrum(str)
  if(drumParse.hasDrums)
    return {
      ...drumParse,
      hasPitch: false
    };
  const pitchParse = parsePitch(str);
  return {
    ...pitchParse,
    hasDrums: false,
  }
}

export interface PitchInputProps {
  className?: string;
  value: string;
  onChange: (e: StepParse) => void;
  id?: string;
  onKeyPress?: (e:React.KeyboardEvent) => void;
  onKeyDown?: (e:React.KeyboardEvent) => void;
  onPianoPick?: () => void;
}

export const SequencerStepInput: FunctionComponent<PitchInputProps> = ({
  className,
  value,
  onChange,
  id,
  onKeyPress,
  onKeyDown,
  onPianoPick,
}) => {

  const {playing} = useSelector(selectSynth)
  const [hasFocus, setHasFocus] = useState(false)


  const [internalValue, setInternalValue] = useState('');
  let displayValue = value !== undefined ? value : internalValue

  const internalParse = parseStep(displayValue);
  const pitchClass = internalParse.midiNumber ? internalParse.midiNumber%12 : null;
  const cssPitchClass = pitchClass !== null 
    ? cssPitchClassNames[pitchClass]
    : false

  const handleChange = (str:string) => {
    let parse = parseStep(str);
    if(onChange)
      onChange(parse);

    setInternalValue(str);
  }

  const divRef = useRef(null)
  const divRect = useElementPosition(divRef);
  const pianoWidth = 1000
  const pianoPositioner = pianoWidth > window.innerWidth 
    ?  {left: '0px'} 
    : (divRect.elementLeft + pianoWidth > window.innerWidth
      ? {right: '0px'}
      : undefined
      )

  return <div className={classNames(className, "SequencerStepInputWrapper", {hasFocus})} ref={divRef}>
    <input 
      value={displayValue}
      className={classNames(className, "SequencerStepInput", {
        hasPitch: internalParse.hasPitch,
        hasError: internalParse.hasError,
        hasDrums: internalParse.hasDrums,
      }, cssPitchClass)}
      onChange={ e => handleChange(e.target.value) }
      onFocus={e => {
        setHasFocus(true)
        setTimeout(() => e.target.select(), 10)
        if(internalParse.midiNumber !== undefined && !playing)
          playPitch(internalParse.midiNumber);
      }}
      onBlur={() => setTimeout(() => setHasFocus(false), 50)}
      onMouseOver={() => {
        if(internalParse.midiNumber !== undefined && !playing)
          playPitch(internalParse.midiNumber);
        else if(internalParse.hasDrums && !playing) {
          playDrums(internalParse.drums);
        }
      }}
      readOnly={isMobile || isTablet}
      placeholder="~"
      id={id}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      autoComplete="off"
    />
    {hasFocus 
      ? <span className="keyboardwrapper" style={pianoPositioner}>
          <PianoKeyboard 
            octave={3}
            numberOfKeys={36}
            hotKeys={[]} 
            onNote = { e => {
              handleChange(e.fullName)
              if(onPianoPick)
                onPianoPick();
              playPitch(e.p);
            } }
            highlightKeys={internalParse.midiNumber ? [internalParse.midiNumber] : [] }
            labelKeys
          />
          <DrumSelector
            onSelect={(sampleName) => {
              playDrums([sampleName]);
              handleChange(sampleName);
            }}
          />
        </span>
      : null}
  </div>
}

export default SequencerStepInput;

