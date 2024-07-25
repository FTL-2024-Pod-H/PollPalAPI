const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllPosts = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true,
                likes: true
            }
        }),
        prisma.post.count()
    ]);
    return { posts, totalPosts };
};


const getPostById = async (post_id) => {
    return prisma.post.findUnique({
        where: {post_id: parseInt(post_id)},
        include: { 
            author: true, 
            likes: true 
        }
    });
};


const createPost = async( userContent) => {
    return prisma.post.create({
        data: {
            content: userContent.content,
            author: {connect: {user_id: userContent.author_id}}
        },
        include: {
            author: true,
            likes: true
        }
    });
};


const deletePost = async (post_id) => {
    // Delete associated likes first
    await prisma.likedPost.deleteMany({
        where: { post_id: parseInt(post_id) }
    });
    
    // Then delete the post
    return prisma.post.delete({
        where: { post_id: parseInt(post_id) }
    });
};

const getUserPosts = async (userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
            where: { author_id: parseInt(userId) },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { author: true, likes: true }
        }),
        prisma.post.count({ where: { author_id: parseInt(userId) } })
    ]);
    return { posts, totalPosts };
};

// ADD AND EDIT POST (UPDATE)

// const updatePost = async(post_id, content) => {
//     return prisma.post.update({
//         where: {post_id: parseInt(post_id)},
//         data: content
//     });
// }

const likePost = async (user_id, post_id) => {
    return prisma.likedPost.create({
        data: {
            user: { connect: { user_id: parseInt(user_id) } },
            post: { connect: { post_id: parseInt(post_id) } }
        }
    });
};

const unlikePost = async (user_id, post_id) => {
    return prisma.likedPost.delete({
        where: {
            user_id_post_id: {
                user_id: parseInt(user_id),
                post_id: parseInt(post_id)
            }
        }
    });
};

const checkIfLiked = async (post_id, user_id) => {
    const result = await prisma.likedPost.findFirst({
        where: {
            post_id: parseInt(post_id),
            user_id: parseInt(user_id)
        }
    });
    return !!result; 
};



module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    checkIfLiked,
    getUserPosts
};