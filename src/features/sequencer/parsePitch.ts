const letterValues:{[note: string]: number} = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

export interface PitchParse {
  hasPitch?: boolean;
  midiNumber?: number;
  hasError?: boolean;
  errorMessage?: string;
  str: string;
}

export function parsePitch(inputStr:string): PitchParse {
  try {
    // Trim whitespace
    let str = inputStr.trim();

    if(str.length == 0)
      return {
        hasPitch: false,
        str,
      }

    
    
    let octaveNumber = /\d+$/.exec(str);
    let octave = 4;
    if(octaveNumber) {
      octave = parseInt(octaveNumber[0])
      str = str.slice(0, -octaveNumber[0].length)
      console.log(octave, str, '!!');
    }

    // Get letter
    let letterResult = str[0]
    let accidentalResult = str[1];

    if(letterResult) { 
      let letter = letterResult[0].toUpperCase();
      let pitchClass = letterValues[letter];
      let midiNumber = pitchClass + octave * 12
      if(accidentalResult == '#')
        midiNumber++;
      else if(accidentalResult == 'b')
        midiNumber--;
      else if(accidentalResult)
        throw `"${inputStr}" is not a musical note`
      
      if(pitchClass !== undefined)
        return {
          hasPitch: true,
          midiNumber,
          str: inputStr,
        }
      else
        throw `"${inputStr}" is not a musical note`;
    } else
      throw "Could not find letter";
  } catch(err) {
    return {
      hasPitch: false,
      hasError: true,
      errorMessage: err,
      str: inputStr,
    }
  }
}

export default parsePitch;
