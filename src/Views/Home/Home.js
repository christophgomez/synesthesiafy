import React from 'react';
import './Home.css'
import Button from '../../Components/Button/Button';
import Footer from '../../Components/Footer/Footer';
import { withRouter } from 'react-router-dom';
import NavBar from '../../Components/Navbar/Navbar';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client_id: 'febd55d4c92f40abb96828b42c312c97',
      scopes: 'playlist-read-private playlist-read-collaborative user-read-private user-read-birthdate user-read-email user-read-playback-state user-read-currently-playing user-modify-playback-state app-remote-control streaming user-top-read user-read-recently-played user-library-read',
      redirect: 'http://localhost:3000/success',
    };
    this.handleClick = this.handleClick.bind(this);
    if (localStorage.access_token) {
      this.props.history.push('/dashboard');
    }
  }
  handleClick() {
    window.location = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      this.state.client_id +
      (this.state.scopes ? '&scope=' + encodeURIComponent(this.state.scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(this.state.redirect) +
      '&show_dialog=true';
  }
  render() {
    return (
      <div>
        <NavBar/>
        <div className='Home'>
          <div className='Title'>
            <p>Organize / Listen / Discover</p>
            <h1 className='RainbowText'>Synesthesiafy</h1>
            <p>Experience Spotify Through Color</p>
            <Button width='15em' backgroundColor='#31b954' borderColor='#31b954' function={this.handleClick}>Get Started</Button>
            <br/>
            <Button link='/about' width='12em'>Learn More</Button>
          </div>
        </div>
        <Footer text='MIT Licensed | Copyright © 2018-present Christopher Gomez' />
      </div>
    );
  }
}

export default withRouter(Home);