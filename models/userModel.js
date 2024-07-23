const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// function to Register user -- (create prisma)
const createUser = async (name, username, password, address) => { //maybe need to add name, address
    return await prisma.user.create({
        data: {name, address, username, password} //maybe need to add name, address
    })
}

// function to Login in user (findUnique prisma)
// find user by id/username
const findUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username }
    })
}

const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {id },
    });
};

const getAllUsers = async () => {
    return await prisma.user.findMany();
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
    getAllUsers
}