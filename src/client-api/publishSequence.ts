import {SequencerState} from '../features/sequencer/sequencerSlice';

export interface PublishedSequence {
  sequence: SequencerState;
  datePublished?: Date;
  filename?: string;
}

const apiLocation = 'api/'

export function publishSequence(sequence:SequencerState):Promise<string> {
  if(sequence.composer.length === 0)
    sequence = {
      ...sequence,
      composer: 'anon',
    }
  return new Promise((fulfil, reject) => {
    const xhttp = new XMLHttpRequest();
    const url = apiLocation + 'publish-sequence.php';
    xhttp.open('post', url);
    xhttp.onload = () => fulfil(xhttp.responseText);
    xhttp.onerror = err => reject(err);

    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let sequenceEncoded = encodeURIComponent(JSON.stringify(sequence));
    let postBody = `sequence=${
      sequenceEncoded
    }&title=${
      encodeURIComponent(sequence.title)
    }&composer=${
      encodeURIComponent(sequence.composer)
    }`;
    xhttp.send(postBody);
  });
}

export function listSequences():Promise<{id:string; composer?:string; title?:string}[]> {
  return new Promise((fulfil, reject) => {
    const xhttp = new XMLHttpRequest();
    const url = apiLocation + 'list-sequences.php';
    xhttp.open('get', url);
    xhttp.onload = () => fulfil(
      xhttp.responseText.split('\n')
      .filter(line => line.length)
      .map(line => {
        let [id, composer, title] = line.split("\t")
        return {id, composer, title};
      })
    )

    xhttp.onerror = err => reject(err);

    xhttp.send();
  });
}

export function fetchSequenceData(sequenceId: string):Promise<SequencerState> {
  return new Promise((fulfil, reject) => {
    const xhttp = new XMLHttpRequest();
    const url = apiLocation + `sequence-data.php?id=${
      encodeURIComponent(sequenceId)
    }`;
    xhttp.responseType = 'json'
    xhttp.open('get', url);
    xhttp.onload = () => fulfil(xhttp.response);
    xhttp.onerror = err => reject(err);
    xhttp.send();
  });
}
