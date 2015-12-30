module.exports = {
	processMsg: (msg, api, db, next) => {
		api.sendMessage(`What's the current match?`, msg.threadID);
		var nxo;
		next(msg, api)
		.then((nx) => {
			nxo = nx;
			return db.getMeetToday();
		})
		.then((item) => {
			db.setMeetMatch(item._id, parseInt(nxo.body));
		})
		.then(() => {
			api.sendMessage(`The match for today is now updated!`, msg.threadID);
		});
	}
};
