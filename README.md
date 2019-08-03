# synesthiasfy

My first React App, running on Node.js/Express, still very much in the proof of concept/build stage.

This web app is a online Spotify web player that allows you to explore and enjoy your music through a synesthetic lens. The Spotify web API and Spotify Webplayback SDK are used in conjunction to create a colorful listening experience. Users select colors for every music key upon logging in for the first time, and the app then analyzes every song in their library to convert them to the proper color, as well as changing UI colors in response to currently playing tracks.

## TODO

- Implement color effects for various song features (Modality (major/minor), Tempo, Valence, Loudness, Energy, etc.)
- Implement Library search
- Implement Playlist, Album, and Track views
- Implement "Ambient Mode"
  - (Fullscreen Track View when user hasn't moved the mouse in a while)
- Implement Explore section
  - Implement Explore search
- Implement MongoDB user database
  - Implement Login/Logout functions
  - Implement color preferences in user schema
