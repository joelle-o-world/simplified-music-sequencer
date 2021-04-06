import React from 'react'
import {FunctionComponent, useState} from 'react';
import classNames from 'classnames';

import {PitchParse} from './parsePitch';
import parsePitch from './parsePitch';

import PianoKeyboard from './PianoKeyboard';

import './PitchInput.sass'

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
  inputRef?: React.RefObject<HTMLInputElement>;
  onPianoPick?: () => void;
}

export const PitchInput: FunctionComponent<PitchInputProps> = ({
  className,
  value,
  onChange,
  id,
  onKeyPress,
  onKeyDown,
  inputRef,
  onPianoPick,
}) => {

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

  return <div className={classNames(className, "PitchInputWrapper", {hasFocus})}>
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
      }}
      onBlur={() => setTimeout(() => setHasFocus(false), 50)}
      placeholder="~"
      ref={inputRef}
      id={id}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      autoComplete="off"
    />
    {hasFocus 
      ? <PianoKeyboard 
          octave={3}
          numberOfKeys={36}
          hotKeys={[]} 
          onNote = { e => {
            handleChange(e.fullName)
            if(onPianoPick)
              onPianoPick();
          } }
          highlightKeys={internalParse.midiNumber ? [internalParse.midiNumber] : [] }
          labelKeys
        />
      : null}
  </div>
}

export default PitchInput
