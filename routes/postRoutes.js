const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.getAllPosts);
router.get("/:post_id", postController.getPostsById);

router.post("/", postController.createPost);
router.delete("/:post_id", postController.deletePost);

router.post('/:post_id/like', postController.likePost);
router.post('/:post_id/unlike', postController.unlikePost);

router.get('/:post_id/liked-by/:user_id', postController.checkIfLiked);


module.exports = router;