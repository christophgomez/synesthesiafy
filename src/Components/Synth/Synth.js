import React from 'react';
// import * as Tone from 'tone';
import './Synth.css'

class Sound {
  constructor(frequency) {
    this.osc = window.audioCtx.createOscillator();
    this.pressed = false;
    this.osc.frequency.value = frequency;
    this.osc.type = 'sine';
    this.osc.start(0);
  }
  play() {
    if (!this.pressed) {
      this.pressed = true;
      this.osc.connect(window.audioCtx.destination);
    }
  }
  stop() {
    this.pressed = false;
    this.osc.disconnect();
  }
}



export default class Synth extends React.Component {
  constructor(props) {
    super(props);
    window.audioCtx = window.audioContext || new AudioContext();
    //this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
    this.notesByKeyCode = [
      { keyCode: 65, noteName: 'C', note: 'C4', sound: new Sound(261.6), color: 'white' },
      { keyCode: 87, noteName: 'C# Db', note: 'Db4', sound: new Sound(277.18), color: 'black' },
      { keyCode: 83, noteName: 'D', note: 'D4', sound: new Sound(293.7), color: 'white' },
      { keyCode: 69, noteName: 'D# Eb', note: 'Eb4', sound: new Sound(311.13), color: 'black' },
      { keyCode: 68, noteName: 'E', note: 'E4', sound: new Sound(329.6), color: 'white' },
      { keyCode: 70, noteName: 'F', note: 'F4', sound: new Sound(349.2), color: 'white' },
      { keyCode: 84, noteName: 'F# Gb', note: 'Gb4', sound: new Sound(369.99), color: 'black' },
      { keyCode: 71, noteName: 'G', note: 'G4', sound: new Sound(392), color: 'white' },
      { keyCode: 89, noteName: 'G# Ab', note: 'Ab4', sound: new Sound(415.30), color: 'black' },
      { keyCode: 72, noteName: 'A', note: 'A4', sound: new Sound(440), color: 'white' },
      { keyCode: 85, noteName: 'A# Bb', note: 'Bb4', sound: new Sound(466.16), color: 'black' },
      { keyCode: 74, noteName: 'B', note: 'B4', sound: new Sound(493.9), color: 'white' },
      { keyCode: 75, noteName: 'C', note: 'C5', sound: new Sound(523.25), color: 'none' },
      { keyCode: 79, noteName: 'C# Db', note: 'Db5', sound: new Sound(554.37), color: 'none' },
      { keyCode: 76, noteName: 'D', note: 'D5', sound: new Sound(587.3), color: 'none' },
      { keyCode: 80, noteName: 'D# Eb', note: 'Eb5', sound: new Sound(622.25), color: 'none' },
      { keyCode: 186, noteName: 'E', note: 'E5', sound: new Sound(659.3), color: 'none' },
      { keyCode: 222, noteName: 'F', note: 'F5', sound: new Sound(698.46), color: 'none' }
    ];
    this.playScale = this.playScale.bind(this);
  }
  makeSound(key = null, sound) {
    sound.play();
    //this.synth.triggerAttack(note);
    if (key !== null)
      this.props.toggleColorSettings(key, true);
  }
  endSound(sound) {
    sound.stop();
    //this.synth.triggerRelease(note)
  }
  computeScales = (key) => {
    let scales = {};
    // There is a better way to calulate music scales but I dont know music theory so I'll just do this
    switch (key) {
      case 'C':
        scales.major = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
        scales.minor = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'];
        break;
      case 'C# Db':
        scales.major = ['Db4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4', 'C5', 'Db5'];
        scales.minor = ["Db4", 'Eb4', 'E4', 'Gb4', 'Ab4', 'A4', 'Bb4', 'Db5'];
        break;
      case 'D':
        scales.major = ['D4', 'E4', 'Gb4', 'G4', 'A4', 'B4', 'Db5', 'D5'];
        scales.minor = ['D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5', 'D5'];
        break;
      case 'D# Eb':
        scales.major = ['Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5', 'D5', 'Eb5'];
        scales.minor = ['Eb4', 'F4', 'Cb4', 'Ab4', 'Bb4', 'C5', 'Db5', 'Eb5'];
        break;
      case 'E':
        scales.major = ['E4', 'Gb4', 'Ab4', 'A4', 'B4', 'Db5', 'Eb5', 'E5'];
        scales.minor = ['E4', 'Gb4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
        break;
      case 'F':
        scales.major = ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5'];
        scales.minor = ['F4', 'G4', 'Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5'];
        break;
      case 'F# Gb':
        scales.major = ['Gb4', 'Ab4', 'Bb4', 'B4', 'Db5', 'Eb5', 'F5', 'Gb5'];
        scales.minor = ['Gb4', 'Ab4', 'A4', 'B4', 'Db5', 'D5', 'E5', 'Gb5'];
        break;
      case 'G':
        scales.major = ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'Gb5', 'G5'];
        scales.minor = ['G4', 'A4', 'Bb4', 'C5', 'D5', 'Eb5', 'F5', 'G5'];
        break;
      case 'G# Ab':
        scales.major = ['Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'G5', 'Ab5'];
        scales.minor = ['Ab4', 'Bb4', 'C5', 'Db5', 'Eb5', 'E5', 'Gb5', 'Ab'];
        break;
      case 'A':
        scales.major = ['A4', 'B4', 'Db5', 'D5', 'E5', 'Gb5', 'Ab5', 'A5'];
        scales.minor = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'];
        break;
      case 'A# Bb':
        scales.major = ['Bb4', 'C5', 'D5', 'Eb5', 'F5', 'G5', 'A5', 'Bb5'];
        scales.minor = ['Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'Gb5', 'Ab5', 'Bb5'];
        break;
      case 'B':
        scales.major = ['B4', 'Db5', 'Eb5', 'E5', 'Gb5', 'Ab5', 'Bb5', 'B5'];
        scales.minor = ['B4', 'Db5', 'D5', 'E5', 'Gb5', 'G5', 'A5', 'B5'];
        break;
      default:
    }
    return scales;
  }
  computeChords = (key) => {
    let chords = {};
    switch(key) {
      case 'C':
        chords.major = ['C4', 'E4', 'G4'];
        chords.minor = ['C4', 'Eb4', 'G4'];
        break;
      case 'C# Db':
        chords.major = ['Db4', 'F4', 'Ab4'];
        chords.minor = ["Db4", 'E4', 'Gb4'];
        break;
      case 'D':
        chords.major = ['D4', 'Gb4','A4'];
        chords.minor = ['D4', 'F4', 'A4'];
        break;
      case 'D# Eb':
        chords.major = ['Eb4', 'G4', 'Bb4'];
        chords.minor = ['Eb4', 'Cb4', 'Bb4'];
        break;
      case 'E':
        chords.major = ['E4', 'Ab4','B4'];
        chords.minor = ['E4', 'G4', 'B4'];
        break;
      case 'F':
        chords.major = ['F4', 'A4', 'C5'];
        chords.minor = ['F4', 'Ab4', 'C5'];
        break;
      case 'F# Gb':
        chords.major = ['Gb4', 'Bb4', 'Db5'];
        chords.minor = ['Gb4', 'A4', 'Db5'];
        break;
      case 'G':
        chords.major = ['G4', 'B4', 'D5'];
        chords.minor = ['G4', 'Bb4', 'D5'];
        break;
      case 'G# Ab':
        chords.major = ['Ab4', 'C5', 'Eb5'];
        chords.minor = ['Ab4', 'C5', 'Eb5'];
        break;
      case 'A':
        chords.major = ['A4','Db5', 'E5'];
        chords.minor = ['A4','C5', 'E5'];
        break;
      case 'A# Bb':
        chords.major = ['Bb4', 'D5', 'F5'];
        chords.minor = ['Bb4', 'Db5', 'F5'];
        break;
      case 'B':
        chords.major = ['B4', 'Eb5', 'Gb5'];
        chords.minor = ['B4', 'D5', 'Gb5'];
        break;
      default:
        break;
    }
    return chords;
  }
  playScale = (pianoKey, mode) => {
    let self = this;
    console.log(pianoKey);
    let scale = this.computeScales(pianoKey);
    let chord = this.computeChords(pianoKey);
    if (mode === 'major') {
      scale = scale.major;
      chord = chord.major;
    } else {
      scale = scale.minor;
      chord = chord.minor;
    }
    /*var pattern = new Tone.Pattern(function (time, note) {
      self.synth.triggerAttackRelease(note, "4n", time);
    }, scale, "upDown").start(0);
    var tempo = 200;
    //Tone.Transport.bpm.value = tempo
    //Tone.Transport.start("+0.1");
    pattern.stop("+4.5");*/
  }
  playChord = (pianoKey, mode) => {
    let chord = this.computeChords(pianoKey);
    if (mode === 'major') {
      chord = chord.major;
    } else {
      chord = chord.minor;
    }
    //this.synth.triggerAttackRelease(chord, "4n");
  }
  componentWillUnmount() {
    window.audioCtx.close();
  }
  render() {
    return (
      <ul className="set">
        {this.notesByKeyCode.map((obj) => {
          return (
            <li key={obj.note} className={"piano-key " + obj.color + " " + obj.noteName} onMouseDown={() => this.makeSound(obj.noteName, obj.sound)} onMouseUp={() => this.endSound(obj.sound)}>
              <div style={{ height: '100%', textAlign: 'center' }}>
                <p className={obj.color + "-name"}>{obj.noteName}</p>
              </div>
            </li>
          )
        })}
      </ul>
    );
  }
}