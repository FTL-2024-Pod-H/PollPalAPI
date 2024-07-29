const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createUser, findUserByUsername, findUserById} = require("../models/userModel");
const userModel = require("../models/userModel");


//Register user -- hashing for password
const register = async (req, res) => {
    const {name, username, password, address} = req.body //maybe need to add name, address
    try {
        // check if all required fields are provided
         if (!name || !username || !password || !address ) {
            return res.status(400).json({error: "All fields are required"})
         }


        //hash password using brycpt and salt factor 10
        //salt -- number iterations the hashing algorithm will perform
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("hashedPassword", hashedPassword)

        // check if the user already exists
        const existingUser = await findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({error: "Username already exists"})
            }


        // user model to be saved using the hashedpassword
        const user = await createUser(name, username, hashedPassword, address)
        console.log("user", user)
        //201 -- successful recreation
        res.status(201).json({ message: "User successfully created", user})

    } catch (error){ 
        // required filed missing
        res.status(400).json({error: "User register error, maybe the user exists"})
    }
}

//login user
// make sure user exists, and password they entered is correct
const login = async (req, res) => {
    const {name, username, password, address} = req.body;
    const user = await findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
        // creating a JSON webtoken
        const token = jwt.sign({userId: user.user_id, userName: user.username, fullName: user.name}, "SECRET KEY");
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

module.exports = {
    register,
    login,
    getAllUsers
} 