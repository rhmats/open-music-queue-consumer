const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `
        SELECT id, name FROM playlists WHERE id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const playlist = result.rows;

    const songsQuery = {
      text: `
          SELECT songs.id, songs.title, songs.performer
          FROM songs
          LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
          WHERE playlist_songs.playlist_id = $1
        `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    const songs = songsResult.rows;
    const response = {
      ...playlist,
      songs,
    };
    return response;
  }
}

module.exports = PlaylistsService;
