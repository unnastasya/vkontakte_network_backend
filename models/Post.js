const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		likesCount: {
			type: Number,
			default: 0,
		},
        likedUsersId: {
            type: Array,
            default: []
        },
		imageUrl: String,
		user: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
