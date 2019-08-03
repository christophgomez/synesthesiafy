import React from 'react';
import { Button, Card } from 'react-bootstrap';
import spin from '../../Assets/spin.gif';
import './MiniCard.css';
import reactCSS from 'reactcss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons';
import PlayerFunctions from '../../util/SpotifyPlayerFunctions';
const SpotifyPlayer = new PlayerFunctions();

class MiniCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: null,
      effect: null,
      hovered: false,
      currentlyPlaying: false,
    }
    this.clickedButton = this.clickedButton.bind(this);
  }
  componentDidMount() {
    this.initColor();
    let displaySettings = localStorage.getItem('displaySettings');
    displaySettings = displaySettings ? JSON.parse(displaySettings) : false;
    if (displaySettings) {

    }
    if (this.props.currentlyPlaying !== this.state.currentlyPlaying) {
      this.setState({ currentlyPlaying: this.props.currentlyPlaying });
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.features !== this.props.features)
      this.initColor();
    if(prevProps.currentlyPlaying !== this.props.currentlyPlaying) {
      console.log('component did update card');
      this.setState({ currentlyPlaying: this.props.currentlyPlaying });
    }
  }
  initColor() {
    if (this.props.type === 'track' && this.props.features !== null) {
      this.setTrackColor(this.convertNumToKey(this.props.features.key));
    } else if (this.props.type === 'playlist' && this.props.features !== null) {
      this.setPlaylistColor();
    }
  }
  setPlaylistColor() {
    if (this.props.features) {
      let color = [];
      let colorSettings = localStorage.getItem('colorSettings');
      colorSettings = JSON.parse(colorSettings);
      if (this.props.features.features.length > 0) {
        for (let i = 0; i < this.props.features.features.length; i++) {
          if (this.props.features.features[i]) {
            let key = this.convertNumToKey(this.props.features.features[i].key);
            color.push(colorSettings[key]['color']);
          }
        }
        this.setState({ color: color });
      }
    }
  }
  setTrackColor = (key) => {
    let colorSettings = localStorage.getItem('colorSettings');
    colorSettings = colorSettings ? JSON.parse(colorSettings) : false;
    let colorExists = colorSettings[`${key}`] ? true : false;
    let color;
    if (colorExists) {
      color = colorSettings[`${key}`]['color'];
    } else {
      color = null;
    }
    this.setState({ color: color });
  }
  getModeVariant = () => {
    let colorSettings = localStorage.getItem('colorSettings');
    colorSettings = colorSettings ? JSON.parse(colorSettings) : false;
    let key = this.props.pianoKey;
    let colorExists = colorSettings[key] ? true : false;
    let mode = {};
    if (colorExists) {
      mode.major = colorSettings[key]['major'];
      mode.minor = colorSettings[key]['minor'];
    } else {
      mode.major = 'Normal';
      mode.minor = 'Normal';
    }
    return mode;
  }
  convertNumToKey(key) {
    switch (key) {
      case 0:
        return 'C';
      case 1:
        return 'C# Db';
      case 2:
        return 'D';
      case 3:
        return 'D# Eb';
      case 4:
        return 'E';
      case 5:
        return 'F';
      case 6:
        return 'F# Gb';
      case 7:
        return 'G';
      case 8:
        return 'G# Ab';
      case 9:
        return 'A';
      case 10:
        return 'A# Bb';
      case 11:
        return 'B';
      default:
        break;
    }
  }
  async clickedButton(e) {
    e.stopPropagation();
    if (!this.state.currentlyPlaying) {
      SpotifyPlayer.play(this.props.uri);
      if (this.props.type === 'playlist') {
        this.props.setCurrentlyPlayingPlaylist(this.props.uri);
        this.props.setCurrentlyPlayingTrack(null);
      } else if (this.props.type === 'track') {
        this.props.setCurrentlyPlayingPlaylist(null);
        this.props.setCurrentlyPlayingTrack(this.props.uri);
      }
    }
    else {
      SpotifyPlayer.pause();
      if (this.props.type === 'playlist') {
        this.props.setCurrentlyPlayingPlaylist(null);
      } else if (this.props.type === 'track') {
        this.props.setCurrentlyPlayingTrack(null);
      }
    }
  }
  clickedCard() {
    console.log('card');
  }
  render() {
    let invertImage = this.props.invertImage;
    let bg;
    if (this.state.color) {
      bg = this.state.color;
      if (Array.isArray(this.state.color) && this.state.color.length > 1) {
        bg = 'linear-gradient(to right,';
        for (let i = 0; i < this.state.color.length - 1; i++) {
          bg += this.state.color[i] + ",";
        }
        bg += this.state.color[this.state.color.length - 1] + ")";
      }
    }
    const styles = reactCSS({
      'default': {
        imgView: {
          width: '8rem', height: '8rem', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundImage: `url(${this.props.image})`, cursor: 'pointer'
        },
        colorView: {
          width: '8rem', height: '8rem', background: `${bg}`, cursor: 'pointer'
        },
        icon: {
          cursor: 'default',
          background: 'transparent',
          marginTop: '2.5em'
        },
        loadView: {
          width: '8rem', height: '8rem',backgroundColor:'var(--track-color)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundImage: `url(${spin})`, cursor: 'pointer'
        }
      }
    });
    let color = this.state.color;
    return (
      <div onMouseEnter={() => this.setState({ hovered: true })} onMouseLeave={() => this.setState({ hovered: false })} onClick={this.props.onclick} style={{ margin: '.15rem 1rem' }}>
        {invertImage ?
          <Card className="bg-dark text-white" style={{ width: '8rem', cursor: 'pointer' }}>
            <Card.Img src={this.props.image} style={{ filter: 'brightness(0) invert(1)' }} alt="Card image" />
          </Card> :
          <div>
            <div className="card" onClick={() =>this.clickedCard()} style={this.state.hovered ? color ? styles.colorView : styles.loadView : styles.imgView}>
              {this.state.hovered ?
                <div style={{ width: '4em', height: '4em', textAlign: 'center', margin: '0 auto', color: '' }}>
                  <Button onClick={this.clickedButton}style={styles.icon}><FontAwesomeIcon icon={this.state.currentlyPlaying ? faPause : faPlay} size="2x" /></Button>
                </div> : null}              
            </div>


            <div style={{ cursor: 'pointer', maxWidth: '8rem', overflow: 'hidden' }}>
              <p style={{ marginTop: '.5em', textAlign: 'center', fontSize: '14px', marginBlockEnd: '0' }}>
                {this.props.infoHeader}
              </p>
              <p style={{ marginBlockStart: '0', textAlign: 'center', fontSize: '12px' }}>
                {this.props.infoSubHeader}
              </p>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default MiniCard;