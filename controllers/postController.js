const postModel = require("../models/postModel");

// const getAllPosts = async(req, res) => {
//     try{
//         const post = await postModel.getAllPosts();
//         res.status(200).json(post);
//     }catch (error){
//         res.status(400).json({error: error.message})
//     }
// };
const getAllPosts = async(req, res) => {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query params
    try {
        const { posts, totalPosts } = await postModel.getAllPosts(Number(page), Number(limit));
        res.status(200).json({ posts, totalPosts });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getPostsById = async (req, res) => {
    try{
        const post = await postModel.getPostById(req.params.post_id);
        if(post){
            res.status(200).json(post);
        }else{
            res.status(400).json("Post Not Found");
        }
    }catch (error) {
        res.status(400).json({error: error.message});
    }
};

const createPost = async (req, res) => {
    const userContent = req.body;
    try{
        const newPost = await postModel.createPost(userContent);
        res.status(200).json(newPost);
    }catch (error){
        res.status(400).json({error: error.message});
    }
};

const deletePost = async (req, res) => {
    try{
        const deletedPost = await postModel.deletePost(req.params.post_id);
        if(deletedPost){
            res.status(200).json(deletedPost);
        }else{
            res.json(400).json({error: "Post not Found"});
        }
    }catch (error){
        res.status(400).json({error: error.message});
    }
};

// LIKE 

// const likePost = async (req, res) => {
//     const { user_id, post_id } = req.body;
//     try {
//         const likedPost = await postModel.likePost(user_id, post_id);
//         res.status(200).json(likedPost);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
const likePost = async (req, res) => {
    const { user_id } = req.body;
    const post_id = parseInt(req.params.post_id);
    try {
        const likedPost = await postModel.likePost(user_id, post_id);
        res.status(200).json(likedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 
const unlikePost = async (req, res) => {
    const { user_id } = req.body;
    const post_id = parseInt(req.params.post_id);
    try {
        const unlikedPost = await postModel.unlikePost(user_id, post_id);
        res.status(200).json(unlikedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const checkIfLiked = async (req, res) => {
    const { post_id, user_id } = req.params;
    try {
        const isLiked = await postModel.checkIfLiked(post_id, user_id);
        res.status(200).json({ isLiked });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllPosts,
    getPostsById,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    checkIfLiked
};