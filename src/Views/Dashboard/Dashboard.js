import React from 'react';
import './Dashboard.css';
import { Container, Row, Col, Button, Nav, Tab } from 'react-bootstrap';
import { Route, withRouter, NavLink } from 'react-router-dom';
import plus from '../../Assets/plus.png';
import { pSBC, invertColor } from '../../util/util.js';
import SettingsPage from '../Settings/Settings';
import MiniCard from '../../Components/MiniCard/MiniCard';
import { Sidenav, SidenavList, SidenavListItem } from '../../Components/Sidenav/Sidenav';
import { Dashnav, DashnavItem } from '../../Components/Dashnav/Dashnav';
import Modal from '../../Components/Modal/Modal';
import PlayerControls from '../../Components/PlayerControls/PlayerControls';
import API from '../../Services/SpotifyAPI';
import PlayerFunctions from '../../util/SpotifyPlayerFunctions';
const SpotifyAPI = new API();
const SpotifyPlayer = new PlayerFunctions();

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smshow: false,
      playlistFeatures: [],
      trackFeatures: null,
      currentlyPlayingTrack: null,
      currentlyPlayingPlaylist: null,
    }
    this.setSmShow = this.setSmShow.bind(this);
    this.goToCreate = this.goToCreate.bind(this);
  }
  goToCreate() {
    this.props.history.push('/dashboard/create')
  }
  setSmShow(show) {
    this.setState(() => {
      return {
        smshow: show,
      }
    });
  }
  componentDidMount() {
    this.getCurrentPlaybackInfo();
  }
  componentDidUpdate(prevProps) {
    if(prevProps.currentlyPlayingTrack !== this.props.currentlyPlayingTrack) {
      this.setState({ currentlyPlayingTrack: this.props.currentlyPlayingTrack });
    }
  }
  async getCurrentPlaybackInfo(){
    const res = await SpotifyAPI.getCurrentPlayback({ access_token: localStorage.access_token });
    if (res.data.playback.context && res.data.playback.device) {
      if (res.data.playback.context.uri.includes('playlist') && res.data.playback.device.is_playing) {
        this.setCurrentlyPlayingPlaylist(res.data.playback.context.uri);
      } else if (res.data.playback.context.uri.includes('album') && res.data.playback.device.is_playing) {
        
      } else if (res.data.playback.context.uri.includes('track') && res.data.playback.device.is_playing) {
        this.setCurrentlyPlayingTrack(res.data.playback.context.uri);
      }
    }
  }
  getPlaylistFeatures(playlist) {
    let pl = this.state.playlistFeatures.find(pl => {
      return pl.playlist_id === playlist.id;
    })
    if (!pl) {
      this._getPlaylistFeatures(playlist);
    }
  }
  async _getPlaylistFeatures(playlist) {
    if (!playlist) {
      try {
        for (let i = 0; i < this.props.playlists.length; i++) {
          let id = this.props.playlists[i].id, access_token = localStorage.access_token, tracks = [];
          let results = await SpotifyAPI.getPlaylistTracks({ id, access_token });
          for (let i = 0; i < results.data.tracks.length; i++) {
            tracks.push(results.data.tracks[i].track);
          }
          let trks = [], feats = { playlist_id: id, features: [] };
          for (let i = 0; i < tracks.length; i++) {
            trks.push(tracks[i].id);
          }
          const res = await SpotifyAPI.getTrackFeatures({ access_token: localStorage.access_token, track: trks });
          if (res.data.features) {
            // compare the key and the mode of each track with params
            for (let j = 0; j < res.data.features.length; j++) {
              feats.features.push(res.data.features[j]);
            }
            let curr = this.state.playlistFeatures ? this.state.playlistFeatures : [];

            curr.push(feats);

            this.setState({ playlistFeatures: curr });
          }
        }

      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        let id = playlist.id, access_token = localStorage.access_token, tracks = [];
        let results = await SpotifyAPI.getPlaylistTracks({ id, access_token });
        for (let i = 0; i < results.data.tracks.length; i++) {
          tracks.push(results.data.tracks[i].track);
        }
        let trks = [], feats = { playlist_id: id, features: [] };
        for (let i = 0; i < tracks.length; i++) {
          trks.push(tracks[i].id);
        }
        const res = await SpotifyAPI.getTrackFeatures({ access_token: localStorage.access_token, track: trks });
        if (res.data.features) {
          // compare the key and the mode of each track with params
          for (let j = 0; j < res.data.features.length; j++) {
            feats.features.push(res.data.features[j]);
          }
          let curr = this.state.playlistFeatures ? this.state.playlistFeatures : [];

          curr.push(feats);

          this.setState({ playlistFeatures: curr });
        }

      } catch (err) {
        console.log(err);
      }
    }
  }
  async getTrackFeatures() {
    if (!this.state.trackFeatures)
      await this._getTrackFeatures(this.props.tracks);
  }
  async _getTrackFeatures(tracks) {

    let amt, trks, feats = [];
    for (let i = 0; i < tracks.length; i++) {
      amt = 0;
      trks = [];
      while (amt < 100 && i < tracks.length) {
        trks.push(tracks[i].id);
        if (amt < 99) {
          i++;
        }
        amt++;
      }
      try {
        const res = await SpotifyAPI.getTrackFeatures({ access_token: localStorage.access_token, track: trks });
        // compare the key and the mode of each track with params
        for (let j = 0; j < res.data.features.length; j++) {
          feats.push(res.data.features[j]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({ trackFeatures: feats });
  }
  setCurrentlyPlayingPlaylist(uri) {
    this.setState({ currentlyPlayingPlaylist: uri });
  }
  setCurrentlyPlayingTrack(uri) {
    this.setState({ currentlyPlayingTrack: uri });
  }
  render() {
    let smShow = this.state.smshow;
    let playlistsView;
    let playlists = null;
    if (this.props.playlists) {
      playlists = this.props.playlists.map((playlist) =>
        <div key={playlist.id} onMouseEnter={()=> this.getPlaylistFeatures(playlist)}>
          <MiniCard type='playlist' currentlyPlaying={playlist.uri === this.state.currentlyPlayingPlaylist} image={playlist.images[0].url} infoHeader={playlist.name} infoSubHeader={playlist.owner.display_name} uri={playlist.uri} setCurrentlyPlayingPlaylist={this.setCurrentlyPlayingPlaylist.bind(this)} setCurrentlyPlayingTrack={this.setCurrentlyPlayingTrack.bind(this)} features={this.state.playlistFeatures ? this.state.playlistFeatures.find(pl => {
            return pl.playlist_id === playlist.id;
          }) : null}/>
        </div>
      );
      playlistsView = (<div className='flexRowContainer'><MiniCard image={plus} invertImage={true} onclick={() => this.setSmShow(true)} />{playlists}</div>);
    }

    return (
      <div>
        <Dashnav>
          <DashnavItem>
            <NavLink exact={true} activeClassName='is-active' to='/dashboard'>Library</NavLink>
          </DashnavItem>
        </Dashnav>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item style={{ margin: '0 1rem 1rem 1rem' }}>
                  <Nav.Link eventKey="first">Playlists</Nav.Link>
                </Nav.Item>
                <Nav.Item style={{ margin: '1rem 1rem' }}>
                  <Nav.Link eventKey="second">Albums</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => this.getTrackFeatures()} style={{ margin: '1rem 1rem' }}>
                  <Nav.Link eventKey="third">Songs</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content style={{ margin: '0 auto', textAlign: 'center' }}>
                <Tab.Pane eventKey="first">
                  <div className='flexRowContainer'>
                    {playlists ? playlistsView : <h2 className='Loading'>Loading...</h2>}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <div className='flexRowContainer'>
                    {this.props.albums ? this.props.albums.map((album) => {
                      return <MiniCard type='album' image={album.images[0] ? album.images[0].url : null} infoHeader={album.name} infoSubHeader={album.artists[0].name} key={album.id} uri={album.uri} />
                    }) : <h2 className='Loading'>Loading...</h2>}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <div className='flexRowContainer'>
                    {this.state.trackFeatures ? this.props.tracks ? this.props.tracks.map((track) => {
                      return <MiniCard type='track' image={track.album.images[0] ? track.album.images[0].url : null} infoHeader={track.name} infoSubHeader={track.artists[0].name} key={track.id} uri={track.uri} currentlyPlaying={track.uri === this.state.currentlyPlayingTrack} setCurrentlyPlayingPlaylist={this.setCurrentlyPlayingPlaylist.bind(this)} setCurrentlyPlayingTrack={this.setCurrentlyPlayingTrack.bind(this)} features={this.state.trackFeatures.find(obj => {
                        return obj.id === track.id;
                      })} />
                    }) : <h2 className='Loading'>Loading...</h2> : <h2 className='Loading'>Loading...</h2>}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <Modal show={smShow} style={{ backgroundColor: 'black !important' }} onHide={() => this.setSmShow(false)} title='Create a Playlist'>
          <p>Choose a color or a song to begin. Suggestions based on your listening habits and color settings will help fill it in.</p>
          <Button onClick={() => this.goToCreate()}>Color</Button>
          <Button>Song</Button>
        </Modal>
      </div>
    );
  }
}

class CreatePage extends React.Component {
  render() {
    return (
      <div>
        <h2>Create Page</h2>
      </div>
    );
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: null,
      albums: null,
      tracks: null,
      trackFeatures: null,
      showControls: true,
      playerReady: false,
      paused: true,
      currentTrack: null,
      trackTitle: null,
      trackArtist: null,
      albumCover: null
    }
  }
  componentDidMount(prevProps) {
    if (!localStorage.access_token) {
      this.props.history.push('/');
      return;
    }
    if (this.state.playlists === null || this.state.albums === null || this.state.tracks === null) {
      this.getPlaylists();
      this.getAlbums();
      this.getTracks();
    }

    if (!window.player) {
      let webPlayerSDK = document.createElement("script");
      webPlayerSDK.setAttribute(
        "src",
        "https://sdk.scdn.co/spotify-player.js"
      );
      document.head.appendChild(webPlayerSDK);
      window.onSpotifyWebPlaybackSDKReady = () => {
        // eslint-disable-next-line no-undef
        window.player = new window.Spotify.Player({
          name: "synesthesiafy",
          getOAuthToken: cb => {
            let token = this.getToken();
            cb(token);
          }
        });

        // Error handling
        window.player.addListener("initialization_error", ({ message }) => {
          console.error(message);
        });
        window.player.addListener("authentication_error", ({ message }) => {
          console.error(message);
        });
        window.player.addListener("account_error", ({ message }) => {
          console.error(message);
        });
        window.player.addListener("playback_error", ({ message }) => {
          console.error(message);
        });

        // Playback status updates
        window.player.addListener("player_state_changed", state => {
          if (state) {
            if (state.paused !== this.state.paused) {
              this.setState({ paused: state.paused });
              if (state.paused)
                this.setColor();
              else
                this.analyze(state.track_window.current_track.id);
            }
            if (state.track_window.current_track.uri !== this.state.currentTrack) {
              this.setCurrentlyPlayingTrack(state.track_window.current_track.uri);
              this.setState({ currentTrack: state.track_window.current_track.uri, trackArtist: state.track_window.current_track.artists[0].name, trackTitle: state.track_window.current_track.name, albumCover: state.track_window.current_track.album.images[0].url });
              if (!state.paused)
                this.analyze(state.track_window.current_track.id);
            }
          } else {
            this.setState({ paused: true });
            this.setColor();
          }
        });

        // Ready
        window.player.addListener("ready", ({ device_id }) => {
          const iframe = document.querySelector(
            'iframe[src="https://sdk.scdn.co/embedded/index.html"]'
          );

          if (iframe) {
            iframe.style.display = "block";
            iframe.style.position = "absolute";
            iframe.style.top = "-1000px";
            iframe.style.left = "-1000px";
          }

          console.log("Ready with Device ID", device_id);
          localStorage.setItem("device_id", device_id);
          this.setState({ playerReady: true });
          this.playerId = device_id;
          SpotifyPlayer.transferToPlayer();
        });

        // Not Ready
        window.player.addListener("not_ready", ({ device_id }) => {
          localStorage.removeItem("device_id");
          console.log("Device ID has gone offline", device_id);
        });

        window.player.connect().then(success => {
          if (success) {
            console.log("Webplayback SDK successfully connected to Spotify");
          }
        });
      }
    }
    if (window.player) {
      window.player.getCurrentState().then(async state => {
        if (state) {
          this.setState({ paused: state.paused, currentTrack: state.track_window.current_track.id, trackArtist: state.track_window.current_track.artists[0].name, trackTitle: state.track_window.current_track.name, albumCover: state.track_window.current_track.album.images[0].url });
          if (!state.paused)
            this.analyze(state.track_window.current_track.id);
        } else {
          SpotifyPlayer.transferToPlayer();
        }
        this.setState({ playerReady: true });
      });
    }
  }
  getToken() {
    return localStorage.access_token;
  }
  async analyze(track) {
    try {
      const res = await SpotifyAPI.getTrackFeatures({ access_token: localStorage.access_token, track });
      this.setColor(res.data.features.key);
    } catch (err) {
      console.log(err);
    }
  }
  async getPlaylists() {
    try {
      let loaded = 0, total = 0, access_token = localStorage.access_token, offset = 0, playlists = [];
      let results = await SpotifyAPI.getPlaylists({ access_token, offset });
      for (let i = 0; i < results.data.playlists.length; i++) {
        playlists.push(results.data.playlists[i]);
      }
      loaded = playlists.length;
      total = results.data.total;
      while (loaded < total) {
        offset = loaded;
        results = await SpotifyAPI.getPlaylists({ access_token, offset });
        for (let i = 0; i < results.data.playlists.length; i++) {
          playlists.push(results.data.playlists[i]);
        }
        loaded += results.data.playlists.length;
      }

      this.setState({ playlists: playlists });
    } catch (err) {
      console.log(err);
    }
  }
  async getAlbums() {
    try {
      let loaded = 0, total = 0, access_token = localStorage.access_token, offset = 0, albums = [];
      let results = await SpotifyAPI.getAlbums({ access_token, offset });
      for (let i = 0; i < results.data.albums.length; i++) {
        albums.push(results.data.albums[i].album);
      }
      loaded = albums.length;
      total = results.data.total;
      while (loaded < total) {
        offset = loaded;
        results = await SpotifyAPI.getAlbums({ access_token, offset });
        for (let i = 0; i < results.data.albums.length; i++) {
          albums.push(results.data.albums[i].album);
        }
        loaded += results.data.albums.length;
      }
      this.setState({ albums: albums });
    } catch (err) {
      console.log(err);
    }
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
      this.setState({ tracks: tracks });
    } catch (err) {
      console.log(err);
    }
  }
  async getTrackFeatures(tracks) {
    let amt, trks, feats = [];
    for (let i = 0; i < tracks.length; i++) {
      amt = 0;
      trks = [];
      while (amt < 100 && i < tracks.length) {
        trks.push(tracks[i].id);
        if (amt < 99) {
          i++;
        }
        amt++;
      }
      try {
        const res = await SpotifyAPI.getTrackFeatures({ access_token: localStorage.access_token, track: trks });
        // compare the key and the mode of each track with params
        for (let j = 0; j < res.data.features.length; j++) {
          feats.push(res.data.features[j]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    return feats;
  }
  toggleControls() {
    this.setState({ showControls: !this.state.showControls });
  }
  setColor(key) {
    let color = '#343a3f', lighterColor = '#495057';
    if (key >= 0) {
      key = this.convertNumToKey(key);
      let colorSettings = localStorage.getItem('colorSettings');
      colorSettings = colorSettings ? JSON.parse(colorSettings) : false;
      let colorExists = colorSettings[`${key}`] ? true : false;
      if (colorExists) {
        color = colorSettings[`${key}`]['color'];
        lighterColor = pSBC(0.4, color, false, true);
      }
    }
    let textColor = invertColor(lighterColor, true);
    let root = document.documentElement;
    root.style.setProperty('--text-color', textColor);
    root.style.setProperty('--track-color', color);
    root.style.setProperty('--comp-color', lighterColor);
    //this.setState({ color: color });
    return color;
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
  setCurrentlyPlayingTrack(uri) {
    this.setState({currentlyTrack: uri});
  }
  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        {this.state.playlists && this.state.albums && this.state.tracks && this.state.playerReady ? <div className={this.state.showControls ? "grid-container-controls" : "grid-container-nocontrols"}>
          <aside className='side'>
            <Sidenav title='synesthesiafy'>
              <SidenavList>
                <SidenavListItem to='/dashboard'>Home</SidenavListItem>
                <SidenavListItem to='/dashboard/settings'>Settings</SidenavListItem>
                <SidenavListItem to='/about'>About</SidenavListItem>
              </SidenavList>
            </Sidenav>
          </aside>

          <main className="main" style={{ backgroundColor: this.lighterColor, color: this.textColor }}>
            <Container>
              <Row>
                <Col>
                  <Route exact path='/dashboard' render={() => <Main playlists={this.state.playlists} albums={this.state.albums} tracks={this.state.tracks} currentlyPlayingTrack={this.state.currentTrack} />}/>
                  <Route exact path='/dashboard/create' component={CreatePage} />
                  <Route exact path='/dashboard/settings' render={() => <SettingsPage toggleControls={this.toggleControls.bind(this)} tracks={this.state.tracks} />} />
                </Col>
              </Row>
            </Container>
          </main>
          {this.state.showControls ?
            <PlayerControls setColor={this.setColor.bind(this)} paused={this.state.paused} trackTitle={this.state.trackTitle} trackArtist={this.state.trackArtist} albumCover={this.state.albumCover}/>
                : null}
    
    
        </div> : <div style={{ height: '100vh', width: '100vw', textAlign: 'center', backgroundColor: '#FF7E30', paddingTop: '45vh', }}><h2 className='Loading' style={{ width: '15%' }}>Loading...</h2></div>}

      </div>
    )
  }
}

export default withRouter(Dashboard);