const express = require('express');
const Spotify = require('../util/SpotifyAPI');
const asyncMiddleware = require('../util/asyncMiddleWare');
const config = require("../util/config");

const Router = express.Router();
const client_id = config.client_id;
const client_secret = config.client_secret;
const redirect_url = config.redirect;
const api = new Spotify(client_id, client_secret, redirect_url);

Router.post('/authorize', asyncMiddleware(async (req, res, next) => {
  try {
    const code = req.body.code;
    const token = await api.authExchange(code);
    if (!token.error) {
      return res.status(200).send({
        token: {
          access_token: token.access_token,
          refresh_token: token.refresh_token
        }
      });
    } else {
      console.log(token.error);
      return res.status(500).send();
    }
  } catch (err) {
    console.error(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.post('/access_token/refresh', asyncMiddleware(async (req, res, next) => {
  try {
    const refresh_token = req.body.refresh_token;
    const token = await api.refreshToken(refresh_token);
    if (!token.error) {
      return res.status(200).send({
        access_token: token.access_token,
      });
    } else {
      console.log(token.error);
      return res.status(500).send();
    }
  } catch (err) {
    console.error(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/profile', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const profile = await api.getProfile(token);
    if (!profile.error) {
      return res.status(200).send({
        profile
      });
    } else {
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/playlists', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    const playlists = await api.getPlaylists(token, offset, limit);
    if (!playlists.error) {
      return res.status(200).send({
        playlists: playlists.items,
        total: playlists.total,
        offset: playlists.offset,
      })
    } else {
      console.log(playlists.error);
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/playlists/:id/tracks', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    const id = req.params.id;
    const tracks = await api.getPlaylistTracks(token, id, offset, limit);
    if (!tracks.error) {
      return res.status(200).send({
        tracks: tracks.items,
        total: tracks.total,
        offset: tracks.offset,
      })
    } else {
      console.log(tracks.error)
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/albums', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    const albums = await api.getSavedAlbums(token, offset, limit);
    if(!albums.error) {
      return res.status(200).send({
        albums: albums.items,
        total: albums.total,
        offset: albums.offset
      });
    } else {
      console.log(albums.error);
      return res.status(500).send()
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/tracks', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    const tracks = await api.getSavedTracks(token, offset, limit);
    if (!tracks.error) {
      return res.status(200).send({
        tracks: tracks.items,
        total: tracks.total,
        offset: tracks.offset
      });
    } else {
      console.log(tracks.error);
      return res.status(500).send()
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/track/features', asyncMiddleware(async (req, res, next) => {
  try {
    
    const token = req.header('Authorization');
    let track = req.query.track;
    track = track.split(",");
    const features = await api.getTrackFeatures(token, track);
    if(!features.error) {
      return res.status(200).send({
        features: features.audio_features
      }) 
    } else {
      console.log(features.error);
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/track/features/:id', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    let track = req.params.id;
    const features = await api.getTrackFeatures(token, track);
    if (!features.error) {
      return res.status(200).send({
        features: features
      })
    } else {
      console.log(features.error);
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.get('/player/current-playback', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const playback = await api.getCurrentPlayback(token);
    if (playback) {
      return res.status(200).send({playback});
    } else {
      return res.status(204).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.put('/player/transfer', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const device_id = req.body.device_id;
    const play = req.body.play ? req.body.play : false;
    const transfer = await api.transferPlayback(token, device_id, play);
    if(!transfer) {
      return res.status(204).send();
    } else {
      if(transfer.error) {
        console.log(transfer.error);
      }
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}))

Router.put('/player/play', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    let uri = req.body.uri;
    let device_id = req.query.device_id;
    const play = await api.play(token, uri, device_id);
    if (!play) {
      return res.status(204).send();
    } else {
      if(play.error) {
      console.log(play.error);
      }
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

Router.put('/player/pause', asyncMiddleware(async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    let uri = req.params.uri;
    let device_id = req.query.device_id;
    const pause = await api.pause(token, uri, device_id);
    if (!pause) {
      return res.status(204).send();
    } else {
      console.log(pause.error);
      return res.status(500).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).send();
  }
}));

module.exports = Router;