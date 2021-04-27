import clap from './drum-samples/Clap-808.aif.mp3';
import kick from './drum-samples/Kick FutureProof.wav.mp3'
import bongo from './drum-samples/Bongo-C78-Low.aif.mp3';
import snare from './drum-samples/Snare-707-b.aif.mp3';
import hihat from './drum-samples/Hihat Sharp Closed.aif.mp3';
import tom from './drum-samples/Tom-909-Hi.aif.mp3';
import cowbell from './drum-samples/Cowbell-808.aif.mp3';
import shaker from './drum-samples/Maracas-808.aif.mp3';

const audioFiles: {[name:string]: string} = { clap, kick, bongo, snare, hihat, tom, cowbell, shaker }

export const drumSampleNames = Object.keys(audioFiles);

function loadAudioBuffer(url: string, ctx: AudioContext): Promise<AudioBuffer> {
  return new Promise((fulfil, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open('get', url);
    xhttp.responseType = 'arraybuffer';
    xhttp.onload = () => {
      let arrayBuffer = xhttp.response;
      ctx.decodeAudioData(
        arrayBuffer,
        buffer => {
          fulfil(buffer);
        },
        err => {
          reject(err);
        }
      )
    }
    xhttp.onerror = err => {
      reject(err)
    };
    xhttp.send();
  });
}

export const drumBuffers:{[name: string]: AudioBuffer|'pending'|'loading'|undefined}  = {
}
for(let name in audioFiles)
  drumBuffers[name] = 'pending';

export async function loadDrumBuffers(ctx: AudioContext) {
  const promises: Promise<void>[] = [];
  for(let name in audioFiles) {
    const url = audioFiles[name];
    drumBuffers[name] = 'loading';
    promises.push(
      loadAudioBuffer(url, ctx).then(audiobuffer => {
        drumBuffers[name] = audiobuffer;
      })
    );
  }

  await Promise.all(promises);

  return drumBuffers
}

export default drumBuffers;


export interface DrumParse {
  str: string;
  hasDrums: boolean;
  drums: string[];
}
export function parseDrum(str: string) {
  let tidied = str.toLowerCase().trim();
  if(drumBuffers[tidied])
    return {
      str,
      hasDrums: true,
      drums: [tidied],
    }
  else
    return {
      str,
      hasDrums: false,
      drums: [],
    }
}
