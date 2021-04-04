import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectSharing, refreshSequencesIndex, openSequence} from './sharingSlice';

export const SharedSequencesList: FunctionComponent = () => {
  const sharingState = useSelector(selectSharing);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshSequencesIndex())
  });

  return <ul>
    {
      sharingState.publishedSequences.map(
        ({id, title, composer}) => <li key={id}>
          {id}
          <button onClick={() => dispatch(openSequence(id))}>open</button>
        </li>
      )
    }
  </ul>
}

export default SharedSequencesList;

