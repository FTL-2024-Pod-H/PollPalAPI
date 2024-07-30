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
                likes: true,
                replies: {
                    include:{
                        author: true
                    }
                }
            }
        }),
        prisma.post.count()
    ]);
    console.log("Fetched posts with replies:", posts);
    return { posts, totalPosts };
};


const getPostById = async (post_id) => {
    return await prisma.post.findUnique({
        where: {post_id: parseInt(post_id)},
        include: { 
            author: true, 
            likes: true,
            replies: {
                include:{
                    author: true
                }
            }
        }
    });
};


const createPost = async( userContent) => {
    return await prisma.post.create({
        data: {
            content: userContent.content,
            author: {connect: {user_id: userContent.author_id}}
        },
        include: { 
            author: true, 
            likes: true,
            replies: {
                include:{
                    author: true
                }
            }
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
            include: { author: true, likes: true, replies: true }
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

const createReply = async (post_id,userContent) => {
    // const { content, author_id, post_id } = userContent;
    return prisma.reply.create({
        data: {
            content: userContent.content,
            author: { connect: { user_id: userContent.author_id } },
            post: { connect: { post_id: post_id } },
        },
        include: {
            author: true,
            post: true
        },
    });
};

const getRepliesByPostId = async (post_id) => {
    return prisma.reply.findMany({
        where: { post_id: parseInt(post_id) },
        include: {
            author: true,
            post: true
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
};
//   const getAllReplies = async () => {
//     return prisma.reply.findMany();
//   };

// const deleteReply = async (post_id, reply_id) => {
//     // Check if the reply belongs to the specified post
//     const reply = await prisma.reply.findUnique({
//         where: { reply_id: parseInt(reply_id) }
//     });

//     if (reply && reply.post_id === parseInt(post_id)) {
//         return prisma.reply.delete({
//             where: { reply_id: parseInt(reply_id) }
//         });
//     } else {
//         throw new Error('Reply not found or does not belong to the specified post');
//     }
// };


module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    checkIfLiked,
    getUserPosts,
    createReply,
    getRepliesByPostId,
    // getAllReplies
};