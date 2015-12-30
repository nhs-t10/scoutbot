module.exports = {
	matches: /(add|set) (.*)team/i,
	processMsg: (msg, api, db, next) => {
		var doc = {name: "", number: 0};
		api.sendMessage(`What's the team's number?`, msg.threadID);
		next(msg, api).then((nx) => {
			api.sendMessage(`What's team ${nx.body}'s name?`, nx.threadID);
			doc.number = nx.body;
			return next(nx, api);
		})
		.then((nx) => {
			doc.name = nx.body;
			return db.addTeam(doc, nx);
		})
		.then((nx) => {
			api.sendMessage(`I've added team ${doc.number} as ${doc.name}.`, nx.threadID);
		});
	}
};
