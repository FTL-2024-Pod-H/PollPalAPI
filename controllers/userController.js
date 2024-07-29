const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createUser, findUserByUsername, findUserById } = require("../models/userModel");
const userModel = require("../models/userModel");


//Register user -- hashing for password
const register = async (req, res) => {
    const {name, username, password, address} = req.body //maybe need to add name, address
    try {
        //hash password using brycpt and salt factor 10
        //salt -- number iterations the hashing algorithm will perform
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("hashedPassword", hashedPassword)
        // user model to be saved using the hashedpassword
        const user = await createUser(name, username, hashedPassword, address)
        console.log("user", user)
        //201 -- successful recreation
        res.status(201).json(user)

    } catch (error){
        res.status(400).json({ error: "User register error, maybe the user exists" });
    }
}

//login user
// make sure user exists, and password they entered is correct
const login = async (req, res) => {
    const {name, username, password, address} = req.body;
    const user = await findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
        // creating a JSON webtoken
        const token = jwt.sign({userId: user.user_id, userName: user.username}, "SECRET KEY");
        res.status(200).json({token})
    } else {
        res.status(401).json({error: "Invalid Credentials"})
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const updateUser = async(req, res) => {
    try {
        const updatedUser = await userModel.updateUser(req.params.id, req.body);
        if (updatedUser) {
            res.status(200).json(updatedUser)
        } else {
            res.status(404).json({error: "User not found"});
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//update user by ID

module.exports = {
    register,
    login,
    getAllUsers, 
    updateUser
} 