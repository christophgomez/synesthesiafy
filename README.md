# synesthiasfy

[Web App](https://synesthesiafy.herokuapp.com/)

synesthesiafy is an exploration of synesthesia, and more specifically chromesthesia, through spotify. This web app serves as a tool for synesthetes to organize their music based on the colors they associate or see with their music, and for the general population to explore their library through a synesthetic lens.

React web app running on Node.js/Express, still very much in the proof of concept/build stage.

## Details

This web app is a online Spotify web player that allows you to explore and enjoy your music through a synesthetic lens. The Spotify web API and Spotify Webplayback SDK are used in conjunction to create a colorful listening experience. Users select colors for every music key upon logging in for the first time; the app then analyzes every song in their library to convert them to the proper color, and changes the UI colors in response to currently playing tracks.

Read more about it [here](https://synesthesiafy.herokuapp.com/about)

### TODO

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
- Implement Display preferences/settings.
  - Random Color Mode
  - Artwork/Color toggle
  - Immediately update UI color on key/color change (easy)
- Chrome extension to analyze the frequency of every note to create a real-time, color changing UI/visualizer (may be against Web SDK user agreement, see VueVisualizer for current chrome extension/Spotify implementation)
