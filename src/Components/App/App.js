import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: 'playlistName', 
      playlistTracks: []
    };
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
   let tracks = this.state.playlistTracks;

   if (tracks.find(savedTrack => savedTrack.id === track.id)) { //returns the first item that matches the condition. So if the id is already there, we return doing nothing.
      return;
   } 

   tracks.push(track);  //if the id is not in the playlistTracks array, then we add it
   this.setState({ playlistTracks: tracks }); //we change the state of the component
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;

    tracks = tracks.filter(removingTrack => removingTrack.id !== track.id) //we return a new array with every track except the one with the id we are trying to remove
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({ 
        playlistName: 'New Playlist', 
        playlistTracks: [] })
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} /> 

            <Playlist playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} 
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }    
}

export default App;
