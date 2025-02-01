class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistsId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await this._playlistsService.getPlaylists(playlistsId);

      const prettyJson = JSON.stringify(playlist, null, 2);

      const result = await this._mailSender.sendEmail(targetEmail, prettyJson);
      console.log('Email sent result:', result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
