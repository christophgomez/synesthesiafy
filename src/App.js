import React from 'react';
import './App.css';
import Home from './Views/Home/Home';
import About from './Views/About/About';
import { BrowserRouter as Router, Route, withRouter, Redirect } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import Auth from './Views/Auth/Auth';
import Dashboard from './Views/Dashboard/Dashboard';
import SpotifyAPI from './Services/SpotifyAPI';

class ProtectedRoute extends React.Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route
        {...props}
        render={props => (
          localStorage.access_token ?
            <Dashboard {...props} /> :
            <Redirect to='/' />
        )}
      />
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: null
    };
    this.refreshToken = this.refreshToken.bind(this);
  }
  componentDidMount(prevProps) {
    if (this.props.location.pathname === "/") {
      if (localStorage.access_token) {
        this.init();
      }
    } else {
      if (localStorage.access_token) {
        this.init();
      }
    }
  }
  componentDidUpdate() {
    if (this.state.access_token !== null) {

    }
  }
  async init() {
    let self = this;
    await this.refreshToken();
    setInterval(() => {
      self.refreshToken();
    }, 600000);
    this.props.history.push('/dashboard');
  }
  async refreshToken() {
    try {
      const response = await new SpotifyAPI().refreshToken(localStorage.refresh_token);
      localStorage.setItem('access_token', response.data.access_token);
      this.setState({ access_token: response.data.access_token });
    } catch (err) {
      console.log(err);
    }
  }
  getToken() {
    if (this.state.access_token) {
      return this.state.access_token;
    }
  }
  render() {
    return (
      <div className="App">
        <Router>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route exact path='/' component={Home} />
            <Route path='/about' component={About} />
            <Route path='/success' component={Auth} />
            <ProtectedRoute path='/dashboard' component={Dashboard} />
          </AnimatedSwitch>
        </Router>
      </div>
    );
  }
}

export default withRouter(App);
