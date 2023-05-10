const MessageModel = require("../models/Message.js");

const addMessage = async (req, res) => {
	const chatsId = req.params.id;

	const newMessage = new MessageModel({
		...req.body,
		chatId: chatsId,
	});

	newMessage
		.save()
		.then((message) => res.status(200).json(message))
		.catch((error) => {
			res.status(500).json({
				error,
			});
		});
};

const getMessage = async (req, res) => {
	console.log(req.params.id);
	console.log("get message");
	MessageModel.find({ chatId: req.params.id })
		.sort({ createdAt: -1 })
		.then((chats) => res.status(200).json(chats))
		.catch((error) => res.status(500).json(error));
};

module.exports = {
	addMessage,
	getMessage,
};
