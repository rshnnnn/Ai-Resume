const userModel = require("../models/users.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @desc Register a new user,expect username, email, and password in the request body
 * @access Public
 */ 


const registerUserController = async (req, res) => {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, email, and password" })
    }

    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" })
    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.cookie("token", token)

    res.status(201).json({
         message: "User registered successfully",
         user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
         },
            token
    })



  

}

/**
 * @name loginUserController
 * @desc Login a user, expect username and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password"
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name logoutUserController
 * @desc Clear token from user cookie and add the token in blacklist 
 * @access Public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token
    if (token){
            await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"User Logged Out Successfully"
    })
}

/**
 * @name getMeController
 * @desc Get the current logged in user details
 * @access private
 */

async function getMeController(req,res){

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"User details fetch successfully ",
        user:{
            id:user.id,
            username:user.username,
            email:user.email
        }
    })
}


module.exports = { registerUserController, loginUserController, logoutUserController , getMeController }