const postModel = require("../models/postModel");

const getAllPosts = async(req, res) => {
    try{
        const post = await postModel.getAllPosts();
        res.status(200).json(post);
    }catch (error){
        res.status(400).json({error: error.message})
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

const likePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        const likedPost = await postModel.likePost(user_id, post_id);
        res.status(200).json(likedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unlikePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        const unlikedPost = await postModel.unlikePost(user_id, post_id);
        res.status(200).json(unlikedPost);
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
    unlikePost
};