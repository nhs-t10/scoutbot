var routes = require("./routes");
var db = require("./db");

var next = (prev, api) => {
	return new Promise((resolve) => {
		api.listen((err, msg) => {
			if (msg.senderID == prev.senderID && notMe(msg)) {
				start(api);
				resolve(msg);
			}
			else route(msg, api);
		});
	});
};

var route = (msg, api) => {
	if(notMe(msg)){
		routes.forEach((item) => {
			if (msg.body.match(item.matches)) item.processMsg(msg, api, db, next);
		});
	}
};

var start = (api) => {
	api.listen((err, msg) => {
		route(msg, api);
	});
};

var notMe = (msg) => {
	return (msg.senderID != msg.pageID);
};

module.exports = {
	route: route,
	start: start
};
