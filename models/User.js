const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarUrl: String,
		friends: {
			type: Array,
			required: [],
		},
		city: {
			type: String,
			required: true,
		},
		studyPlace: {
			type: String,
			required: true,
		},
		birthdayDate: {
			type: String,
		},
        age: {
            type: Number
        }
        
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
