import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectSequencer, setTempo} from './sequencerSlice';

export const TempoInput: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {tempo} = useSelector(selectSequencer);

  return <div className="SequencerTempo">
    <span>
      <input 
        value={tempo} 
        onChange={e => dispatch(setTempo(e.target.value))}
        onFocus={e => e.target.select()}
        className="SequencerTempoInput"
        type="number"
      />
      {"bpm"}
    </span>
    <input type="range" min="50" max="300" value={tempo} onChange={e => dispatch(setTempo(Number(e.target.value)))} />
  </div>
}
