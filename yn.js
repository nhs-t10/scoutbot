//yes or no?
module.exports = (msg) => {
	if (msg.match(/y(\w+)?/i)) return true;
	else return false;
};
