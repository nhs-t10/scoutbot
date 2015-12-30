var routes = require("./routes");
var db = require("./db");

var next = (prev, api) => {
	return new Promise((resolve) => {
		api.listen((err, msg) => {
			if (msg.senderID == prev.senderID) {
				start(api);
				resolve(msg);
			}
			else route(msg, api);
		});
	});
};

var route = (msg, api) => {
	routes.forEach((item) => {
		if (msg.body.match(item.matches)) item.processMsg(msg, api, db, next);
	});
};

var start = (api) => {
	api.listen((err, msg) => {
		route(msg, api);
	});
};

module.exports = {
	route: route,
	start: start
};
