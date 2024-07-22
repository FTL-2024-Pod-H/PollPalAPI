const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createUser, findUserByUsername, findUserById} = require("../models/userModel")


//Register user -- hashing for password
const register = async (req, res) => {
    const {username, password} = req.body //maybe need to add name, address
    try {
        //hash password using brycpt and salt factor 10
        //salt -- number iterations the hashing algorithm will perform
        const hashedPassword = await bcrypt.hash(password, 10)
        // user model to be saved using the hashedpassword
        const user = await createUser(username, hashedPassword)

    } catch (error){
        res.status(400).json({ error: "User register error, maybe the user exists" });
    }
}

//login user

module.exports = {
    register
} 