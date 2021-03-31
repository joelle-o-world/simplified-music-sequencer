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

    // Get letter
    let letterResult = str[0]
    if(letterResult) { 
      let letter = letterResult[0].toUpperCase();
      let pitchClass = letterValues[letter];
      if(pitchClass !== undefined)
        return {
          hasPitch: true,
          midiNumber: pitchClass + 49,
          str,
        }
      else
        throw `"${letter}" is not a musical note`;
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
