import React from 'react'
import {FunctionComponent, useState} from 'react';
import classNames from 'classnames';

import {PitchParse} from './parsePitch';
import parsePitch from './parsePitch';

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

  const [internalValue, setInternalValue] = useState('');
  let displayValue = value !== undefined ? value : internalValue

  const internalParse = parsePitch(displayValue);

  const handleChange = (str:string) => {
    let parse = parsePitch(str);
    if(onChange)
      onChange(parse);

    setInternalValue(str);
  }

  return <input 
      value={displayValue}
      className={classNames(className, "PitchInput", {
        hasPitch: internalParse.hasPitch,
        hasError: internalParse.hasError,
      })}
      onChange={ e => handleChange(e.target.value) }
    />
}

export default PitchInput
