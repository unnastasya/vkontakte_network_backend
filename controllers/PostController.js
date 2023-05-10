const PostModel = require("../models/Post.js");
const UserModel = require("../models/User.js");

const handleError = (res, error) => {
	res.status(500).send(error.message);
};

const createPost = async (req, res) => {
	const { text, imageUrl, user } = req.body;
	const post = new PostModel({ text, imageUrl, user });
	post.save()
		.then((post) => res.status(200).json(post))
		.catch((error) => handleError(res, error));
};

const getAllPosts = async (req, res) => {
	PostModel.find()
		.sort({ createdAt: -1 })
		.populate("user")
		.exec()
		.then((posts) => res.status(200).json(posts))
		.catch((error) => handleError(res, error));
};

const getFriendsPosts = async (req, res) => {
	const userId = req.headers.authorization;
	const user = await UserModel.findById(userId);
	const { friends } = user._doc;
	console.log("userId", userId);
	console.log("friends", friends);
	PostModel.find({ user: { $in: friends } })
		.sort({ createdAt: -1 })
		.populate("user")
		.exec()
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((error) => handleError(res, error));
};

const getOneUserPosts = async (req, res) => {
	const userId = req.params.id;
	const user = await UserModel.findById(userId);
	PostModel.find({ user: userId })
		.sort({ createdAt: -1 })
		.populate("user")
		.exec()
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((error) => handleError(res, error));
};

const likePost = async (req, res) => {
	const postId = req.params.id;
	const post = await PostModel.findById(postId);
	const { likedUsersId } = post._doc;
	if (likedUsersId.includes(req.headers.authorization)) {
		const index = likedUsersId.indexOf(req.headers.authorization);
		likedUsersId.splice(index, 1);
		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { likesCount: -1 },
				likedUsersId: [...likedUsersId],
			},
			{
				returnDocument: "after",
			}
		)
			.populate("user")
			.then((post) => res.status(200).json(post))
			.catch((error) => handleError(res, error));
	} else {
		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { likesCount: 1 },
				likedUsersId: [...likedUsersId, req.headers.authorization],
			},
			{
				returnDocument: "after",
			}
		)
			.populate("user")
			.then((post) => res.status(200).json(post))
			.catch((error) => handleError(res, error));
	}
};

const deletePost = async (req, res) => {
	// console.log(req.body.id)
	PostModel.findByIdAndDelete(req.params.id)
		.then(() => res.status(200).json({ status: "success" }))
		.catch((error) => handleError(res, error));
};

module.exports = {
	createPost,
	getAllPosts,
	getOneUserPosts,
	likePost,
	getFriendsPosts,
	deletePost,
};
