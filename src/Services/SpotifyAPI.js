import axios from 'axios';

let base = process.env.baseURL || 'http://localhost:3001';

const url = base+"/spotify";

const API = () => {
  return axios.create({
    baseURL: url,
  });
}

export default class Spotify {
  constructor() {
    this.API = API();
  }
  authExhange(code) {
    return this.API.post('/authorize', {code});
  }
  refreshToken(refresh_token) {
    return this.API.post('/access_token/refresh', { refresh_token });
  }
  getProfile(access_token) {
    return this.API.get('/profile', { headers: { Authorization: access_token } });
  }
  getPlaylists(params) {
    const endpoint = `/playlists${params.offset ? '?offset=' + params.offset : ''}
      ${params.limit ? params.offset ? '&' : '?limit=' + params.limit : ''}`
    return this.API.get(endpoint, { headers: { Authorization: params.access_token } });
  }
  getPlaylistTracks(params) {
    const endpoint = `/playlists/${params.id}/tracks${params.offset ? '?offset=' + params.offset : ''}
      ${params.limit ? params.offset ? '&' : '?limit=' + params.limit : ''}`
    return this.API.get(endpoint, { headers: { Authorization: params.access_token } });
  }
  getAlbums(params) {
    const endpoint = `/albums${params.offset ? '?offset=' + params.offset : ''}
    ${ params.limit ? params.offset ? '&' : '?limit=' + params.limit : '' }`
    return this.API.get(endpoint, { headers: { Authorization: params.access_token } });
  }
  getTracks(params) {
    const endpoint = `/tracks${params.offset ? '?offset=' + params.offset : ''}
    ${ params.limit ? params.offset ? '&' : '?limit=' + params.limit : ''}`
    return this.API.get(endpoint, { headers: { Authorization: params.access_token } });
  }
  getTrackFeatures(params) {
    let endpoint;
    if (params.track.constructor === Array) {
      let q = '';
      for (let i = 0; i < params.track.length - 1; i++) {
        q += params.track[i];
        q += "%2C";
      }
      q += params.track[params.track.length-1];
      endpoint = `/track/features?track=${q}`;
    } else {
      endpoint = '/track/features/' + params.track;
    }
    return this.API.get(endpoint, { headers: { Authorization: params.access_token } });
  }
  getCurrentPlayback(params) {
    return this.API.get('/player/current-playback', { headers: { Authorization: params.access_token } });
  }
  transferPlayback(params) {
    const endpoint = `/player/transfer`;
    return this.API.put(endpoint, { device_id: params.device_id, play: params.play }, { headers: { Authorization: params.access_token } });
  } 
  play(params) {
    const endpoint = `/player/play${params.device_id ? '?device_id=' + params.device_id : ''}`;
    return this.API.put(endpoint, { uri: params.uri }, {headers: { Authorization: params.access_token } });
  }
  pause(params) {
    const endpoint = `/player/pause${params.device_id ? '?device_id=' + params.device_id : ''}`;
    return this.API.put(endpoint, { headers: { Authorization: params.access_token } });
  }
}



