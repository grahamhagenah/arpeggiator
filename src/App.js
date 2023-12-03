import * as Tone from 'tone'
import './App.css'
import { useState, useEffect } from 'react'

function App() {

  const synth =  new Tone.PolySynth(Tone.Synth).toDestination()
  const [octave, setOctave] = useState(4);

  // Capture state variables
  let currentOctave = octave

  useEffect(() => {
    // Focus on App after render to allow immediate acess for handleKeyDown
    document.getElementsByTagName("main")[0].focus()
  }, [])

  const Piano = ({synth, octave}) => {
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];

    return (
      <div className="piano-roll">
        <div className="black-keys">
          {blackKeys.map((note, index) => (
            <PianoKey key={index} note={note} synth={synth} octave={octave} className="black-key key" />
          ))}
        </div>
        <div className="white-keys">
          {whiteKeys.map((note, index) => (
            <PianoKey key={index} note={note} synth={synth} octave={octave} className="white-key key" />
          ))}
        </div> 
      </div>
    )
  }

  const playNote = async (note, octave, synth) => {
    await Tone.start()
    synth.triggerAttackRelease((note + octave), '8n')
  }

  const PianoKey = (props) => {
    return (
      <button onClick={() => playNote(props.note, props.octave, props.synth)}>
        {props.note}
      </button>
    ) 
  }

  const handleKeyDown = (props) => {
    const note = noteMapping[props.key];
    if (note) {
      playNote(note, currentOctave, synth)
    }
  }

  const noteMapping = {
    'a': 'C',
    'w': 'C#',
    's': 'D',
    'e': 'D#',
    'd': 'E',
    'f': 'F',
    't': 'F#',
    'g': 'G',
    'y': 'G#',
    'h': 'A',
    'u': 'A#',
    'j': 'B'
  }
  
  return (
    <main className="App" tabIndex="0" onKeyDown={handleKeyDown}>
      <header className="App-header">
        <Piano synth={synth} octave={currentOctave} />
        <button onClick={() => setOctave(5)}>Set Octave</button>
      </header>
    </main>
  )
}

export default App