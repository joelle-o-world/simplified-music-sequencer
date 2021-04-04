import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectSharing, refreshSequencesIndex, openSequence} from './sharingSlice';

export const SharedSequencesList: FunctionComponent = () => {
  const sharingState = useSelector(selectSharing);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshSequencesIndex())
  }, [dispatch]);

  return <div className="SharedSequencesListWrapper">
      <h2>Open a sequence that someone has shared:</h2>
      <ul className="SharedSequencesList">
        {
          sharingState.publishedSequences.map(
            ({id, title, composer}) => <li key={id} className="SharedSequence">
              <button onClick={() => dispatch(openSequence(id))} className="SharedSequenceOpen">open</button>
              <span>
                <span className="SharedSequenceTitle">{title}</span> 
                {" by "} 
                <span className="SharedSequenceComposer">{composer}</span>
              </span>
            </li>
          )
        }
      </ul>
    </div>
}

export default SharedSequencesList;

