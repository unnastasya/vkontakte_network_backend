const ChatModel = require("../models/Chat.js");

const addChat = async (req, res) => {
	console.log("add chat");

	const newChat = new ChatModel({
		members: [req.body.senderId, req.body.receiverTd],
	});

	newChat
		.save()
		.then((chat) => res.status(200).json(chat._id))
		.catch((error) => {
			res.status(500).json({
				error,
			});
		});
};

const getChat = async (req, res) => {
	console.log(req.params.id);
	ChatModel.find({ members: { $in: [req.params.id] } })
		.then((chats) => res.status(200).json(chats))
		.catch((error) => res.status(500).json(error));
};

module.exports = {
	addChat,
	getChat,
};
