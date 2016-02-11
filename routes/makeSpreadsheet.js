var GoogleSpreadsheet = require("google-spreadsheet");
var credentials = require("../google_creds.json");

module.exports = {
	matches: /sheet|export|send/,
	processMsg(msg, api, db, next) {
		api.sendMessage("What's the link to the google spreadsheet? (Share & Export -> Get Link -> make sure I can edit it!)", msg.threadID);
		var sheet, sinfo;
		var nxo = msg;
		next(msg, api).then((nx) => {
			const key = nx.body.match(/\/spreadsheets\/d\/(.*)\/edit/)[1];
			sheet = new GoogleSpreadsheet(key);
			return useService(sheet, credentials);
		})
			.then((info) => {
				api.sendMessage(`Okay, I will upload today's match data to ${info.title}!`, nxo.threadID);
				sinfo = info;
				return db.getAllMatchesToday();
			})
			.then((matches) => {
				if (!matches.error) {
					return editSpreadsheet(matches, sheet, sinfo);
				} else api.sendMessage(matches.error, nxo.threadID);
			})
			.then(() => {
				api.sendMessage("All data has been added!", nxo.threadID);
			}).catch(() => {
				api.sendMessage(`There was an error with the spreadsheet.`, nxo.threadID);
			});
	}
};

var editSpreadsheet = (data, sheet, sinfo) => {
	return new Promise((resolve) => {
		var s1 = sinfo.worksheets[0];
		s1.getCells({
			"min-row": 1,
			"max-row": 1,
			"min-col": 1,
			"max-col": 20,
			"return-empty": true
		}, (err, cells) => {
			const cols = ["number", "team", "alliance", "beacon", "climbers", "parked", "floor", "low", "medium", "high", "hang", "allClear", "finalScore", "won"];
			Promise.all(cols.map((item, index) => addCell(item, index, cells))).then(() => {
				Promise.all(data.map((item) => addDatas(item, s1))).then(() => {
					resolve();
				});
			});
		});
	});
};

var addCell = (item, index, cells) => {
	return new Promise((resolve, reject) => {
		cells[index].setValue(item, (err) => {
			if(err) reject(err);
			else resolve();
		});
	});
};

var addDatas = (item, sheet) => {
	return new Promise((resolve) => {
		sheet.addRow(item, resolve);
	});
};

var useService = (sheet, credentials) => {
	return new Promise((resolve) => {
		sheet.useServiceAccountAuth(credentials, (err) => {
			if (!err) {
				sheet.getInfo((err, info) => {
					resolve(info);
				});
			}
		});
	});
};
