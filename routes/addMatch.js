var changeMatch = require("./changeMatch");
var yn = require("../yn");

module.exports = {
	matches: /match/,
	processMsg: (msg, api, db, next) => {
		var nxo = msg,
			match = {debris: {}};
		db.getMeetToday().then((result) => {
			api.sendMessage(`Is the current match still ${result.match}?`, msg.threadID);
			match.meetid = result._id;
			match.number = result.match;
			return next(msg, api);
		})
		.then((nx) => {
			var y = yn(nx.body);
			if (y) {
				api.sendMessage(`Sounds good! What's the team # that you're scouting?`, nx.threadID);
				return next(nx, api);
			} else changeMatch.processMsg(nx, api, db, next);
		})
		.then((nx) => {
			return db.getTeam({
				number: parseInt(nx.body)
			});
		})
		.then((item) => {
			api.sendMessage(`I'm now tracking team ${item.number} (${item.name}). What alliance are they on? (red/blue)`, nxo.threadID);
			match.team = item.number;
			return next(nxo, api);
		})
		.then((nx) => {
			match.alliance = nx.body;
			api.sendMessage(`Let's talk about autonomous! Was ${match.number}'s robot able to reach the beacon?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.beacon = yn(nx.body);
			api.sendMessage(`Were the climbers able to be dumped into the bucket?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.climbers = yn(nx.body);
			api.sendMessage(`Where did the robot park after autonomous ended? (Floor, Parking Zone, Touching Mountain, Low Mountain, Mid Mountain, High Mountain)?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.parked = nx.body;
			api.sendMessage(`Nice! Now let's move onto Teleop. How much debris was scored in the FLOOR GOAL?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.debris.floor = parseInt(nx.body);
			api.sendMessage(`Ok. What about in the LOW zone?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.debris.low = parseInt(nx.body);
			api.sendMessage(`The MEDIUM zone?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.debris.medium = parseInt(nx.body);
			api.sendMessage(`The HIGH zone?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.debris.high = parseInt(nx.body);
			api.sendMessage(`Cool! Now to the endgame! Was the robot able to hang?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.hang = yn(nx.body);
			api.sendMessage(`Okay! And if so, did it activate the all clear?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.allClear = yn(nx.body);
			api.sendMessage(`What was their final score?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.finalScore = parseInt(nx.body);
			api.sendMessage(`And finally, did their alliance win?`, nx.threadID);
			return next(nx, api);
		})
		.then((nx) => {
			match.won = yn(nx.body);
			api.sendMessage(`We're all finished! Thanks for scouting match ${match.number}!`, nx.threadID);
			return db.addMatch(match);
		})
		.then(() => {
			api.sendMessage(`Match saved to database.`, nxo.threadID);
		}).catch((reason) => {
			console.error(reason);
		});
	}
};
