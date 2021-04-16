import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectSharing, refreshSequencesIndex, openSequence} from './sharingSlice';
import useUrlHash from '../../hooks/useHash';
import {IoHourglassSharp} from 'react-icons/io5';


function scrollToSequencerSteps() {
  let div = document.getElementById('SequencerSteps');
  if(div)
    div.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
}

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
              <OpenSequenceButton sequenceId={id} />
              <span>
                <span className="SharedSequenceTitle">{title}</span> 
                <span className="SharedSequenceCredit">
                  {" by "} 
                  <span className="SharedSequenceComposer">{composer}</span>
                </span>
              </span>
            </li>
          )
        }
      </ul>
    </div>
}

export default SharedSequencesList;


export const OpenSequenceButton: FunctionComponent<{sequenceId: string}> = ({sequenceId}) => {
  const {currentlyLoadingASequence} = useSelector(selectSharing);
  const dispatch = useDispatch();
  if(currentlyLoadingASequence)
    return <button disabled className="SharedSequenceOpen"><IoHourglassSharp/></button>
  else
    return <button onClick={() => {
      dispatch(openSequence(sequenceId, true))
      //setUrlHash(id);
      scrollToSequencerSteps();
    }} className="SharedSequenceOpen">open</button>
}
