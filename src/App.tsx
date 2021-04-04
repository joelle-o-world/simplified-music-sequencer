import React from 'react';
import Sequencer from './features/sequencer/Sequencer';
import {listSequences} from './client-api/publishSequence';
import SharedSequencesList from './features/sharing/SharedSequencesList';

import './SequencerPlusGold.sass'

function App() {
  return (
    <div className="App">
      <article className="friendly-text">
      </article>
      <Sequencer />
      <SharedSequencesList />
    </div>
  );
}

export default App;
