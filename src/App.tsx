import React, {useState, useEffect} from 'react';
import Sequencer from './features/sequencer/Sequencer';

import './SequencerPlusGold.sass'
import {ComposerField} from './features/sharing/UploadForm';
import {DialogBox} from './components/DialogBox';
import {openSequence} from './features/sharing/sharingSlice';
import {useDispatch} from 'react-redux';

function getParameterByName(name:string, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function App() {
  const [page, setPage] = useState('chooseName');

  const dispatch = useDispatch();
  useEffect(() => {
    let sequenceToLoad = getParameterByName('sequence');
    if(sequenceToLoad) {
      dispatch(openSequence(sequenceToLoad));
      setPage('main');
    }
  }, []);

  const heading = <hgroup className="MainPageHeader">
    <h1>Musical Sequencing</h1>
    <h2>Programming a tune using the computer</h2>
  </hgroup>

  if(page === 'chooseName')
    return <div className="App">
      <DialogBox className="ChooseName">
        <p>Hello, what is your name?</p>
        <ComposerField autoFocus onEnterPress={() => setPage('main')} noPlaceholder />
        <button className="RedButton" onClick={() => setPage('main')}>Begin</button>
      </DialogBox>
    </div>
  else if(page === 'main')
    return (
      <div className="App">
        <Sequencer horizontal /> 
        <footer className="AppFooter">
          made by <a href="http://joel.forsale">joel</a> -- <a href="https://github.com/joelyjoel/simplified-music-sequencer">view source code</a>
        </footer>
      </div>
    );

  else
    return <p>Something went wrong :(</p>
}

export default App;
