const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllReplies = async () => {
    return prisma.reply.findMany();
  };

module.exports ={
    getAllReplies
};