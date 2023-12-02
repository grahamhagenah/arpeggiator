import * as Tone from 'tone'
import './App.css'
import { useState } from 'react'

function App() {

  const synth = new Tone.Synth().toDestination()
  const [octave, setOctave] = useState(4);

  // Capture state variables
  let currentOctave = octave


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

  const PianoKey = (props) => {
    const playNote = async () => {
      await Tone.start()
      props.synth.triggerAttackRelease((props.note + props.octave), '8n');
    }

    return (
      <button onClick={playNote}>
          {props.note}
      </button>
    ) 
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <Piano synth={synth} octave={currentOctave} />
        <button onClick={() => setOctave(5)}>Set Octave</button>
      </header>
    </div>
  )
}

export default App