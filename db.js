var MongoClient = require("mongodb").MongoClient;

var meets, teams, matches;

MongoClient.connect("mongodb://localhost:27017/scoutbot", (err, db) => {
	if (err) return console.error(err);
	meets = db.collection("meets");
	teams = db.collection("teams");
	matches = db.collection("matches");
});

exports.addMeet = (document, extra) => {
	return new Promise((resolve) => {
		meets.insert(document, () => {
			resolve(extra);
		});
	});
};

exports.addTeam = (document, extra) => {
	return new Promise((resolve) => {
		teams.update({name: document.name}, document, {upsert: true}, () => {
			resolve(extra);
		});
	});
};

exports.getTeam = (document) => {
	return new Promise((resolve) => {
		teams.findOne(document, (err, item) => {
			if(!item) item = {number: document.number, name: "unset"};
			resolve(item);
		});
	});
};

exports.getMeetToday = () => {
	return new Promise((resolve) => {
		meets.find().sort({date: -1}).limit(1).each((err, item) => {
			if(!item) item = {name: "unset", match: "1"};
			resolve(item);
		});
	});
};

exports.setMeetMatch = (i, m) => {
	return new Promise((resolve) => {
		meets.update({_id: i}, {$set: {match: m}}, (err, item) => {
			resolve(item);
		});
	});
};

exports.addMatch = (document) => {
	return new Promise((resolve) => {
		matches.insert(document, () => {
			resolve();
		});
	});
};
