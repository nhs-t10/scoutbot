var GoogleSpreadsheet = require("google-spreadsheet");
var credentials = require("../google_creds.json");

module.exports = {
	matches: /sheet|export|send/,
	processMsg (msg, api, db, next) {
		api.sendMessage("What's the link to the google spreadsheet? (Share & Export -> Get Link -> make sure I can edit it!)", msg.threadID);
		var sheet;
		var nxo = msg;
		next(msg, api).then((nx) => {
			var key = nx.body.match(/\/spreadsheets\/d\/(.*)\/edit/)[1];
			sheet = new GoogleSpreadsheet(key);
			sheet.useServiceAccountAuth(credentials, (err) => {
				if(!err) {
					sheet.getInfo((err, info) => {
						api.sendMessage(`Okay, I will upload today's match data to ${info.title}!`, nx.threadID);
						return db.getAllMatchesToday();
					});
				}
				else api.sendMessage(`There was an error with the spreadsheet.`, nx.threadID);
			});
		})
		.then((matches) => {
			if(!matches.error) {

			}
			else api.sendMessage(matches.error, nxo.threadID);
		});
	}
};
