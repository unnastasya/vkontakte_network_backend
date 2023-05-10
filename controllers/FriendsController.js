const UserModel = require("../models/User.js");

const getFriends = async (req, res) => {
	try {
		const userId = req.params.id;
		console.log(userId);
		const user = await UserModel.findById(userId);
		const friends = user.friends;
		res.status(200).json(friends);
	} catch {
		res.status(500).json({
			message: "Нет доступа",
		});
	}
};

const addNewFriend = async (req, res) => {
	const activeUserId = req.params.id;
	const activeUser = await UserModel.findById(req.params.id);
	const { friends } = activeUser._doc;
	const friend = await UserModel.findById(req.body.id);
	const { avatarUrl, fullName } = friend._doc;

	UserModel.updateOne(
		{ _id: activeUserId },
		{ $push: { friends: req.body.id } }
	).then(() => {
		const { avatarUrl, fullName } = activeUser._doc;
		UserModel.updateOne(
			{ _id: req.body.id },
			{ $push: { friends: activeUserId } }
		)
			.then(() =>
				res.status(200).json({
					success: true,
				})
			)
			.catch(() =>
				res.status(500).json({
					message: "Не удалось обновить статью",
				})
			);
	});
};

const deleteFriend = async (req, res) => {
	const activeUserId = req.headers.authorization;
	const activeUser = await UserModel.findById(req.headers.authorization);

	const friend = await UserModel.findById(req.params.id);

	const { avatarUrl, fullName } = friend._doc;

	UserModel.updateOne(
		{ _id: activeUserId },
		{ $pull: { friends: req.params.id } }
	).then(() => {
		const { avatarUrl, fullName } = activeUser._doc;
		UserModel.updateOne(
			{ _id: req.params.id },
			{ $pull: { friends: activeUserId } }
		)
			.then(() =>
				res.status(200).json({
					success: true,
				})
			)
			.catch(() =>
				res.status(500).json({
					message: "Не удалось обновить статью",
				})
			);
	});
};

module.exports = {
	addNewFriend,
	deleteFriend,
	getFriends,
};
