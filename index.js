const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || "8080";

require("dotenv").config();
const {
	UserController,
	PostController,
	FriendsController,
	ChatController,
	MessageController,
} = require("./controllers/index.js");
const cors = require("cors");
const multer = require("multer");

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("Connect DB");
	})
	.catch(() => {
		console.log("Error DB");
	});

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

const app = express();

app.use(express.json());
app.use(cors());
// app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
	res.json({ message: "server" });
});

// app.post("/upload", upload.single("image"), (req, res) => {
// 	res.json({
// 		url: `/uploads/${req.file.originalname}`,
// 	});
// });

// app.post("/uploadAvatar", upload.single("image"), (req, res) => {
// 	res.json({
// 		url: `/uploads/${req.file.originalname}`,
// 	});
// });

app.get("/auth/me", UserController.getMe);

app.post("/auth/register", UserController.registerUser);
app.post("/auth/login", UserController.loginUser);
app.get("/user/:id", UserController.getUser);

app.post("/friend/:id", FriendsController.addNewFriend);
app.delete("/friend/:id", FriendsController.deleteFriend);
app.get("/friends/:id", FriendsController.getFriends);

app.get("/posts", PostController.getFriendsPosts);
app.get("/posts/:id", PostController.getOneUserPosts);
app.get("/friendsPosts/:id", PostController.getFriendsPosts);
app.post("/post", PostController.createPost);
app.delete("/posts/:id", PostController.deletePost);
app.patch("/posts/:id", PostController.likePost);

app.post("/chat", ChatController.addChat);
app.get("/chat/:id", ChatController.getChat);

app.post("/message/:id", MessageController.addMessage);
app.get("/message/:id", MessageController.getMessage);

app.listen(port, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
