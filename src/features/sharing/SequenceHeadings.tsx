import React from 'react';
import {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {selectSequencer} from '../sequencer/sequencerSlice';
import {TitleField, ComposerField} from './UploadForm';

import './SequenceHeadings.sass'

export const SequenceHeadings: FunctionComponent = () => {
  const {title, composer, edited, originalTitle, originalComposer} = useSelector(selectSequencer);

  if(edited)
    return <hgroup className="SequenceHeadings">
      <h1 className="SequenceTitle"><TitleField/></h1>
      <h2 className="SequenceComposer">by <ComposerField/></h2>
    </hgroup>
  else
    return <hgroup className="SequenceHeadings">
      <h1 className="SequenceTitle">{originalTitle||title}</h1>
      { originalComposer || composer 
        ? <h2 className="SequenceComposer">by {originalComposer||composer}</h2>
        : null }
    </hgroup>

}
