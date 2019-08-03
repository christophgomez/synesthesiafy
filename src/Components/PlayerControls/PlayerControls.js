import React from 'react';
import './PlayerControls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons';
import api from '../../Services/SpotifyAPI';
import PlayerFunctions from '../../util/SpotifyPlayerFunctions.js';
const SpotifyPlayer = new PlayerFunctions();

export default class PlayerControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState(this.props.data);
    } 
  } 
  render() {
    return (
      <footer className="footer">
        <div className='footer__sidenav'>
          <div className='album-cover' style={this.props.albumCover ? { backgroundImage: `url(${this.props.albumCover})` } : null}></div>
          <div className='footer__sidenav-item'><p>{this.props.trackTitle ? this.props.trackTitle : null}</p><p><small>{this.props.trackArtist ? this.props.trackArtist : null}</small></p></div>
        </div>
        <div className='controls'>
          <FontAwesomeIcon className='controls-item' icon={faStepBackward} onClick={() => SpotifyPlayer.prev()} />
          <FontAwesomeIcon className='controls-item' icon={this.props.paused ? faPlayCircle : faPauseCircle} onClick={() => SpotifyPlayer.togglePlay()} />
          <FontAwesomeIcon className='controls-item' icon={faStepForward} onClick={() => SpotifyPlayer.next()} />
        </div>
      </footer>
    );
  }
}