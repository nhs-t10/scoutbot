var login = require("facebook-chat-api");
var router = require("./router");

var init = () => {
	login({
		email: process.env.SCOUT_EMAIL,
		password: process.env.SCOUT_PASSWORD
	}, (err, api) => {
		if (err) return console.error(err);
		router.start(api);
	});
};

init();
