const autoBind = require("auto-bind");
class Listener {
  constructor(notesServices, mailSender) {
    this._notesServices = notesServices;
    this._mailSender = mailSender;
    autoBind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail } = JSON.parse(message.content.toString());
      const notes = await this._notesServices.getNotes(userId);
      const result = await this._mailSender.SendEmail(
        targetEmail,
        JSON.stringify(notes)
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
