import React, {useState} from 'react';
import Sequencer from './features/sequencer/Sequencer';

import './SequencerPlusGold.sass'
import {ComposerField} from './features/sharing/UploadForm';
import {DialogBox} from './components/DialogBox';

function App() {
  const [page, setPage] = useState('chooseName');

  if(page === 'chooseName')
    return <div className="App">
      <DialogBox className="ChooseName">
        <p>Hello, what is your name?</p>
        <ComposerField autoFocus onEnterPress={() => setPage('main')} />
        <button className="RedButton" onClick={() => setPage('main')}>Begin</button>
      </DialogBox>
    </div>
  else if(page === 'main')
    return (
      <div className="App">
      <Sequencer horizontal /> 
      </div>
    );

  else
    return <p>Something went wrong :(</p>
}

export default App;
