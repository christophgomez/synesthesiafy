import React from 'react';
import API from '../../Services/SpotifyAPI';
import './Auth.css';
import Button from '../../Components/Button/Button';
import { withRouter } from 'react-router-dom';
import Synth from '../../Components/Synth/Synth';
import ColorSettings from '../../Components/ColorPreferences/ColorPreferences';
import defaults from '../../util/defaults'
const SpotifyAPI = new API();

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      basic: false,
      error: false,
      displayColorSettings: false,
      tracks: null,
    };
    this.exchange = this.exchange.bind(this);
    this.toggleColorSettings = this.toggleColorSettings.bind(this);
    this.getPreview = this.getPreview.bind(this);
    this.synth = React.createRef();
  }
  handleKeyDown(event) {
    if (this.state.displayColorSettings) {
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
  toggleColorSettings(key, open) {
    this.key = key;
    this.setState({ displayColorSettings: open });
  }
  async getTracks() {
    try {
      let loaded = 0, total = 0, access_token = localStorage.access_token, offset = 0, tracks = [];
      let results = await SpotifyAPI.getTracks({ access_token, offset });
      for (let i = 0; i < results.data.tracks.length; i++) {
        tracks.push(results.data.tracks[i].track);
      }
      loaded = tracks.length;
      total = results.data.total;
      while (loaded < total) {
        offset = loaded;
        results = await SpotifyAPI.getTracks({ access_token, offset });
        for (let i = 0; i < results.data.tracks.length; i++) {
          tracks.push(results.data.tracks[i].track);
        }
        loaded += results.data.tracks.length;
      }
      this.setState({ tracks: tracks, loading: false });
    } catch (err) {
      return null;
    }
  }
  async getPreview(key, mode) {
    let amt = 0;
    let trks = [];
    let library = this.state.tracks;
    if(library === null) {
      return;
    }
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
        const res = await SpotifyAPI.getTrackFeatures({ access_token: localStorage.access_token, track: trks });
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
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const code = params.get('code');
    if (code) {
      this.exchange(code);
    } else {
      this.setState({ error: true });
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadTime);
  }
  toggleControls() {
    return;
  }
  async exchange(code) {
    try {
      const authRes = await SpotifyAPI.authExhange(code);
      try {
        const profileRes = await SpotifyAPI.getProfile(authRes.data.token.access_token);
        localStorage.setItem('access_token', authRes.data.token.access_token);
        localStorage.setItem('refresh_token', authRes.data.token.refresh_token);
        if (profileRes.data.profile.product !== 'premium') {
          this.setState({ basic: true });
        }
        localStorage.setItem('colorSettings', JSON.stringify(defaults));
        this.getTracks();
      } catch (err) {
        this.setState({ error: true, loading: false });
      }
    } catch (err) {
      this.setState({ error: true, loading: false });
    }
  }
  toggleSynth() {
    this.setState({ basic: false });
  }
  render() {
    let basic = this.state.basic;
    let error = this.state.error;
    return (
      <div className='Auth' tabIndex='0' onKeyDown={(e) => this.handleKeyDown(e)} onKeyUp={(e) => this.handleKeyUp(e)} >
        <div className='c'>
          {this.state.loading ? <div className='centered'><h2 className='Loading'>loading...</h2></div> : error ? (<div className='centered'><h1>Uh Oh...</h1><p>Something went wrong go back and try again.</p><Button link='/' width='15em' backgroundColor='#31b954' borderColor='#31b954'>Go Back</Button></div>) : basic ?
            (
              <div>
                <h1>Spotify Premium</h1>
                <hr />
                <p>Before you start, I noticed you don't have a Spotify Premium account.</p>
                <p><u>That's ok,</u> but you may not have access to all the features this app offers.</p>
                <p><small>Also, Spotify Premium is great and worth the money.</small></p>
                <Button onClick={() => this.toggleSynth()} width='15em' backgroundColor='#31b954' borderColor='#31b954'>Get Started</Button>
                <br /><br />
                <Button link='https://www.spotify.com/us/premium/' width='12em' backgroundColor='#27be4a' borderColor='#3bd75f'>Upgrade Account</Button>
                <br /><br />
                <p><small>This is not an ad or paid sponsorship, I just really like Spotify.</small></p>
              </div>
            ) : (
              <div>
                <h1>Color Preferences</h1>
                <hr />
                <p>Match every key with a color, and the effect that the major/minor mode has on that key/color.</p>
                <p>Or continue with the defaults.</p><p>(You can always change this later.)</p>
                <div>
                  <Synth ref={this.synth} toggleColorSettings={this.toggleColorSettings} />

                  {this.state.displayColorSettings ? <div style={{width:'70%', margin: '0 auto'}}><ColorSettings preview={this.getPreview} pianoKey={this.key} playScale={this.synth.current.playScale} playChord={this.synth.current.playChord} toggleControls={this.toggleControls} /></div> : <p>Press the keys to hear the note (Or just play the piano with your keyboard! :)</p>}
                </div>
                <Button link='/dashboard' style={{marginTop:'10em'}} width='15em' backgroundColor='#31b954' borderColor='#31b954'>Continue</Button>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Auth);