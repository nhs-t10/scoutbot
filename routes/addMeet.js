var yn = require("../yn");

module.exports = {
	matches: /(add|change|set) (.*)meet/i,
	processMsg: (msg, api, db, next) => {
		db.getMeetToday().then((result) => {
			api.sendMessage(`Would you like to change today's meet from ${result.name}?`, msg.threadID);
			return next(msg, api);
		}).then((nx) => {
			var y = yn(nx.body);
			if(y) {
				api.sendMessage(`Okay! What's the name of today's meet?`, nx.threadID);
				return next(nx, api);
			}
			else api.sendMessage(`No problem! Today's meet will remain as above.`, nx.threadID);
		})
		.then((nx) => {
			return db.addMeet({
				name: nx.body,
				match: 1,
				date: new Date()
			}, nx);
		}).then((nx) => {
			api.sendMessage(`Okay, I've added ${nx.body} as today's meet.`, nx.threadID);
		});
	}
};
