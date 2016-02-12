module.exports = [
	require("./routes/greeting"),
	require("./routes/addMeet"),
	require("./routes/addTeamDetail"),
	require("./routes/addMatch"),
	require("./routes/makeSpreadsheet"),
	{
		matches: /today/i,
		processMsg: (msg, api, db) => {
			db.getMeetToday().then((result) => {
				if(result.name != "unset") api.sendMessage(`Today's meet is ${result.name} as of ${result.date.toString()}. If this is incorrect, tell me to change the meet!`, msg.threadID);
				else api.sendMessage(`Today's meet isn't set yet! Tell me to set the meet!`, msg.threadID);
			});
		}
	},
	{
		matches: /you|help/i,
		processMsg: (msg, api) => {
			api.sendMessage(`I'm your personal assistant for all things related to scouting! For more info, visit https://github.com/nhs-t10/scoutbot/blob/master/readme.md`, msg.threadID);
		}
	},
	{
		matches: /thank/i,
		processMsg: (msg, api) => {
			api.sendMessage(`You're very welcome, ${msg.senderName}!`, msg.threadID);
		}
	}
];
