module.exports = [
	require("./routes/greeting"),
	require("./routes/addMeet"),
	require("./routes/addTeamDetail"),
	require("./routes/addMatch"),
	{
		matches: /today/i,
		processMsg: (msg, api, db) => {
			db.getMeetToday().then((result) => {
				api.sendMessage(`Today's meet is ${result.name}. If this is incorrect, tell me to change the meet!`, msg.threadID);
			});
		}
	},
	{
		matches: /you|help/i,
		processMsg: (msg, api) => {
			api.sendMessage(`I'm your personal assistant for all things related to scouting! For more info, visit`, msg.threadID);
		}
	}
];
