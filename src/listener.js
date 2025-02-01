class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId: getUserPlaylists, playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await this._playlistsService.getPlaylistById(playlistId, getUserPlaylists);
      const songs = await this._playlistsService.getPlaylistSongs(playlistId);
      playlist.songs = songs;
      const response = {
        playlist
      };

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(response));

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
