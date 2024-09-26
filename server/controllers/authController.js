const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require('../utils/generateToken.js');//.default;

module.exports.login = async function login(req, res) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.username,
			//profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports.signup = async function signup(req, res) {
	try {
		const { firstName, lastName, email, password, confirmPassword } = req.body;
		

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ error: "קיים חשבון לכתובת מייל זו" });
		}

		

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		
		// // https://avatar-placeholder.iran.liara.run/

		// //const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		// //const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			Association: []
			//gender,
			//profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});
		

		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
		
			await newUser.save();
			
		
			res.status(201).json({
				_id: newUser._id,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				email: newUser.email,
				Association: newUser.Association,
				//profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}


	} catch (err) {
		console.log("Error in signup controller", err.message);
		res.status(500).json({ error: "Internal Server Error" });
		
	}
}

module.exports.logout = async function logout(req, res) {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}