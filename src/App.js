import * as Tone from 'tone'
import './App.css'
import { useState, useEffect } from 'react'

function App() {

  const synth =  new Tone.AMSynth().toDestination()
  const [octave, setOctave] = useState(4)
  const [notes, setNotes] = useState(['C4', 'E4', 'G4']) // Initial notes
  const [pattern, setPattern] = useState(null);

  // Capture state variables
  let currentOctave = octave

  useEffect(() => {

    document.getElementsByTagName("main")[0].focus()  // Focus after render to allow immediate acess for handleKeyDown

    const synth = new Tone.Synth().toDestination()
  
    const pattern = new Tone.Pattern((time, note) => {
      synth.triggerAttackRelease(note, '8n', time)
    }, notes, 'up')
  
    setPattern(pattern)

    pattern.interval = '16n'
  
    return () => {
      pattern.dispose()
      synth.dispose()
    }
  }, [])

  useEffect(() => {
    if (pattern) {
      pattern.values = notes
    }
  }, [notes, pattern])

  const startArpeggiator = () => {
    Tone.Transport.start()
    pattern.start(0)
  }
  
  const stopArpeggiator = () => {
    pattern.stop()
    Tone.Transport.stop()
  }

  const addNote = (newNote) => {
    console.log(notes)
    setNotes(prevNotes => {
      let updatedNotes = [...prevNotes, newNote];
      // If the array length exceeds 4, remove the first element
      if (updatedNotes.length > 3) {
        updatedNotes.shift()
      }
      return updatedNotes
    })
  }

  const Piano = ({synth, octave}) => {
    const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#', 'C#', 'D#']
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D']

    return (
      <div className="piano-roll">
        <div className="black-keys">
          {blackKeys.map((note, index) => (
            <PianoKey key={index} note={note} synth={synth} octave={(index > 4) ? octave + 1 : octave } className="black-key key" />
          ))}
        </div>
        <div className="white-keys">
          {whiteKeys.map((note, index) => (
            <PianoKey key={index} note={note} synth={synth} octave={(index > 6) ? octave + 1 : octave} className="white-key key" />
          ))}
        </div> 
      </div>
    )
  }

  const PianoKey = (props) => {
    return (
      <button onClick={() => addNote(props.note + props.octave)}>
        {props.note}
      </button>
    ) 
  }

  const handleKeyDown = (props) => {
    const note = noteMapping[props.key]
    if(note) {
      // If following keys are played, move the octave up one
      addNote(note + (['k', 'l', 'o', 'p'].includes(props.key) ? currentOctave + 1 : currentOctave))
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
    'j': 'B',
    'k': 'C',
    'l': 'D',
    'o': 'C#',
    'p': 'D#'
  }
  
  return (
    <main className="App" tabIndex="0" onKeyDown={handleKeyDown}>
      <header className="App-header">
        <ol>
          {/* {pattern && (pattern.values).map((note, key) => (
            <li key={key} className={(key === currentIndex) ? "currentKey" : "key"}>
              <p>{note}</p>
            </li>
          ))} */}
        </ol>
        <Piano synth={synth} octave={currentOctave} />
        <button id="start" onClick={ async () => { await Tone.start() }}>Enable</button>
        <button onClick={startArpeggiator}>Start</button>
        <button onClick={stopArpeggiator}>Stop</button>
      </header>
    </main>
  )
}

export default App