const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createUser, findUserByUsername, findUserById} = require("../models/userModel")


//Register user -- hashing for password
const register = async (req, res) => {
    const {name, username, password, address} = req.body //maybe need to add name, address
    try {
        //hash password using brycpt and salt factor 10
        //salt -- number iterations the hashing algorithm will perform
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("hashedPassword", hashedPassword)
        // user model to be saved using the hashedpassword
        const user = await createUser(name, username, hashedPassword, username)
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
        const token = jwt.sign({userId: user.user_id, userName: user.username}, process.env.SECRET_KEY); // setup env variable for secret key
        res.status(200).json({token})
    } else {
        res.status(401).json({error: "Invalid Credentials"})
    }
}

module.exports = {
    register,
    login
} 