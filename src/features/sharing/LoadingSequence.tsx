import React from 'react';
import {FunctionComponent} from 'react';
import {IoHourglassSharp} from 'react-icons/io5';

export const LoadingSequence: FunctionComponent = () => {
  return <div className="LoadingSequence">
  <h2><IoHourglassSharp/>loading...</h2>
  </div>
}

export default LoadingSequence;
