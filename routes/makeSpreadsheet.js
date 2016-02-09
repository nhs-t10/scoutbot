var GoogleSpreadsheet = require("google-spreadsheet");
var credentials = require("../google_creds.json");

module.exports = {
	matches: /sheet|export|send/,
	processMsg (msg, api, db, next) {
		api.sendMessage("What's the link to the google spreadsheet? (Share & Export -> Get Link -> make sure I can edit it!)", msg.threadID);
		var sheet, sinfo;
		var nxo = msg;
		next(msg, api).then((nx) => {
			var key = nx.body.match(/\/spreadsheets\/d\/(.*)\/edit/)[1];
			sheet = new GoogleSpreadsheet(key);
			sheet.useServiceAccountAuth(credentials, (err) => {
				if(!err) {
					sheet.getInfo((err, info) => {
						api.sendMessage(`Okay, I will upload today's match data to ${info.title}!`, nx.threadID);
						sinfo = info;
						return db.getAllMatchesToday();
					});
				}
				else api.sendMessage(`There was an error with the spreadsheet.`, nx.threadID);
			});
		})
		.then((matches) => {
			console.log(matches, "wolololol");
			if(!matches.error) {
				console.log(matches);
				return editSpreadsheet(matches, sheet, sinfo);
			}
			else api.sendMessage(matches.error, nxo.threadID);
		})
		.then(() => {
			api.sendMessage("All data has been added!", nxo.threadID);
		});
	}
};

var editSpreadsheet = (data, sheet, sinfo) => {
	return new Promise((resolve) => {
		console.log("ok");
		var s1 = sinfo.worksheets[0];
		s1.getRows((err, rows) => {
			console.log(rows);
			resolve();
		});
	});
};
