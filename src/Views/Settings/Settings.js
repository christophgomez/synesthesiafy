import React from 'react';
import './Settings.css';
import { Accordion, Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import ColorSettings from '../../Components/ColorPreferences/ColorPreferences';
import Synth from '../../Components/Synth/Synth';
import api from '../../Services/SpotifyAPI';
const Spotify = new api();

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorAccordion: false,
      displayDisplayAccordion: false,
      displayColorSettings: false,
    }
    this.synth = React.createRef();
    this.toggleColorSettings = this.toggleColorSettings.bind(this);
    this.getPreview = this.getPreview.bind(this);
  }
  handleKeyDown(event) {
    if (this.state.displayColorAccordion) {
      if (!event.repeat) {
        for (let i = 0; i < this.synth.current.notesByKeyCode.length; i++) {
          if (event.keyCode === this.synth.current.notesByKeyCode[i].keyCode) {
            this.synth.current.makeSound(this.synth.current.notesByKeyCode[i].noteName, this.synth.current.notesByKeyCode[i].sound);
          }
        }
      }
    }
  }
  handleKeyUp(event) {
    for (let i = 0; i < this.synth.current.notesByKeyCode.length; i++) {
      if (event.keyCode === this.synth.current.notesByKeyCode[i].keyCode) {
        this.synth.current.endSound(this.synth.current.notesByKeyCode[i].sound);
      }
    }
  }
  toggleColorAccordion() {
    this.setState({ displayColorAccordion: !this.state.displayColorAccordion });
    if (!this.state.displayColorAccordion) {
      this.setState({ displayColorSettings: false });
    }
  }
  toggleDisplayCollapse() {
    this.setState({ displayDisplayAccordion: !this.state.displayDisplayAccordion });
  }
  toggleColorSettings(key, open) {
    this.key = key;
    this.setState({ displayColorSettings: open });
  }
  async getPreview(key, mode) {
    let amt = 0;
    let trks = [];
    let library = this.props.tracks;
    let first = 0, last = 0;
      for (let i = 0; i < library.length; i) {
        //  Get the first 100 tracks
        amt = 0;
        first = i;
        trks = [];
        while (amt < 100 && i < library.length) {
          trks.push(library[i].id);
          if(amt < 99)
            i++;
          amt++;
        }
        last = i;
        // get the analyzation of each track
        try {
          const res = await Spotify.getTrackFeatures({ access_token: localStorage.access_token, track: trks });
          // compare the key and the mode of each track with params
          for (let j = 0; j < res.data.features.length; j++) {
            if (res.data.features[j].key === key && res.data.features[j].mode === mode) {
              let id = res.data.features[j].id;
              for (let k = first; k < last; k++) {
                if (library[k].id === id && library[k].preview_url !== null) {
                  return library[k].preview_url;
                }
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      return null;
  }
  render() {
    return (
      <div tabIndex='0' onKeyDown={(e) => this.handleKeyDown(e)} onKeyUp={(e) => this.handleKeyUp(e)} className='settings-container' style={{ margin: '2rem auto' }}>
        <h2>Settings</h2>

        <Accordion className='settings-section'>
          <Accordion.Toggle as={Card.Header} eventKey="0" className='settings-section-title' onClick={() => this.toggleColorAccordion()}>
            <h3>
              Sound & Color{this.state.displayColorAccordion ? <FontAwesomeIcon style={{ fontSize: '.8em', float: 'right' }} icon={faArrowUp} /> : <FontAwesomeIcon style={{ fontSize: '.8em', float: 'right' }} icon={faArrowDown} />}
            </h3>
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0" >
            <div>
              <p style={{ textAlign: 'left', marginTop: '1em' }}>Select a key to set a color</p>
              <Synth ref={this.synth} toggleColorSettings={this.toggleColorSettings} />

              {this.state.displayColorSettings ? <ColorSettings preview={this.getPreview} pianoKey={this.key} playScale={this.synth.current.playScale} playChord={this.synth.current.playChord} toggleControls={this.props.toggleControls}/> : <p>Press the keys to hear the note (Or just play the piano with your keyboard! :)</p>}
            </div>
          </Accordion.Collapse>
        </Accordion>

        <Accordion className='settings-section'>
          <Accordion.Toggle as={Card.Header} eventKey="0" className='settings-section-title' onClick={() => this.toggleDisplayCollapse()}>
            <h3>
              Display{this.state.displayDisplayAccordion ? <FontAwesomeIcon style={{ fontSize: '.8em', float: 'right' }} icon={faArrowUp} /> : <FontAwesomeIcon style={{ fontSize: '.8em', float: 'right' }} icon={faArrowDown} />}
            </h3>
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
          </Accordion.Collapse>
        </Accordion>

      </div>
    );
  }
}