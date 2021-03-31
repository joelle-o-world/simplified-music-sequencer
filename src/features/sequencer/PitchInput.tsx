import React from 'react'
import {FunctionComponent, useState} from 'react';
import classNames from 'classnames';

import {PitchParse} from './parsePitch';
import parsePitch from './parsePitch';

import PianoKeyboard from './PianoKeyboard';

import './PitchInput.sass'

export interface PitchInputProps {
  className?: string;
  value: string;
  onChange: (e: PitchParse) => void;
}

export const PitchInput: FunctionComponent<PitchInputProps> = ({
  className,
  value,
  onChange,
}) => {

  const [hasFocus, setHasFocus] = useState(false)

  const [internalValue, setInternalValue] = useState('');
  let displayValue = value !== undefined ? value : internalValue

  const internalParse = parsePitch(displayValue);

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
      })}
      onChange={ e => handleChange(e.target.value) }
      onFocus={() => setHasFocus(true)}
      onBlur={() => setTimeout(() => setHasFocus(false), 50)}
    />
    {hasFocus 
      ? <PianoKeyboard 
          octave={4}
          numberOfKeys={36}
          hotKeys={[]} 
          onNote = { e => handleChange(e.fullName) }
          highlightKeys={internalParse.midiNumber ? [internalParse.midiNumber] : [] }
          labelKeys
        />
      : null}
  </div>
}

export default PitchInput
