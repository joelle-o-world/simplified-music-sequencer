import React, {useRef} from 'react'
import {FunctionComponent, useState} from 'react';
import classNames from 'classnames';
import {isMobile, isTablet} from 'react-device-detect';

import {PitchParse} from './parsePitch';
import parsePitch from './parsePitch';

import PianoKeyboard from './PianoKeyboard';

import './PitchInput.sass'
import {playPitch} from '../synth/synth';
import {useSelector} from 'react-redux';
import {selectSynth} from '../synth/synthSlice';
import {useElementPosition} from '../../hooks/useElementPosition';

export const cssPitchClassNames = [
  'pitch-c',
  'pitch-d-flat',
  'pitch-d',
  'pitch-e-flat',
  'pitch-e',
  'pitch-f',
  'pitch-g-flat',
  'pitch-g',
  'pitch-a-flat',
  'pitch-a',
  'pitch-b-flat',
  'pitch-b',
]

export interface PitchInputProps {
  className?: string;
  value: string;
  onChange: (e: PitchParse) => void;
  id?: string;
  onKeyPress?: (e:React.KeyboardEvent) => void;
  onKeyDown?: (e:React.KeyboardEvent) => void;
  onPianoPick?: () => void;
}

export const PitchInput: FunctionComponent<PitchInputProps> = ({
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

  const internalParse = parsePitch(displayValue);
  const pitchClass = internalParse.midiNumber ? internalParse.midiNumber%12 : null;
  const cssPitchClass = pitchClass !== null 
    ? cssPitchClassNames[pitchClass]
    : false

  const handleChange = (str:string) => {
    let parse = parsePitch(str);
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

  return <div className={classNames(className, "PitchInputWrapper", {hasFocus})} ref={divRef}>
    <input 
      value={displayValue}
      className={classNames(className, "PitchInput", {
        hasPitch: internalParse.hasPitch,
        hasError: internalParse.hasError,
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
        </span>
      : null}
  </div>
}

export default PitchInput
