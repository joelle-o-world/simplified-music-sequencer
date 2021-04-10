import React from 'react';
import {FunctionComponent} from 'react';
//import DebussyManuscript from '../img/debussy-manuscript.png';
import AmyBeechManuscript from '../assets/amy-beech-manuscript.jpg';
import AllahsAutomata from '../assets/Allahs-Automata.jpg';
import Camshaft from '../assets/camshaft.jpg';
import Pianola from '../assets/pianola.jpg';
import RaymondScott from '../assets/RaymondScott.jpg'
import MidiPicnic from '../assets/midi-picnic.jpg';
import SIDChip from '../assets/SID.jpg';

export const SequencerHistory:FunctionComponent = () => (
  <article className="SequencerHistory">
    <h1>A brief history of Sequencing</h1>
    <p><em>Sequencing</em> means planning the notes of a piece of music before it is played. This is usually done using a machine or a piece of software on the computer. But we also use our brains and hands as a sequencer whenever we play an instrument.</p>

    <section>
      <figure className="float-left" style={{maxWidth: "700px"}}>
        <img src={AllahsAutomata} />
        <figcaption className="insetOnFigure">A modern day reconstruction of the Banū Mūsā musical automaton.</figcaption>
      </figure>
      <h2>{"بنو موسى"}<br/>{"(Banū Mūsā)"}</h2>
      <p>The first mechanical music sequencer was built more than <strong>1100 years ago</strong> in Iraq. The Banū Mūsā brothers were Persian scholars living in Baghdad in the 9th century. Their machine had a set of mechanical arms that read the notes of a spinning wheel and played them on a flute. Instead of a human blowing on the flute, hot pressurised steam was blasted through to make it sound.</p>
    </section>

    <section>
      <figure className="float-right">
        <img src={AmyBeechManuscript}  />
        <figcaption className="insetOnFigure">
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
      <figure className="float-left">
        <iframe src="//commons.wikimedia.org/wiki/File:How_a_Wind_Up_Music_Box_Works.webm?embedplayer=yes" width="854" height="336" frameBorder="0"  allowFullScreen id="MusicBoxVideo"></iframe>
      </figure>
      <p><strong>Music boxes</strong> are small clockwork devices which became popular about 200 years ago. In Europe, they evolved from 13th century mechanisms for ringing the bells in Dutch churches. They work in a similar way to the Banū Mūsā machine: The notes are triggered by little bumps (called cams) on a spinning wheel.</p> 
      <figure className="float-right">
        <img src={Camshaft} />
        <figcaption className="insetOnFigure">The camshaft from a car engine works like the rotating sequencer in a music box</figcaption>
      </figure>
      <p>A similar system is used to control all the rhythms inside a car engine. A long metal part called the camshaft is covered in carefully positioned bumps. These bumps push levers so that the engine works with perfect timing, even at high speed.</p>
      
    </section>

    <section>
      <figure className="float-right">
        <img src={Pianola} />
        <figcaption className="insetOnFigure">A photo from a pianola brochure in 1903</figcaption>
      </figure>
      <h2>Self Playing Pianos</h2>
      <p>A <a href="http://www.pianola.org/history/history_pianoplayers.cfm"><em>pianola</em></a> is a special piano with the ability to play itself. You had to feed them a long roll of paper covered in holes which tell it which notes to play. You could also feed them blank paper while playing a tune on the keyboard to make a recording!</p>
    </section>
    <section>
      <figure className="float-left">
        <img src={RaymondScott} />
        <figcaption className="insetOnFigure">Raymond Scott with some of his machines</figcaption>
      </figure>
      <h2>Early Electronic Sequencers</h2>
        <p>One of the first electronic sequencers was invented by <a href="http://120years.net/the-clavivoxraymond-scottusa1952-2/">Raymond Scott</a> in the 1960s, the same guy who wrote music for 1930s <a href="https://www.youtube.com/watch?v=r3FLN0iQ9SQ">Looney Tunes</a> animations. This machine was <strong className="butNotHuge">6 feet tall and 30 feet wide</strong> and made using repurposed telephone parts.</p>
    </section>
    
    <section>
      <figure className="float-right">
        <img src={SIDChip} />
        <figcaption>A MOS 6581 SID chip. About the size of your fingernail, this chip is a whole musical instrument!</figcaption>
      </figure>
      <h2>Microchips and video games</h2>
      <p>The first popular video games emerged in the late 1970s. In those days musical recordings had to be played on large vinyl records which were too expensive and fragile to put in a video game console. Instead, game consoles had special microchips to perform the music live as you play the game. To do this, the console's computer had to double as a sequencer and send instructions to the sound chip. Up until about 10 years ago, most handheld games consoles still couldn't play high quality sound recordings and relied on tiny digital music instruments.</p>
    </section>
    <section>
      <figure className="float-right">
        <img src={MidiPicnic} />
      </figure>
      <h2>MIDI in the 1980s</h2>
      <p>By the 1980s electronic musical instruments were being being mass produced. In 1982, engineers from around the world got to together to create MIDI: a standardised way to send musical instructions through an electrical cable. For the first time computers, sequencers and synthesisers could all speak to one another in a common language.</p> 
      <p>As a result, the sequencer became the heart of the 1980s music studio, able to coordinate a whole orchestra of sounds from a single computer. Although these machines were very expensive, it was still cheaper than paying dozens of real musicians. This is why a lot of eighties music has an uncanny synthetic sound.</p>
    </section>
  </article>
)
