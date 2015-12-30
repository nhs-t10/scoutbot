module.exports =	{
	matches: /(^| )hi|hey|hello|scoutbot/i,
	processMsg: (msg, api) => {
		api.sendMessage(`Hello, ${msg.senderName}! What can I do for you?`, msg.threadID);
	}
};
