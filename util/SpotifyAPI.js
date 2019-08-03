const rp = require('request-promise-native');

async function makeRequest(options) {
  try {
    const body = await rp(options);
    return body;
  } catch (err) {
    return err;
  }
}

class SpotifyAPI {

  constructor(client_id, client_secret, redirect_uri, scopes = null) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
    this.scopes = scopes;
  }

  generateAuthRedirectURI() {
    return 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      this.client_id +
      (this.scopes ? '&scope=' + encodeURIComponent(this.scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(this.redirect_uri) +
      '&show_dialog=true';
  }

  authExchange(code) {
    var authOptions = {
      method: 'POST',
      uri: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: this.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(this.client_id + ':' + this.client_secret).toString('base64'))
      },
      json: true
    };
    return makeRequest(authOptions);
  }

  refreshToken(refresh_token) {
    var authOptions = {
      method: 'POST',
      uri: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(this.client_id + ':' + this.client_secret).toString('base64'))
      },
      json: true
    };
    return makeRequest(authOptions);
  }

  getPlaylists(token, offset = 0, limit = 50) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/me/playlists?offset=' + offset + "&limit=" + limit,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getPlaylistTracks(token, id, offset = 0, limit = 100) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/playlists/' + id + '/tracks?offset=' + offset + "&limit=" + limit,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getSavedAlbums(token, offset = 0, limit = 50) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/me/albums?offset=' + offset + '&limit=' + limit,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getSavedTracks(token, offset = 0, limit = 50) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=' + limit,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getProfile(token) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };

    return makeRequest(options);
  }

  getTrackInfo(token, id) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/tracks/' + id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };

    return makeRequest(options);
  }

  analyze(token, id) {
    var options = {
      method: 'GET',
      uri: 'https://api.spotify.com/v1/audio-analysis/' + id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };

    return makeRequest(options);
  }

  getTrackFeatures(token, id) {
    let uri = '';
    if (id.constructor === Array) {
      for (let i = 0; i < id.length - 1; i++) {
        uri += id[i];
        uri += ",";
      }
      uri += id[id.length - 1];
      uri = 'https://api.spotify.com/v1/audio-features/?ids=' + encodeURIComponent(uri);
    } else {
      uri = 'https://api.spotify.com/v1/audio-features/' + id;
    }
    var options = {
      method: 'GET',
      uri: uri,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getCurrentPlayback(token) {
    var options = {
      method: 'GET',
      uri: "https://api.spotify.com/v1/me/player",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getCurrentlyPlayingTrack(token) {
    var options = {
      method: 'GET',
      uri: "https://api.spotify.com/v1/me/player/currently-playing",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getRecentlyPlayed(token) {
    var options = {
      method: 'GET',
      uri: "https://api.spotify.com/v1/me/player/recently-played",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  getTopArtists(token) {
    var options = {
      method: 'GET',
      uri: "https://api.spotify.com/v1/me/top/artists",
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      json: true
    };
    return makeRequest(options);
  }

  getDevices(token) {
    var options;
    options = {
      method: 'GET',
      uri: "https://api.spotify.com/v1/me/player/devices",
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      json: true
    }
    return makeRequest(options);
  }

  transferPlayback(token, id, play = true) {
    var options = {
      method: 'PUT',
      uri: "https://api.spotify.com/v1/me/player",
      body: {
        'device_ids': [
          id
        ],
        'play': play
      },
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    return makeRequest(options);
  }

  play(token, uri, device_id) {
    let options;
    if (uri) {
      if (uri.constructor !== Array && (uri.includes('playlist') || uri.includes('album'))) {
        options = {
          method: `PUT`,
          uri: `https://api.spotify.com/v1/me/player/play${device_id ? '?device_id=' + device_id : ''}`,
          headers: {
            'Authorization': 'Bearer ' + token,
          },
          body: {
            'context_uri': uri,
          },
          json: true
        }
      } else {
        if (uri.constructor !== Array) {
          options = {
            method: `PUT`,
            uri: `https://api.spotify.com/v1/me/player/play${device_id ? '?device_id=' + device_id : ''}`,
            headers: {
              'Authorization': 'Bearer ' + token,
            },
            body: {
              'uris': [uri],
            },
            json: true
          }
        } else {
          let uris = [];
          for (let i = 0; i < uri.length; i++)
            uris.push(uri[i]);
          options = {
            method: `PUT`,
            uri: `https://api.spotify.com/v1/me/player/play${device_id ? '?device_id=' + device_id : ''}`,
            headers: {
              'Authorization': 'Bearer ' + token,
            },
            body: {
              'uris': uris,
            },
            json: true
          }
        }
      }
    }
    else
      options = {
        method: 'PUT',
        uri: `https://api.spotify.com/v1/me/player/play${device_id ? '?device_id=' + device_id : ''}`,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
    return makeRequest(options);
  }

  pause(token, device_id) {
    var options = {
      method: `PUT`,
      uri: `https://api.spotify.com/v1/me/player/pause${device_id ? '?device_id=' + device_id : ''}`,
      headers: {
        "Authorization": 'Bearer ' + token,
      },
      json: true
    };
    return makeRequest(options);
  }

  async next(token, device_id) {
    var options = {
      method: `POST`,
      uri: `https://api.spotify.com/v1/me/player/next${device_id ? '?device_id=' + device_id : ''}`,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      json: true
    };
    try {
      await rp(options);
      return { successful: true };
    } catch (error) {
      Promise.reject(error);
      return { successful: true };
    }
  }

  async prev(token, device_id) {
    var options = {
      method: `POST`,
      uri: `https://api.spotify.com/v1/me/player/previous${device_id ? '?device_id=' + device_id : ''}`,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      json: true
    };
    try {
      await rp(options);
      return { successful: true, };
    } catch (error) {
      Promise.reject(error);
      return { successful: true, };
    }
  }

  seek(token, ms, device_id) {
    const options = {
      method: 'PUT',
      uri: `https://api.spotify.com/v1/me/player/seek?position_ms=${ms}${device_id ? '?device_id=' + device_id : ''}`,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      json: true
    }
    return makeRequest(options);
  }

  async shuffle(token, shuffle, device_id) {
    var options = {
      method: `PUT`,
      uri: `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}${device_id ? '?device_id=' + device_id : ''}`,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      json: true
    };
    try {
      await rp(options);
      return { successful: true };
    } catch (error) {
      Promise.reject(error);
      return { successful: false };
    }
  }

  async repeat(token, track, device_id) {
    var options = {
      method: `PUT`,
      uri: `https://api.spotify.com/v1/me/player/repeat?state=${track}${device_id ? ' ? device_id = ' + device_id : ''}`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    try {
      await rp(options);
      return { successful: true, };
    } catch (error) {
      Promise.reject(error);
      return { successful: false };
    }
  }

  async setVolume(token, percent, device_id) {
    var options = {
      method: `PUT`,
      uri: `https://api.spotify.com/v1/me/player/volume?volume_percent=${percent}${device_id ? '?device_id='+device_id : ''}`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    try {
      await rp(options);
      return { successful: true };
    } catch (error) {
      Promise.reject(error);
      return { successful: false };
    }
  }
}

module.exports = SpotifyAPI;