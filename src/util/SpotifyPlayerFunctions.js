import api from '../Services/SpotifyAPI';
const SpotifyAPI = new api();

export default class SpotifyPlayer {
  prev() {
    if (window.player) {
      window.player.getCurrentState().then(async state => {
        if (!state) {
          await this.transferToPlayer();
        }
        window.player.previousTrack();
      })
    }
  }
  next() {
    if (window.player) {
      window.player.getCurrentState().then(async state => {
        if (!state) {
          await this.transferToPlayer();
        }
        window.player.nextTrack();
      })
    }
  }
  togglePlay() {
    if (window.player) {
      window.player.getCurrentState().then(async state => {
        if (!state) {
          await this.transferToPlayer();
        }
        window.player.togglePlay();
      })
    }
  }
  async transferToPlayer() {
    try {
      await SpotifyAPI.transferPlayback({ access_token: localStorage.access_token, device_id: localStorage.device_id });
    } catch (err) {
      console.log(err);
    }
  }
  pause() {
    if (window.player) {
      window.player.getCurrentState().then(async state => {
        if (!state) {
          await this.transferToPlayer();
        }
        window.player.pause();
      })
    }
  }
  play(uri) {
    if (window.player) {
      window.player.getCurrentState().then(async state => {
        if (!state) {
          await this.transferToPlayer();
        }
        if (!uri) {
          window.player.resume();
        } else {
          const curr = await SpotifyAPI.getCurrentPlayback({ access_token: localStorage.access_token });
          if (curr.data.playback.context) {
            if (curr.data.playback.context.uri === uri) {
              window.player.resume();
            } else {
              await SpotifyAPI.play({ access_token: localStorage.access_token, uri: uri });
            }
          }
          else
            await SpotifyAPI.play({ access_token: localStorage.access_token, uri: uri });
        }
      })
    }
  }
}