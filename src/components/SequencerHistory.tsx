import React from 'react';
import {FunctionComponent} from 'react';
//import DebussyManuscript from '../img/debussy-manuscript.png';
import AmyBeechManuscript from '../assets/amy-beech-manuscript.jpg';
import AllahsAutomata from '../assets/Allahs-Automata.jpg';

export const SequencerHistory:FunctionComponent = () => (
  <article className="SequencerHistory">
    <h1>A brief history of Sequencing</h1>
    <p><em>Sequencing</em> means planning the notes of a piece of music before it is played. This is usually done using a machine or a piece of software on the computer. But we also use our brains and hands a sequencer whenever we play an instrument.</p>

    <section>
      <figure className="float-left" style={{maxWidth: "700px"}}>
        <img src={AllahsAutomata} />
        <figcaption>A modern day reconstruction of the Banū Mūsā musical automaton.</figcaption>
      </figure>
      <h2>{"بنو موسى"}<br/>{"(Banū Mūsā)"}</h2>
      <p>The first mechanical music sequencer was built more than <strong>1100 years ago</strong> in Iraq. The Banū Mūsā brothers were Persian scholars living in Baghdad in the 9th century. Their machine had a set of mechanical arms that read the notes of a spinning wheel and played them on a flute. Instead of a human blowing on the flute, hot pressurised steam was blasted through to make it sound.</p>
    </section>

    <section>
      <figure className="float-right">
        <img src={AmyBeechManuscript}  />
        <figcaption>
        <a href="https://www.youtube.com/watch?v=Nffsdey4jis" target="_blank">A Hermit Thrush at Morn</a> by <a href="https://www.bbc.co.uk/sounds/play/p07836kk" target="_blank">Amy Beach</a></figcaption>
      </figure>

      <h2>Written Music Notation</h2>

      <p>Before we had computers, or even electricity, people used to write down
      their music on paper. An elaborate notation was invented to describe
      all the sounds in a piece of music. Musicians practice to be
      able to read the notation and play the music. </p>

      <p>This notation is still in use today, although these days it is more often
      printed by a computer than written by hand.  That's why we can still
      listen to classical music: the manuscripts survive from hundreds of
      years ago, and modern day musicians still learn to play them.</p>

    </section>

    
    <section>
      <h2>Music Boxes</h2>
      <iframe src="//commons.wikimedia.org/wiki/File:How_a_Wind_Up_Music_Box_Works.webm?embedplayer=yes" width="854" height="480" frameBorder="0"  allowFullScreen id="MusicBoxVideo"></iframe>

      </section>
  </article>
)
