import React, {FunctionComponent} from 'react';
import {drumSampleNames} from '../synth/drums';

import './DrumSelector.sass'

export interface DrumSelectorProps {
  onSelect?: (drumSampleName: string) => void;
}

export const DrumSelector: FunctionComponent<DrumSelectorProps> = ({onSelect}) => {
  return <div className="DrumSelector">
    {drumSampleNames.map(name => (
      <button 
        className="DrumSelectorButton"
        onMouseOver={() => {
          console.log('clicked!')
          if(onSelect)
            onSelect(name);
        }}
      >{name}</button>
    ))}
  </div>
}
