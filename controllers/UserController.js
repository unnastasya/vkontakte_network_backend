const UserModel = require("../models/User.js");
const bcrypt = require("bcrypt");

const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.headers.authorization);

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
			});
		}
		const { passwordHash, ...userData } = user._doc;

		res.json(userData);
	} catch (err) {
		res.status(500).json({
			message: "Нет доступа",
		});
	}
};

const registerUser = async (req, res) => {
	try {
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			name: req.body.name,
			surname: req.body.surname,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			city: req.body.city,
			studyPlace: req.body.studyPlace,
			birthdayDate: req.body.birthdayDate,
			age: req.body.age,
			passwordHash: hash,
		});

		const user = await doc.save();

		const { passwordHash, ...userData } = user._doc;

		res.json(userData);
	} catch (error) {
		res.status(500).json({
			message: "Не удалось зарегистрироваться",
		});
	}
};

const loginUser = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });
		console.log(user);
		if (!user) {
			return res.status(404).send({
				message: "Пользователь не найден",
			});
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);

		if (!isValidPass) {
			return res.status(400).send({
				message: "Неверный логин или пароль",
			});
		}

		const { passwordHash, ...userData } = user._doc;
		console.log(userData);
		res.json(userData);
	} catch (error) {
		res.status(500).json({
			message: "Не удалось авторизоваться",
		});
	}
};

const getUser = async (req, res) => {
	UserModel.findById(req.params.id)
		.then((user) => {
			if (!user) {
				return res.status(404).json({
					message: "Пользователь не найден",
				});
			}
			const { passwordHash, ...userData } = user._doc;

			res.status(200).json(userData);
		})
		.catch((error) => res.status(500).send(error.message));
};

module.exports = {
	registerUser,
	loginUser,
	getUser,
	getMe,
};
