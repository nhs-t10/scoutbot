var login = require("facebook-chat-api");
var router = require("./router");

var init = () => {
	login({
		email: process.env.SCOUT_EMAIL,
		password: process.env.SCOUT_PASSWORD
	}, {pageID: process.env.SCOUT_ID}, (err, api) => {
		if (err) return console.error(err);
		router.start(api);
	});
};

init();
