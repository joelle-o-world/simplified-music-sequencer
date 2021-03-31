import * as React from 'react';
import {FunctionComponent, useEffect} from 'react';

import './PianoKeyboard.sass';

const keyNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const defaultHotKeys = ['a','w','s','e','d','f','t','g','y','h','u','j','k','o','l', 'p', ';'];

export const PianoKeyboard: FunctionComponent<{
  numberOfKeys?: number;
  octave?: number;
  hotKeys?: string[];
  hotKeyOffset?: number
  onNote?: (e:{
    pitchNumber: number;
    p: number;
    pitchName: string;
    fullName: string;
    octave: number;
  }) => void
}> = ({numberOfKeys=15, octave=1, hotKeys=defaultHotKeys, hotKeyOffset=0, onNote}) => {


  useEffect( () => {
    const handleKeyDown = (e: any) => {
      if(hotKeys.includes(e.key)) {
        let index = hotKeys.indexOf(e.key)
        if(index !== -1) {


          let pitch = index + hotKeyOffset + octave * 12
          let keyName = keyNames[index % 12]
          let fullName = keyName + octave;
          if(onNote)
            onNote({
              p: pitch,
              pitchNumber: pitch,
              pitchName: keyName,
              octave,
              fullName,
            })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hotKeys, hotKeyOffset, octave, onNote])

  const whiteNotes = []
  const blackNotes = []
  for(let i=0; i < numberOfKeys; ++i) {
    const keyName = keyNames[i % 12]
    const black = /[b#]$/.test(keyName)
    const hotKey = i >= hotKeyOffset ? (hotKeys[i - hotKeyOffset] || null) : null
    const fullName = keyName + octave
    const pitch = octave * 12 + i
    const handlePress = () => {
      if(onNote)
        onNote({
          p: pitch,
          pitchNumber: pitch,
          pitchName: keyName,
          octave,
          fullName,
        })
    }

    const btn = <button onMouseDown={handlePress} key={i} className={keyName}>{hotKey || ' '}</button>
    if(black)
      blackNotes.push(btn)
    else
      whiteNotes.push(btn)
  }

  return <div className='PianoKeyboard'>
    <div className='black-keys'>
      {blackNotes}
    </div>

    <div className='white-keys'>
      {whiteNotes}
    </div>
  </div>
}

export default PianoKeyboard
