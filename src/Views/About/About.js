import React from 'react';
import './About.css';
import Button from '../../Components/Button/Button';
import NavBar from '../../Components/Navbar/Navbar';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client_id: 'febd55d4c92f40abb96828b42c312c97',
      scopes: 'playlist-read-private playlist-read-collaborative user-read-private user-read-birthdate user-read-email user-read-playback-state user-read-currently-playing user-modify-playback-state app-remote-control streaming user-top-read user-read-recently-played user-library-read',
      redirect: 'http://localhost:3000/success',
    };
    this.handleClick = this.handleClick.bind(this);
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
        <NavBar />
        <div id='about' className='About'>
          <div className='Content'>
            <h2>What is Synesthesia?</h2>
            <hr />
            <div className='Explanation'>
              <p>
                <u>Synesthesia</u> is a perceptual phenomenon in which stimulation of one sensory or cognitive pathway leads to automatic, involuntary experiences in a second sensory or cognitive pathway. People who report a lifelong history of such experiences are known as synesthetes.</p><p>There are two overall forms of synesthesia:
            </p>
              <ul>
                <li><u>projective synesthesia:</u> people who see actual colors, forms, or shapes when stimulated.<br />(the widely understood version of synesthesia)</li>
                <li><u>associative synesthesia:</u> people who feel a very strong and involuntary connection between the stimulus and the sense that it triggers.</li>
              </ul>
              <p>
                For example, in chromesthesia (sound to color), a projector may hear a trumpet, and see an orange triangle in space, while an associator might hear a trumpet, and think very strongly that it sounds "orange".
            </p>

            </div>
            <Button link='https://en.wikipedia.org/wiki/Synesthesia'>Learn More</Button>
            <br />
            <h2>What is Synesthesiafy?</h2>
            <hr />
            <div className='Explanation'>
              <p>
                Synesthesiafy is an exploration of synesthesia, and more specifically chromesthesia, through Spotify. This web app serves as a tool for synesthetes to organize their music based on the colors they associate or see with their music, and for the general population to explore their library through a synesthetic lens.
            </p>
              <p>
                As an associative synesthete, this app evolved from a small tool I created to organize my Spotify playlists with songs based on the colors I associate them with. Seeing my playlists and songs organized by color, and listening to my library with the correct color lighting up my screen provides a satisfaction that is hard to describe. So instead, I've published this app for all to use and hopefully receive that same satisfaction.
            </p>

            </div>
            <Button width='18em' backgroundColor='#31b954' borderColor='#31b954' function={this.handleClick}>Get Started</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default About;